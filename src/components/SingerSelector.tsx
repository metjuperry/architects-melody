import React, { useState, useEffect } from 'react';
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
    onRemoveAll
}) => {
    // Remove the MAX_SINGERS limit - allow unlimited singers
    const isFormationFull = false;

    // State for collapsible "Add Singer" section
    const [isAddSectionCollapsed, setIsAddSectionCollapsed] = useState(false);

    // Auto-collapse "Add Singer" section when a singer is selected
    useEffect(() => {
        if (selectedSinger) {
            setIsAddSectionCollapsed(true);
        }
    }, [selectedSinger]);

    return (
        <div className="singer-selector">
            <h3 className="selector-title">Cogwork Assembly</h3>

            <div className="position-section">
                <div className="position-header">
                    <h4 className="position-title">Add Singer ({singerCount})</h4>
                    <button
                        className="collapse-toggle"
                        onClick={() => setIsAddSectionCollapsed(!isAddSectionCollapsed)}
                        title={isAddSectionCollapsed ? "Expand add singer section" : "Collapse add singer section"}
                    >
                        <span className="collapse-text">
                            {isAddSectionCollapsed ? 'Expand' : 'Collapse'}
                        </span>
                    </button>
                </div>
                <div className={`collapsible-content ${isAddSectionCollapsed ? 'collapsed' : 'expanded'}`}>
                    <div className="singer-buttons-grid">
                        {/* Tall Singer Row */}
                        <div className="singer-row tall-row">
                            <h5 className="row-label">Tall Cogwork</h5>
                            <div className="singer-row-buttons">
                                {singerTemplates
                                    .filter(template => template.alt.toLowerCase().includes('tall'))
                                    .map((template, index) => {
                                        const isSelectorDisabled = isDisabled || isFormationFull;
                                        return (
                                            <button
                                                key={`tall-singer-${index}`}
                                                className={`singer-button ${isSelectorDisabled ? 'disabled' : ''}`}
                                                onClick={() => !isSelectorDisabled && onSelectSinger(template, 'front')}
                                                disabled={isSelectorDisabled}
                                                title={isDisabled ? 'Disabled during elevated melody' : `Install ${template.alt} statue`}
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

                        {/* Short Singer Row */}
                        <div className="singer-row short-row">
                            <h5 className="row-label">Short Cogwork</h5>
                            <div className="singer-row-buttons">
                                {singerTemplates
                                    .filter(template => template.alt.toLowerCase().includes('short'))
                                    .map((template, index) => {
                                        const isSelectorDisabled = isDisabled || isFormationFull;
                                        return (
                                            <button
                                                key={`short-singer-${index}`}
                                                className={`singer-button ${isSelectorDisabled ? 'disabled' : ''}`}
                                                onClick={() => !isSelectorDisabled && onSelectSinger(template, 'front')}
                                                disabled={isSelectorDisabled}
                                                title={isDisabled ? 'Disabled during elevated melody' : `Install ${template.alt} statue`}
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
                    </div>
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
                        <div className="movement-instruction">
                            Drag with your mouse or use the arrow keys to position the selected statue
                        </div>
                        <div className="button-controls">
                            {/* Labels Row */}
                            <div className="button-labels-row">
                                <div className="depth-label-section">
                                    <h5 className="button-group-title depth-title">Depth</h5>
                                </div>
                                <div className="actions-label-section">
                                    <h5 className="button-group-title actions-title">Actions</h5>
                                </div>
                            </div>

                            {/* Buttons Row */}
                            <div className="main-buttons-row">
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
                                <button
                                    className="singer-button"
                                    onClick={() => onFlipSinger(selectedSinger.id)}
                                    disabled={isDisabled}
                                    title={isDisabled ? "Disabled during elevated melody" : `Flip ${selectedSinger.template.alt} horizontally`}
                                >
                                    <span className="singer-label">Flip</span>
                                </button>
                            </div>

                            {/* Remove Button Row */}
                            <div className="remove-button-row">
                                <button
                                    className="control-button remove-button-wide remove-all"
                                    onClick={() => onRemoveSinger(selectedSinger.id)}
                                    disabled={isDisabled}
                                    title={isDisabled ? "Disabled during elevated melody" : `Remove ${selectedSinger.template.alt}`}
                                >
                                    <span className="singer-label">Remove</span>
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="no-singer-selected">
                        <div className="selection-prompt">Click a cogwork singer to select</div>
                        <div className="keyboard-hint">Use mouse drag or arrow keys to move</div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SingerSelector;