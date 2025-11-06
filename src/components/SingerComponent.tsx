import React, { useState, useEffect } from 'react';
import './SingerComponent.css';
import { Singer } from '../types/Singer';
import MusicalNote from './MusicalNote';
import SelectionIndicator from './SelectionIndicator';

interface SingerComponentProps {
    singer: Singer;
    index: number;
    totalInRow: number;
    onSingerSelect: (id: string) => void;
    onUpdatePosition?: (id: string, xPosition: number) => void;
    isDisabled?: boolean;
}

const SingerComponent: React.FC<SingerComponentProps> = ({
    singer,
    index,
    totalInRow,
    onSingerSelect,
    onUpdatePosition,
    isDisabled = false
}) => {
    const [showNote, setShowNote] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [isMouseDown, setIsMouseDown] = useState(false);
    const [dragStartX, setDragStartX] = useState(0);
    const [startPosition, setStartPosition] = useState(0);

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





    // Mouse handlers - distinguish between click and drag
    const handleMouseDown = (e: React.MouseEvent) => {
        console.log(`🖱️ Mouse down on singer ${singer.id} (${singer.template.alt})`);

        if (isDisabled) {
            console.log(`❌ Singer ${singer.id} is disabled, ignoring interaction`);
            return;
        }

        e.preventDefault();
        e.stopPropagation();

        console.log(`🎯 Mouse down for singer ${singer.id} at clientX: ${e.clientX}, current xPosition: ${singer.xPosition || 0}`);

        setIsMouseDown(true);
        setDragStartX(e.clientX);
        setStartPosition(singer.xPosition || 0);
    };

    // Use useEffect to handle global mouse events
    React.useEffect(() => {
        if (!isMouseDown) {
            // Remove body class when not interacting
            document.body.classList.remove('dragging');
            return;
        }

        console.log(`🔄 Setting up global mouse listeners for singer ${singer.id}`);

        const handleMouseMove = (e: MouseEvent) => {
            const deltaX = Math.abs(e.clientX - dragStartX);

            // Start dragging if mouse moves more than 5 pixels
            if (deltaX > 5 && !isDragging) {
                console.log(`🎯 Starting drag for singer ${singer.id} - movement detected: ${deltaX}px`);
                setIsDragging(true);
                document.body.classList.add('dragging');
            }

            if (isDragging) {
                console.log(`↔️ Mouse move - clientX: ${e.clientX}, dragStartX: ${dragStartX}`);

                const actualDeltaX = e.clientX - dragStartX;
                const newX = startPosition + actualDeltaX;

                // Apply absolute limits relative to stage center (0 position)
                const minX = -350;
                const maxX = 350;
                const clampedX = Math.max(minX, Math.min(maxX, newX));

                console.log(`📍 Position calc - startPos: ${startPosition}, deltaX: ${actualDeltaX}, newX: ${newX}, clampedX: ${clampedX} (stage limits: ${minX} to ${maxX})`);

                // Update position immediately for visual feedback
                if (onUpdatePosition) {
                    onUpdatePosition(singer.id, clampedX);
                }
            }
        };

        const handleMouseUp = (e: MouseEvent) => {
            console.log(`⬆️ Mouse up for singer ${singer.id} at clientX: ${e.clientX}`);

            // If we never started dragging, treat it as a click (selection)
            if (!isDragging) {
                console.log(`🎯 Click detected - selecting singer ${singer.id}`);
                onSingerSelect(singer.id);
            } else {
                console.log(`🎯 Drag completed for singer ${singer.id}`);
                // Also select when dragging completes
                onSingerSelect(singer.id);
            }

            // Reset all states
            setIsMouseDown(false);
            setIsDragging(false);
            document.body.classList.remove('dragging');
        };

        document.addEventListener('mousemove', handleMouseMove, { passive: false });
        document.addEventListener('mouseup', handleMouseUp, { passive: false });

        // Cleanup function
        return () => {
            console.log(`🧹 Cleaning up mouse listeners for singer ${singer.id}`);
            document.body.classList.remove('dragging');
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isMouseDown, isDragging, dragStartX, startPosition, singer.id, singer.isFlipped, onUpdatePosition, onSingerSelect]);



    const singerClasses = [
        'singer-component',
        'singer',
        singer.template.classes,
        singer.isFlipped ? 'flipped' : '',
        singer.isSinging ? 'singing' : '',
        singer.isSelected ? 'selected' : '',
        isDisabled ? 'disabled' : ''
    ].filter(Boolean).join(' ');

    console.log(`🎨 Rendering singer ${singer.id} with xPosition: ${singer.xPosition}, classes: ${singerClasses}`);

    return (
        <div
            className={`${singerClasses} ${isDragging ? 'dragging' : ''}`}
            onMouseDown={handleMouseDown}
            title={isDisabled ? 'Disabled during elevated melody' : 'Drag to move position'}
            data-position={singer.position}
            style={{
                '--singer-x-offset': `${singer.xPosition || 0}px`,
                '--singer-y-offset': `${singer.yOffset || 0}px`,
                zIndex: singer.zIndex || 10
            } as React.CSSProperties & { '--singer-x-offset': string; '--singer-y-offset': string }}
        >
            <div className="singer-images">
                <div className="image-body-container">
                    <img
                        src={singer.template.bodyImg}
                        className="image-body"
                        alt={`${singer.template.alt} Body`}
                    />
                    {!singer.template.classes.includes('singer-destroyed') && (
                        <img
                            src={singer.template.headImg}
                            className="image-head"
                            alt={`${singer.template.alt} Head`}
                        />
                    )}

                </div>
            </div>

            {showNote && <MusicalNote />}
            <SelectionIndicator isSelected={singer.isSelected || false} />
        </div>
    );
};

export default SingerComponent;