import React from 'react';
import './ChoirFormation.css';
import SingerComponent from './SingerComponent';
import { Singer } from '../types/Singer';

interface ChoirFormationProps {
    singers: Singer[];
    onSingerClick: (id: string) => void;
    onRemoveSinger: (id: string) => void;
    onFlipSinger: (id: string) => void;
}

const ChoirFormation: React.FC<ChoirFormationProps> = ({
    singers,
    onSingerClick,
    onRemoveSinger,
    onFlipSinger
}) => {
    // Split singers into front and back rows with maximum 4 per row
    const frontRowSingers = singers.filter(singer => singer.position === 'front').slice(0, 4);
    const backRowSingers = singers.filter(singer => singer.position === 'back').slice(0, 4);

    return (
        <div className="choir-formation-container">
            {/* Bridge corners - structural elements of the stage */}
            <div className="stage-corner top-left-corner">
                <img
                    src="/assets/Understore_extender_bridge_0004_1.png"
                    alt="Stage Corner"
                    className="corner-bridge"
                />
            </div>
            <div className="stage-corner top-right-corner">
                <img
                    src="/assets/Understore_extender_bridge_0004_1.png"
                    alt="Stage Corner"
                    className="corner-bridge"
                />
            </div>


            {singers.length === 0 ? (
                <div className="choir-placeholder">
                    <div className="placeholder-content">
                        <div className="placeholder-title">The workshop stands silent...</div>
                        <div className="placeholder-subtitle">
                            Select clockwork statues to hear the Architects Melody!
                        </div>
                    </div>
                </div>
            ) : (
                <div className="choir-formation">
                    {/* Pedestal for all singers */}
                    <div className="choir-pedestal">
                        <img
                            src="/assets/Cog_Choir__0000_top_brace.png"
                            alt="Choir Pedestal"
                            className="pedestal-image"
                        />
                    </div>

                    {/* Back row singers - positioned behind */}
                    {backRowSingers.length > 0 && (
                        <div className="back-row">
                            {backRowSingers.map((singer, index) => (
                                <SingerComponent
                                    key={singer.id}
                                    singer={singer}
                                    index={index}
                                    totalInRow={backRowSingers.length}
                                    onSingerClick={onSingerClick}
                                    onRemoveSinger={onRemoveSinger}
                                    onFlipSinger={onFlipSinger}
                                />
                            ))}
                        </div>
                    )}

                    {/* Front row singers - positioned in front */}
                    {frontRowSingers.length > 0 && (
                        <div className="front-row">
                            {frontRowSingers.map((singer, index) => (
                                <SingerComponent
                                    key={singer.id}
                                    singer={singer}
                                    index={index}
                                    totalInRow={frontRowSingers.length}
                                    onSingerClick={onSingerClick}
                                    onRemoveSinger={onRemoveSinger}
                                    onFlipSinger={onFlipSinger}
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