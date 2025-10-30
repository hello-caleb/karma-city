import { SynergyType, SynergyState, SynergyPreviewData, Building, SYNERGY_TYPES } from './gameTypes';

export class SynergyCalculator {
  private grid: (string | null)[][];
  private buildings: Building[];
  private previewCache: Map<string, SynergyPreviewData>;

  constructor(grid: (string | null)[][], buildings: Building[]) {
    this.grid = grid;
    this.buildings = buildings;
    this.previewCache = new Map();
  }

  /**
   * Calculate all active synergies on the grid
   * Returns a complete synergy state with all active synergies and building mappings
   */
  calculateAllSynergies(): SynergyState {
    const activeSynergies = new Map<string, SynergyType>();
    const buildingSynergies = new Map<string, string[]>();

    // Iterate through each cell in the grid
    for (let row = 0; row < this.grid.length; row++) {
      const gridRow = this.grid[row];
      if (!gridRow) continue;
      
      for (let col = 0; col < gridRow.length; col++) {
        const buildingId = gridRow[col];
        if (buildingId) {
          const synergies = this.calculateBuildingSynergies(row, col, buildingId);
          if (synergies.length > 0) {
            const positionKey = `${row}-${col}`;
            buildingSynergies.set(positionKey, synergies.map(s => s.id));
            
            // Add each synergy with a unique key that includes position
            synergies.forEach(synergy => {
              const synergyKey = `${synergy.id}-${row}-${col}`;
              activeSynergies.set(synergyKey, synergy);
            });
          }
        }
      }
    }

    return {
      activeSynergies,
      buildingSynergies,
      totalSynergies: activeSynergies.size
    };
  }

  /**
   * Calculate synergies for a specific building at given position
   * Returns array of active synergy types for this building
   */
  calculateBuildingSynergies(row: number, col: number, buildingId: string): SynergyType[] {
    const synergies: SynergyType[] = [];
    const adjacentBuildings = this.getAdjacentBuildings(row, col);

    // Check each synergy type
    SYNERGY_TYPES.forEach(synergyType => {
      if (synergyType.id === 'community-center') {
        // Special case: Community Center (3+ adjacent buildings)
        if (adjacentBuildings.length >= 3) {
          synergies.push(synergyType);
        }
      } else {
        // Standard synergies - check if this building participates in the synergy
        if (synergyType.buildings.includes(buildingId)) {
          // Check if we have the required adjacent buildings for this synergy
          const hasRequiredAdjacent = this.hasRequiredAdjacentBuildings(
            buildingId, 
            adjacentBuildings, 
            synergyType
          );
          
          if (hasRequiredAdjacent) {
            synergies.push(synergyType);
          }
        }
      }
    });

    return synergies;
  }

  /**
   * Get all adjacent buildings (horizontal and vertical neighbors only)
   * Returns array of adjacent building information
   */
  getAdjacentBuildings(row: number, col: number): Array<{row: number, col: number, buildingId: string}> {
    const adjacent: Array<{row: number, col: number, buildingId: string}> = [];
    const directions: Array<[number, number]> = [[-1, 0], [1, 0], [0, -1], [0, 1]]; // up, down, left, right

    directions.forEach(([dRow, dCol]) => {
      const newRow = row + dRow;
      const newCol = col + dCol;
      
      if (this.isValidPosition(newRow, newCol)) {
        const buildingId = this.grid[newRow]?.[newCol];
        if (buildingId) {
          adjacent.push({ row: newRow, col: newCol, buildingId });
        }
      }
    });

    return adjacent;
  }

  /**
   * Check if the current building has the required adjacent buildings for a synergy
   */
  private hasRequiredAdjacentBuildings(
    currentBuildingId: string,
    adjacentBuildings: Array<{row: number, col: number, buildingId: string}>,
    synergyType: SynergyType
  ): boolean {
    // Get all buildings involved in this synergy
    const requiredBuildings = [...synergyType.buildings];
    
    // Remove the current building from required list (since we already have it)
    const currentBuildingIndex = requiredBuildings.indexOf(currentBuildingId);
    if (currentBuildingIndex >= 0) {
      requiredBuildings.splice(currentBuildingIndex, 1);
    }

    // Check if we have all remaining required buildings in adjacent positions
    return requiredBuildings.every(requiredBuilding => {
      return adjacentBuildings.some(adj => adj.buildingId === requiredBuilding);
    });
  }

  /**
   * Check if a position is within grid bounds
   */
  private isValidPosition(row: number, col: number): boolean {
    return row >= 0 && row < this.grid.length && 
           col >= 0 && col < (this.grid[0]?.length || 0);
  }

  /**
   * Preview potential synergies for building placement with caching
   * Creates a temporary grid simulation to calculate potential synergies
   */
  calculatePreviewSynergies(row: number, col: number, buildingId: string): SynergyPreviewData {
    // Generate cache key based on position, building, and adjacent buildings
    const cacheKey = this.generatePreviewCacheKey(row, col, buildingId);
    
    // Check cache first
    const cachedResult = this.previewCache.get(cacheKey);
    if (cachedResult) {
      return cachedResult;
    }

    // Create temporary grid with the building placed
    const tempGrid = this.grid.map(r => [...r]);
    if (tempGrid[row]) {
      tempGrid[row][col] = buildingId;
    }
    
    // Create temporary calculator with the modified grid
    const tempCalculator = new SynergyCalculator(tempGrid, this.buildings);
    
    // Calculate synergies for the placed building
    const potentialSynergies = tempCalculator.calculateBuildingSynergies(row, col, buildingId);
    
    // Get adjacent buildings that would be affected
    const adjacentBuildings = this.getAdjacentBuildings(row, col);

    const previewData: SynergyPreviewData = {
      position: { row, col },
      buildingId,
      potentialSynergies,
      affectedBuildings: adjacentBuildings.map(adj => ({ row: adj.row, col: adj.col }))
    };

    // Cache the result
    this.previewCache.set(cacheKey, previewData);
    
    return previewData;
  }

  /**
   * Generate cache key for preview calculations
   * Key includes position, building type, and adjacent building configuration
   */
  private generatePreviewCacheKey(row: number, col: number, buildingId: string): string {
    const adjacentBuildings = this.getAdjacentBuildings(row, col);
    const adjacentIds = adjacentBuildings
      .map(adj => `${adj.row}-${adj.col}-${adj.buildingId}`)
      .sort()
      .join('|');
    
    return `${row}-${col}-${buildingId}-${adjacentIds}`;
  }

  /**
   * Clear the preview cache
   * Should be called when the grid changes to invalidate cached previews
   */
  clearPreviewCache(): void {
    this.previewCache.clear();
  }

  /**
   * Get cache statistics for debugging/monitoring
   */
  getCacheStats(): { size: number; maxSize: number } {
    const maxSize = 100; // Reasonable cache size limit
    
    // If cache is getting too large, clear oldest entries
    if (this.previewCache.size > maxSize) {
      const entries = Array.from(this.previewCache.entries());
      const keepEntries = entries.slice(-maxSize * 0.8); // Keep 80% of max size
      
      this.previewCache.clear();
      keepEntries.forEach(([key, value]) => {
        this.previewCache.set(key, value);
      });
    }

    return {
      size: this.previewCache.size,
      maxSize
    };
  }

  /**
   * Calculate synergies for affected area around a building placement
   * More efficient than recalculating entire grid - only updates affected buildings
   */
  calculateAffectedAreaSynergies(row: number, col: number): Map<string, SynergyType[]> {
    const affectedSynergies = new Map<string, SynergyType[]>();
    
    // Get the building at the specified position and its neighbors
    const centerBuilding = this.grid[row]?.[col];
    if (centerBuilding) {
      const centerSynergies = this.calculateBuildingSynergies(row, col, centerBuilding);
      affectedSynergies.set(`${row}-${col}`, centerSynergies);
    }

    // Check all adjacent positions and their synergies
    const adjacentPositions = this.getAdjacentBuildings(row, col);
    adjacentPositions.forEach(({ row: adjRow, col: adjCol, buildingId }) => {
      const adjSynergies = this.calculateBuildingSynergies(adjRow, adjCol, buildingId);
      affectedSynergies.set(`${adjRow}-${adjCol}`, adjSynergies);
    });

    // Also check positions adjacent to the adjacent positions (2-step radius)
    // This handles cases where synergies might be affected by the new building
    adjacentPositions.forEach(({ row: adjRow, col: adjCol }) => {
      const secondLevelAdjacent = this.getAdjacentBuildings(adjRow, adjCol);
      secondLevelAdjacent.forEach(({ row: adj2Row, col: adj2Col, buildingId: adj2BuildingId }) => {
        const positionKey = `${adj2Row}-${adj2Col}`;
        if (!affectedSynergies.has(positionKey)) {
          const adj2Synergies = this.calculateBuildingSynergies(adj2Row, adj2Col, adj2BuildingId);
          affectedSynergies.set(positionKey, adj2Synergies);
        }
      });
    });

    return affectedSynergies;
  }
}
