import React from 'react';
import './ControlPanel.css';

interface ControlPanelProps {
    onRandomize: () => void;
    onRemoveAll: () => void;
    onToggleAllSinging: () => void;
    onPlayElevatedMelody: () => void;
    isAllSinging: boolean;
    isPlayingElevatedMelody: boolean;
    singerCount: number;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
    onRandomize,
    onRemoveAll,
    onToggleAllSinging,
    onPlayElevatedMelody,
    isAllSinging,
    isPlayingElevatedMelody,
    singerCount
}) => {
    return (
        <div className="control-panel">
            <div className="control-group">
                <button
                    className="control-button randomize"
                    onClick={onRandomize}
                    disabled={isPlayingElevatedMelody}
                    title={isPlayingElevatedMelody ? "Disabled during elevated melody" : "Create a random choir formation with 7 singers"}
                >
                    Random Formation
                </button>

                <button
                    className="control-button remove-all"
                    onClick={onRemoveAll}
                    disabled={singerCount === 0 || isPlayingElevatedMelody}
                    title={isPlayingElevatedMelody ? "Disabled during elevated melody" : singerCount === 0 ? "No cogwork statues to remove" : "Dismantle all cogwork statues"}
                >
                    Delete all
                </button>
            </div>

            {singerCount > 0 && (
                <div className="play-controls">
                    <label className="sing-checkbox-label">
                        <input
                            type="checkbox"
                            checked={isAllSinging}
                            onChange={onToggleAllSinging}
                            className="sing-checkbox"
                            disabled={isPlayingElevatedMelody}
                        />
                        <span className="sing-label-text">
                            Hear the Architects Melody (loop)
                        </span>
                    </label>

                    <button
                        className="control-button elevated-melody"
                        onClick={onPlayElevatedMelody}
                        disabled={isPlayingElevatedMelody || singerCount !== 7}
                        title={singerCount !== 7 ? `Need 7 cogwork singers to play elevated melody (currently ${singerCount}/7)` : "Play the complete elevated melody with all 7 cogwork singers"}
                    >
                        {isPlayingElevatedMelody ? 'Playing Elevated Melody...' : `Play Elevated Melody (${singerCount}/7 cogwork singers)`}
                    </button>
                </div>
            )}
        </div>
    );
};

export default ControlPanel;