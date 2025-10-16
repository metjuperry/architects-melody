import React, { useState, useEffect } from 'react';
import './SingerComponent.css';
import { Singer } from '../types/Singer';
import MusicalNote from './MusicalNote';

interface SingerComponentProps {
    singer: Singer;
    index: number;
    totalInRow: number;
    onSingerClick: (id: string) => void;
    onRemoveSinger: (id: string) => void;
    onFlipSinger: (id: string) => void;
}

const SingerComponent: React.FC<SingerComponentProps> = ({
    singer,
    index,
    totalInRow,
    onSingerClick,
    onRemoveSinger,
    onFlipSinger
}) => {
    const [showNote, setShowNote] = useState(false);

    useEffect(() => {
        if (singer.isSinging) {
            let timeout: NodeJS.Timeout;

            const scheduleNextNote = () => {
                // Random interval between 800ms and 3000ms
                const randomInterval = Math.random() * (3000 - 800) + 800;

                timeout = setTimeout(() => {
                    setShowNote(true);
                    setTimeout(() => setShowNote(false), 1500);
                    scheduleNextNote(); // Schedule the next note
                }, randomInterval);
            };

            scheduleNextNote(); // Start the first note

            return () => {
                if (timeout) {
                    clearTimeout(timeout);
                }
            };
        }
    }, [singer.isSinging]);



    const handleClick = () => {
        onSingerClick(singer.id);
    };

    const handleRemove = (e: React.MouseEvent) => {
        e.stopPropagation();
        onRemoveSinger(singer.id);
    };

    const handleFlip = (e: React.MouseEvent) => {
        e.stopPropagation();
        onFlipSinger(singer.id);
    };



    const singerClasses = [
        'singer-component',
        'singer',
        singer.template.classes,
        singer.isFlipped ? 'flipped' : '',
        singer.isSinging ? 'singing' : ''
    ].filter(Boolean).join(' ');

    return (
        <div
            className={singerClasses}
            onClick={handleClick}
            title={`Click to ${singer.isSinging ? 'stop' : 'start'} singing`}
            data-position={singer.position}
        >
            <button
                className="remove-singer"
                onClick={handleRemove}
                title="Remove singer"
            >
                ✕
            </button>

            <button
                className="flip-singer"
                onClick={handleFlip}
                title="Flip singer"
            >
                ⟲
            </button>

            <div className="singer-images">
                <div className="image-body-container">
                    <img
                        src={singer.template.bodyImg}
                        className="image-body"
                        alt={`${singer.template.alt} Body`}
                    />
                    <img
                        src={singer.template.headImg}
                        className="image-head"
                        alt={`${singer.template.alt} Head`}
                    />

                </div>
            </div>

            {showNote && <MusicalNote />}
        </div>
    );
};

export default SingerComponent;