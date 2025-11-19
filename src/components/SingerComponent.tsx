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
    onUpdatePosition?: (id: string, xPosition: number, yOffset?: number) => void;
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
    const [dragStartY, setDragStartY] = useState(0);
    const [startXPosition, setStartXPosition] = useState(0);
    const [startYPosition, setStartYPosition] = useState(0);

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

        if (isDisabled) {
            return;
        }

        onSingerSelect(singer.id);

        e.preventDefault();
        e.stopPropagation();


        setIsMouseDown(true);
        setDragStartX(e.clientX);
        setDragStartY(e.clientY);
        setStartXPosition(singer.xPosition || 0);
        setStartYPosition(singer.yOffset || 0);
    };

    // Use useEffect to handle global mouse events
    React.useEffect(() => {
        if (!isMouseDown) {
            // Remove body class when not interacting
            document.body.classList.remove('dragging');
            return;
        }


        const handleMouseMove = (e: MouseEvent) => {
            const deltaX = Math.abs(e.clientX - dragStartX);
            const deltaY = Math.abs(e.clientY - dragStartY);

            // Start dragging if mouse moves more than 5 pixels in any direction
            if ((deltaX > 5 || deltaY > 5) && !isDragging) {
                setIsDragging(true);
                document.body.classList.add('dragging');
            }

            if (isDragging) {
                const actualDeltaX = e.clientX - dragStartX;
                const actualDeltaY = e.clientY - dragStartY;

                const newX = startXPosition + actualDeltaX;
                const newY = startYPosition + (actualDeltaY * 0.5); // Scale Y movement by 0.5 for finer control

                // Apply absolute limits relative to stage center (0 position)
                const minX = -350;
                const maxX = 350;
                const clampedX = Math.max(minX, Math.min(maxX, newX));

                // Apply Y limits (-70 to 40 as defined in the move functions)
                const minY = -70;
                const maxY = 40;
                const clampedY = Math.max(minY, Math.min(maxY, newY));

                // Update position immediately for visual feedback
                if (onUpdatePosition) {
                    onUpdatePosition(singer.id, clampedX, clampedY);
                }
            }
        };

        const handleMouseUp = (e: MouseEvent) => {

            // Reset all states
            setIsMouseDown(false);
            setIsDragging(false);
            document.body.classList.remove('dragging');
        };

        document.addEventListener('mousemove', handleMouseMove, { passive: false });
        document.addEventListener('mouseup', handleMouseUp, { passive: false });

        // Cleanup function
        return () => {
            document.body.classList.remove('dragging');
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isMouseDown, isDragging, dragStartX, dragStartY, startXPosition, startYPosition, singer.id, onUpdatePosition, onSingerSelect]);



    const singerClasses = [
        'singer-component',
        'singer',
        singer.template.classes,
        singer.isFlipped ? 'flipped' : '',
        singer.isSinging ? 'singing' : '',
        singer.isSelected ? 'selected' : '',
        isDisabled ? 'disabled' : ''
    ].filter(Boolean).join(' ');


    return (
        <div
            className={`${singerClasses} ${isDragging ? 'dragging' : ''}`}
            onMouseDown={handleMouseDown}
            title={isDisabled ? 'Disabled during elevated melody' : 'Drag to move position (X and Y axis)'}
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