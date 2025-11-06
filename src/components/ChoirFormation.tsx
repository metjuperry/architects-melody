import React from 'react';
import './ChoirFormation.css';
import SingerComponent from './SingerComponent';
import { Singer } from '../types/Singer';

interface ChoirFormationProps {
    singers: Singer[];
    onSingerSelect: (id: string) => void;
    onUpdatePosition: (id: string, xPosition: number) => void;
    isDisabled?: boolean;
}

const ChoirFormation: React.FC<ChoirFormationProps> = ({
    singers,
    onSingerSelect,
    onUpdatePosition,
    isDisabled = false
}) => {
    // All singers are now in a single formation with depth controlled by zIndex and yOffset
    const allSingers = singers.slice(0, 8); // Maximum 8 singers total

    return (
        <div className="choir-formation-container">
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
                        <div className="placeholder-title">The workshop stands silent...</div>
                        <div className="placeholder-subtitle">
                            Select cogwork statues to hear the Architects Melody!
                        </div>
                    </div>
                </div>
            ) : (
                <div className="choir-formation">
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
                        <div className="single-formation">
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