import React from 'react';
import './SingerSelector.css';
import { SingerTemplate } from '../types/Singer';

interface SingerSelectorProps {
    singerTemplates: SingerTemplate[];
    onSelectSinger: (template: SingerTemplate, position: 'front' | 'back') => void;
    frontRowCount: number;
    backRowCount: number;
}

const SingerSelector: React.FC<SingerSelectorProps> = ({ singerTemplates, onSelectSinger, frontRowCount, backRowCount }) => {
    const MAX_SINGERS_PER_ROW = 4;
    const isFrontRowFull = frontRowCount >= MAX_SINGERS_PER_ROW;
    const isBackRowFull = backRowCount >= MAX_SINGERS_PER_ROW;
    return (
        <div className="singer-selector">
            <h3 className="selector-title">Clockwork Assembly</h3>

            <div className="position-section">
                <h4 className="position-title">Back row ({backRowCount}/{MAX_SINGERS_PER_ROW})</h4>
                <div className="singer-buttons">
                    {singerTemplates.map((template, index) => (
                        <button
                            key={`back-${index}`}
                            className={`singer-button ${isBackRowFull ? 'disabled' : ''}`}
                            onClick={() => !isBackRowFull && onSelectSinger(template, 'back')}
                            disabled={isBackRowFull}
                            title={isBackRowFull ? 'Rear assembly is complete (4/4)' : `Install ${template.alt} statue in rear assembly`}
                        >
                            <img
                                src={template.headImg}
                                alt={template.alt}
                                className="singer-head-button"
                            />
                            <span className="singer-label">{template.alt}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="position-section">
                <h4 className="position-title">Front row ({frontRowCount}/{MAX_SINGERS_PER_ROW})</h4>
                <div className="singer-buttons">
                    {singerTemplates.map((template, index) => (
                        <button
                            key={`front-${index}`}
                            className={`singer-button ${isFrontRowFull ? 'disabled' : ''}`}
                            onClick={() => !isFrontRowFull && onSelectSinger(template, 'front')}
                            disabled={isFrontRowFull}
                            title={isFrontRowFull ? 'Front mechanism is complete (4/4)' : `Install ${template.alt} statue in front mechanism`}
                        >
                            <img
                                src={template.headImg}
                                alt={template.alt}
                                className="singer-head-button"
                            />
                            <span className="singer-label">{template.alt}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SingerSelector;