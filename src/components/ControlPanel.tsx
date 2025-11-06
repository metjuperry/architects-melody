import React from 'react';
import './ControlPanel.css';

interface ControlPanelProps {
    onToggleAllSinging: () => void;
    onPlayElevatedMelody: () => void;
    isAllSinging: boolean;
    isPlayingElevatedMelody: boolean;
    singerCount: number;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
    onToggleAllSinging,
    onPlayElevatedMelody,
    isAllSinging,
    isPlayingElevatedMelody,
    singerCount
}) => {

    return (
        <div className="control-panel">
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
                        disabled={isPlayingElevatedMelody}
                        title={"Play the elevated melody"}
                    >
                        {isPlayingElevatedMelody ? 'Playing Elevated Melody...' : `Play Elevated Melody`}
                    </button>
                </div>
            )}


        </div>
    );
};

export default ControlPanel;