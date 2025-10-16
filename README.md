# Twelfth Architect Workshop

A React-based interactive choir application featuring clockwork singing statues from Silksong

## 🎭 Features

- Interactive clockwork singer placement
- Multiple singer types and positions
- Regular and elevated melody playback
- URL-based configuration saving/loading
- Steampunk visual theme with industrial typography
- **Flexible Controls**: Add to specific rows, randomize formations, control all singers
- **Responsive Design**: Clean, modern UI with glassmorphism effects

## Project Structure

```
src/
├── components/
│   ├── ChoirApp.tsx          # Main application component
│   ├── ChoirFormation.tsx    # Stage and singer layout
│   ├── SingerComponent.tsx   # Individual singer with animations
│   ├── ControlPanel.tsx      # Action buttons and controls
│   ├── MusicalNote.tsx       # Floating musical note animation
│   └── *.css                 # Component-specific styles
├── types/
│   └── Singer.ts             # TypeScript interfaces
└── index.tsx                 # Application entry point
```

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Clone or download this project
2. Install dependencies:

   ```bash
   npm install
   ```

### Development

Start the development server:

```bash
npm start
```

The application will open at [http://localhost:3000](http://localhost:3000)

### Building for Production

Create an optimized production build:

```bash
npm run build
```

## Usage

1. **Add Singers**: Use "Add to Front" or "Add to Back" buttons to create your choir
2. **Individual Singing**: Click any singer to make them sing individually  
3. **Group Singing**: Use the "All Sing Together" checkbox for synchronized performance
4. **Randomize**: Shuffle singer positions and orientations
5. **Remove**: Hover over singers to see remove button, or use "Remove All"

## Technology Stack

- **React 18** with TypeScript for type safety
- **CSS3** with animations and modern effects
- **React Hooks** for state management
- **Component-based architecture** for maintainability

## Performance Notes

- Uses React.memo and useCallback for optimized re-renders
- Efficient SVG-based singer graphics
- Smooth CSS animations with hardware acceleration

## Development

This project was created with Create React App and includes:

- Hot reloading for instant feedback
- TypeScript compilation
- CSS bundling and optimization
- Development and production builds

## License

This project is for educational and demonstration purposes.
I don't own anything. All the assets belong to Team Cherry
