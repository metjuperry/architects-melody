import React from 'react';
import './MusicalNote.css';

const musicalNotes = ['♪', '♫', '♬', '♩'];
const noteColors = [
    '#ff6b6b', // Red
    '#4ecdc4', // Teal
    '#45b7d1', // Blue
    '#96ceb4', // Green
    '#ffeaa7', // Yellow
    '#dda0dd', // Plum
    '#98d8c8', // Mint
    '#f7dc6f', // Gold
    '#bb8fce', // Purple
    '#85c1e9'  // Light Blue
];

const MusicalNote: React.FC = () => {
    const note = musicalNotes[Math.floor(Math.random() * musicalNotes.length)];
    const color = noteColors[Math.floor(Math.random() * noteColors.length)];

    return (
        <div
            className="musical-note"
            style={{
                color: color,
                textShadow: `0 0 10px ${color}80, 0 0 20px ${color}60, 0 0 30px ${color}40`
            }}
        >
            {note}
        </div>
    );
};

export default MusicalNote;