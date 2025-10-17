import React from 'react';
import './SingerSelector.css';
import { SingerTemplate } from '../types/Singer';

interface SingerSelectorProps {
    singerTemplates: SingerTemplate[];
    onSelectSinger: (template: SingerTemplate, position: 'front' | 'back') => void;
    frontRowCount: number;
    backRowCount: number;
    isDisabled?: boolean;
}

const SingerSelector: React.FC<SingerSelectorProps> = ({ singerTemplates, onSelectSinger, frontRowCount, backRowCount, isDisabled = false }) => {
    const MAX_SINGERS_PER_ROW = 4;
    const isFrontRowFull = frontRowCount >= MAX_SINGERS_PER_ROW;
    const isBackRowFull = backRowCount >= MAX_SINGERS_PER_ROW;
    return (
        <div className="singer-selector">
            <h3 className="selector-title">Cogwork Assembly</h3>

            <div className="position-section">
                <h4 className="position-title">Back row ({backRowCount}/{MAX_SINGERS_PER_ROW})</h4>
                <div className="singer-buttons">
                    {singerTemplates.map((template, index) => {
                        const isRowDisabled = isDisabled || isBackRowFull;
                        return (
                            <button
                                key={`back-${index}`}
                                className={`singer-button ${isRowDisabled ? 'disabled' : ''}`}
                                onClick={() => !isRowDisabled && onSelectSinger(template, 'back')}
                                disabled={isRowDisabled}
                                title={isDisabled ? 'Disabled during elevated melody' : isBackRowFull ? 'Rear assembly is complete (4/4)' : `Install ${template.alt} statue in rear assembly`}
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

            <div className="position-section">
                <h4 className="position-title">Front row ({frontRowCount}/{MAX_SINGERS_PER_ROW})</h4>
                <div className="singer-buttons">
                    {singerTemplates.map((template, index) => {
                        const isRowDisabled = isDisabled || isFrontRowFull;
                        return (
                            <button
                                key={`front-${index}`}
                                className={`singer-button ${isRowDisabled ? 'disabled' : ''}`}
                                onClick={() => !isRowDisabled && onSelectSinger(template, 'front')}
                                disabled={isRowDisabled}
                                title={isDisabled ? 'Disabled during elevated melody' : isFrontRowFull ? 'Front mechanism is complete (4/4)' : `Install ${template.alt} statue in front mechanism`}
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
    );
};

export default SingerSelector;