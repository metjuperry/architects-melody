import React from 'react';
import './ChoirFormation.css';
import SingerComponent from './SingerComponent';
import { Singer, SingerTemplate } from '../types/Singer';

interface ChoirFormationProps {
    singers: Singer[];
    onSingerSelect: (id: string) => void;
    onUpdatePosition: (id: string, xPosition: number, yOffset?: number) => void;
    onClearSelection?: () => void;
    isDisabled?: boolean;
    singerTemplates?: SingerTemplate[];
    choirStartTime?: number;
}

const ChoirFormation: React.FC<ChoirFormationProps> = ({
    singers,
    onSingerSelect,
    onUpdatePosition,
    onClearSelection,
    isDisabled = false,
    singerTemplates = [],
    choirStartTime
}) => {
    // All singers are now in a single formation with depth controlled by zIndex and yOffset
    const allSingers = singers; // No limit - allow unlimited singers

    const handleContainerClick = (e: React.MouseEvent) => {
        // Only clear selection if clicking directly on the container or stage elements, not on a singer
        if (onClearSelection) {
            const target = e.target as HTMLElement;
            // Clear selection if clicking on container, pedestal, or other stage elements (but not singers)
            if (
                e.target === e.currentTarget ||
                target.classList.contains('choir-formation') ||
                target.classList.contains('choir-pedestal') ||
                target.classList.contains('pedestal-image') ||
                target.classList.contains('stage-corner') ||
                target.classList.contains('corner-bridge') ||
                target.classList.contains('choir-placeholder') ||
                target.classList.contains('placeholder-content') ||
                target.classList.contains('single-formation')
            ) {
                onClearSelection();
            }
        }
    };

    return (
        <div className="choir-formation-container" onClick={handleContainerClick}>
            {/* Bridge corners - structural elements of the stage */}
            <div className="stage-corner top-left-corner">
                <img
                    src={`${process.env.PUBLIC_URL}/assets/Understore_extender_bridge_0004_1.png`}
                    alt="Stage Corner"
                    className="corner-bridge"
                />
            </div>
            <div className="stage-corner top-right-corner">
                <img
                    src={`${process.env.PUBLIC_URL}/assets/Understore_extender_bridge_0004_1.png`}
                    alt="Stage Corner"
                    className="corner-bridge"
                />
            </div>


            {singers.length === 0 ? (
                <div className="choir-placeholder">
                    <div className="placeholder-content">
                        <div className="placeholder-title">Add a singer</div>
                        <div className="placeholder-subtitle">
                            Select cogwork statues to hear the Architects Melody!
                        </div>
                    </div>
                </div>
            ) : (
                <div className="choir-formation" onClick={handleContainerClick}>
                    {/* Pedestal for all singers */}
                    <div className="choir-pedestal">
                        <img
                            src={`${process.env.PUBLIC_URL}/assets/Cog_Choir__0000_top_brace.png`}
                            alt="Choir Pedestal"
                            className="pedestal-image"
                        />
                    </div>

                    {/* Single formation with all singers using z-index for depth */}
                    {allSingers.length > 0 && (
                        <div className="single-formation" onClick={handleContainerClick}>
                            {allSingers.map((singer, index) => (
                                <SingerComponent
                                    key={singer.id}
                                    singer={singer}
                                    index={index}
                                    totalInRow={allSingers.length}
                                    onSingerSelect={isDisabled ? () => { } : onSingerSelect}
                                    onUpdatePosition={isDisabled ? () => { } : onUpdatePosition}
                                    isDisabled={isDisabled}
                                />
                            ))}
                        </div>
                    )}

                </div>
            )}
        </div>
    );
};

export default ChoirFormation;