import React, { useState, useEffect } from 'react';
import './SelectionIndicator.css';

interface SelectionIndicatorProps {
    isSelected: boolean;
    onAnimationComplete?: () => void;
}

const SelectionIndicator: React.FC<SelectionIndicatorProps> = ({
    isSelected,
    onAnimationComplete
}) => {
    const [isVisible, setIsVisible] = useState(false);
    const [isExiting, setIsExiting] = useState(false);

    useEffect(() => {
        if (isSelected) {
            // Show and fly in
            setIsVisible(true);
            setIsExiting(false);
        } else if (isVisible) {
            // Start fly-away animation
            setIsExiting(true);

            // Hide after animation completes
            const timer = setTimeout(() => {
                setIsVisible(false);
                setIsExiting(false);
                onAnimationComplete?.();
            }, 500); // Match CSS animation duration

            return () => clearTimeout(timer);
        }
    }, [isSelected, isVisible, onAnimationComplete]);

    if (!isVisible) return null;

    return (
        <div className={`selection-indicator ${isExiting ? 'fly-away' : ''}`}>
            <img
                src={`${process.env.PUBLIC_URL}/assets/Cogworker.png`}
                alt="Selection Indicator"
                className="selection-indicator-image"
            />
        </div>
    );
}; export default SelectionIndicator;