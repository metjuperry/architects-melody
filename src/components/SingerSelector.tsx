import React from 'react';
import './SingerSelector.css';
import { SingerTemplate, Singer } from '../types/Singer';

interface SingerSelectorProps {
    singerTemplates: SingerTemplate[];
    onSelectSinger: (template: SingerTemplate, position: 'front' | 'back') => void;
    singerCount: number;
    isDisabled?: boolean;
    selectedSinger: Singer | null;
    onRemoveSinger: (id: string) => void;
    onFlipSinger: (id: string) => void;
    onClearSelection: () => void;
    onMoveForward: (id: string) => void;
    onMoveBack: (id: string) => void;
    onMoveUp: (id: string) => void;
    onMoveDown: (id: string) => void;
    onRemoveAll: () => void;
}

const SingerSelector: React.FC<SingerSelectorProps> = ({
    singerTemplates,
    onSelectSinger,
    singerCount,
    isDisabled = false,
    selectedSinger,
    onRemoveSinger,
    onFlipSinger,
    onClearSelection,
    onMoveForward,
    onMoveBack,
    onMoveUp,
    onMoveDown,
    onRemoveAll
}) => {
    const MAX_SINGERS = 8;
    const isFormationFull = singerCount >= MAX_SINGERS;

    return (
        <div className="singer-selector">
            <h3 className="selector-title">Cogwork Assembly</h3>

            <div className="position-section">
                <h4 className="position-title">Add Singer ({singerCount}/{MAX_SINGERS})</h4>
                <div className="singer-buttons">
                    {singerTemplates.map((template, index) => {
                        const isSelectorDisabled = isDisabled || isFormationFull;
                        return (
                            <button
                                key={`singer-${index}`}
                                className={`singer-button ${isSelectorDisabled ? 'disabled' : ''}`}
                                onClick={() => !isSelectorDisabled && onSelectSinger(template, 'front')}
                                disabled={isSelectorDisabled}
                                title={isDisabled ? 'Disabled during elevated melody' : isFormationFull ? 'Assembly is complete (8/8)' : `Install ${template.alt} statue`}
                            >
                                <img
                                    src={template.headImg}
                                    alt={template.alt}
                                    className="singer-head-button"
                                />
                                <span className="singer-label">{template.alt}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="control-group">
                <button
                    className="control-button remove-all"
                    onClick={onRemoveAll}
                    disabled={singerCount === 0 || isDisabled}
                    title={isDisabled ? "Disabled during elevated melody" : singerCount === 0 ? "No cogwork statues to remove" : "Dismantle all cogwork statues"}
                >
                    Delete all
                </button>
            </div>

            {/* Singer Control Section */}
            <div className="singer-controls">
                <h4 className="position-title">Selected Singer</h4>
                {selectedSinger ? (
                    <div className="selected-singer-info">
                        <img
                            src={selectedSinger.template.headImg}
                            alt={selectedSinger.template.alt}
                            className="selected-singer-head"
                        />
                        {/* <div className="singer-name">
                            {selectedSinger.template.alt}
                            {selectedSinger.isFlipped && ' (Flipped)'}
                            {selectedSinger.position === 'back' && ' (Back Row)'}
                        </div> */}
                        <div className="singer-control-buttons">

                            {/* Depth Controls (Z-axis) */}
                            <div className="button-group">
                                <h5 className="button-group-title">Depth</h5>
                                <button
                                    className="singer-button"
                                    onClick={() => onMoveForward(selectedSinger.id)}
                                    disabled={isDisabled}
                                    title={isDisabled ? "Disabled during elevated melody" : `Move ${selectedSinger.template.alt} forward (higher z-index)`}
                                >
                                    <span className="singer-label">Forward</span>
                                </button>
                                <button
                                    className="singer-button"
                                    onClick={() => onMoveBack(selectedSinger.id)}
                                    disabled={isDisabled}
                                    title={isDisabled ? "Disabled during elevated melody" : `Move ${selectedSinger.template.alt} back (lower z-index)`}
                                >
                                    <span className="singer-label">Back</span>
                                </button>
                            </div>

                            {/* Height Controls (Y-axis) */}
                            <div className="button-group">
                                <h5 className="button-group-title">Height</h5>
                                <button
                                    className="singer-button"
                                    onClick={() => onMoveUp(selectedSinger.id)}
                                    disabled={isDisabled}
                                    title={isDisabled ? "Disabled during elevated melody" : `Move ${selectedSinger.template.alt} up (negative y-offset)`}
                                >
                                    <span className="singer-label">Up</span>
                                </button>
                                <button
                                    className="singer-button"
                                    onClick={() => onMoveDown(selectedSinger.id)}
                                    disabled={isDisabled}
                                    title={isDisabled ? "Disabled during elevated melody" : `Move ${selectedSinger.template.alt} down (positive y-offset)`}
                                >
                                    <span className="singer-label">Down</span>
                                </button>
                            </div>

                            {/* Actions */}
                            <div className="button-group">
                                <h5 className="button-group-title">Actions</h5>
                                <button
                                    className="singer-button"
                                    onClick={() => onFlipSinger(selectedSinger.id)}
                                    disabled={isDisabled}
                                    title={isDisabled ? "Disabled during elevated melody" : `Flip ${selectedSinger.template.alt} horizontally`}
                                >
                                    <span className="singer-label">Flip</span>
                                </button>
                                <button
                                    className="singer-button"
                                    onClick={onClearSelection}
                                    disabled={isDisabled}
                                    title={isDisabled ? "Disabled during elevated melody" : "Clear selection"}
                                >
                                    <span className="singer-label">Unselect</span>
                                </button>
                            </div>

                        </div>
                        <button
                            className="control-button remove-all"
                            onClick={() => onRemoveSinger(selectedSinger.id)}
                            disabled={isDisabled}
                            title={isDisabled ? "Disabled during elevated melody" : `Remove ${selectedSinger.template.alt}`}
                        >
                            <span className="singer-label">Remove</span>
                        </button>
                    </div>
                ) : (
                    <div className="no-singer-selected">
                        Click a cogwork singer to select
                    </div>
                )}
            </div>
        </div>
    );
};

export default SingerSelector;