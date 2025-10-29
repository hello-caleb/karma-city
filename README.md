# 🏙️ Karma City

**Build your Reddit town together - A collaborative multiplayer town-building game for Reddit**

## 🎮 What is Karma City?

Karma City is an interactive Reddit game where community members spend their Reddit karma to collaboratively build a shared town. Each player contributes buildings to a 10x10 grid, creating a unique town that represents their subreddit's collective creativity.

## ✨ Features

- **10x10 Collaborative Grid**: A shared town canvas where all community members contribute
- **5 Unique Buildings**: Each with distinct costs, emojis, and effects
  - ⚙️ **Meme Factory** (100 karma) - Churn out fresh content
  - 🛡️ **Bot Defense Grid** (150 karma) - Keep the spam at bay
  - 🎓 **Mod Academy** (250 karma) - Train the chosen ones
  - 🏛️ **Gold Lounge** (500 karma) - Where premium users chill
  - 🗿 **Upvote Monument** (1000 karma) - Peak Reddit achievement
- **Real-time Stats**: Track Your Karma, Town Karma, and Contributors
- **Responsive Design**: Works on both mobile and desktop
- **Persistent State**: Town remains and grows as more people contribute

## 🎯 How to Play

1. Visit r/KarmaCityGame
2. Open a Karma City post
3. Click any empty cell in the 10x10 grid
4. Choose a building you can afford
5. Watch your building appear and contribute to the town!

## 🛠️ Technical Stack

- **Platform**: Devvit (Reddit's developer platform)
- **Frontend**: React + TypeScript
- **State Management**: React Hooks (useState)
- **Styling**: Inline styles for maximum compatibility
- **Build Tool**: Vite

## 📂 Project Structure
```
karma-city/
├── src/
│   ├── client/              # Frontend React code
│   │   ├── components/      # React components
│   │   │   ├── TownGrid.tsx           # 10x10 grid display
│   │   │   └── BuildingSelector.tsx   # Building chooser modal
│   │   ├── hooks/
│   │   │   └── useTownState.ts        # Game state management
│   │   └── App.tsx                     # Main app component
│   ├── server/              # Backend logic
│   │   └── index.ts
│   └── shared/              # Shared types
│       └── gameTypes.ts     # Buildings, state interfaces
├── devvit.yaml              # Devvit configuration
└── package.json             # Dependencies
```

## 🚀 Setup & Development

### Prerequisites
- Node.js v22+
- Reddit account
- Devvit CLI

### Installation
```bash
# Clone the repository
git clone https://github.com/YOUR-USERNAME/karma-city.git
cd karma-city

# Install dependencies
npm install

# Start development server
npm run dev

# Upload to Reddit
npx devvit upload
```

## 🎨 Game Design Philosophy

**Community-First**: Every building placement is a community contribution
**Simple but Engaging**: Easy to understand, fun to participate in
**Reddit-Native**: Uses Reddit karma as the core mechanic
**Asynchronous Multiplayer**: Players contribute at their own pace
**Visual Storytelling**: Each town tells a unique story through building placement

## 🏆 Hackathon Categories

### Primary: Community Play
- **Core Mechanic**: Shared town-building grid
- **Multiplayer**: Asynchronous collaboration
- **Community Engagement**: Every player contributes to collective creation

### Bonus: Kiro Award (AI-Assisted Development)
This project was built with AI assistance (Claude Code) which helped with:
- Component architecture
- Type definitions
- State management patterns
- UI polish and responsiveness

## 🎯 Future Enhancements

- **Persistent Backend**: Redis for true cross-user state
- **More Buildings**: Expand to 10-15 unique structures
- **Animations**: Building placement effects
- **Leaderboards**: Top contributors
- **Multiple Towns**: Different grids for different themes
- **Building Synergies**: Adjacent buildings create bonuses
- **Town Themes**: Different visual styles

## 📸 Screenshots

*[Add screenshots of your game here]*

## 🎥 Demo Video

*[Add link to demo video here]*

## 🙏 Acknowledgments

- Built for Reddit Community Games Hackathon 2025
- Developed with Devvit
- AI assistance by Claude (Anthropic)

## 📄 License

MIT License - Feel free to fork and build upon!

## 🔗 Links

- **Live Demo**: [r/KarmaCityGame](https://reddit.com/r/KarmaCityGame)
- **GitHub**: [karma-city](https://github.com/hello-caleb/karma-city)
- **Developer Portal**: [Reddit Developers](https://developers.reddit.com)

---

**Built with ❤️ for the Reddit community**