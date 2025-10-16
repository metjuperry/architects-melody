import React, { useState, useCallback, useRef, useEffect } from 'react';
import './ChoirApp.css';
import ChoirFormation from './ChoirFormation';
import ControlPanel from './ControlPanel';
import SingerSelector from './SingerSelector';
import { Singer, SingerTemplate } from '../types/Singer';

// Singer templates - using actual image assets
const singerTemplates: SingerTemplate[] = [
    {
        bodyImg: '/assets/Cog_Choir__0004_short_front.png',
        headImg: '/assets/Cog_Choir__0003_short_front_head.png',
        classes: 'singer-short-front',
        alt: 'Short Front'
    },
    {
        bodyImg: '/assets/Cog_Choir__0006_right_short.png',
        headImg: '/assets/Cog_Choir__0005_right_short_head.png',
        classes: 'singer-short-side',
        alt: 'Short Side'
    },
    {
        bodyImg: '/assets/Cog_Choir__0002_tall_front.png',
        headImg: '/assets/Cog_Choir__0001_tall_front_head.png',
        classes: 'singer-tall-front',
        alt: 'Tall Front'
    },
    {
        bodyImg: '/assets/Cog_Choir__0008_right_tall.png',
        headImg: '/assets/Cog_Choir__0007_right_tall_head.png',
        classes: 'singer-tall-side',
        alt: 'Tall Side'
    }
];

// Helper functions for URL parameter encoding/decoding
const encodeSingerConfig = (singers: Singer[]): string => {
    if (singers.length === 0) return '';

    return singers.map(singer => {
        // Find template index
        const templateIndex = singerTemplates.findIndex(t => t.alt === singer.template.alt);
        // Encode as: templateIndex-position-isFlipped
        const positionCode = singer.position === 'front' ? 'f' : 'b';
        const flipCode = singer.isFlipped ? '1' : '0';
        return `${templateIndex}${positionCode}${flipCode}`;
    }).join('-');
};

const decodeSingerConfig = (config: string): Singer[] => {
    if (!config) return [];

    const parts = config.split('-');
    const singers: Singer[] = [];

    for (const part of parts) {
        if (part.length === 3) {
            const templateIndex = parseInt(part[0]);
            const position = part[1] === 'f' ? 'front' : 'back';
            const isFlipped = part[2] === '1';

            if (templateIndex >= 0 && templateIndex < singerTemplates.length) {
                const template = singerTemplates[templateIndex];
                singers.push({
                    id: Math.random().toString(36).substr(2, 9),
                    template,
                    position: position as 'front' | 'back',
                    isFlipped,
                    isSinging: false
                });
            }
        }
    }

    return singers;
};

const ChoirApp: React.FC = () => {
    const [singers, setSingers] = useState<Singer[]>([]);
    const [isAllSinging, setIsAllSinging] = useState(false);
    const [isPlayingElevatedMelody, setIsPlayingElevatedMelody] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const elevatedMelodyRef = useRef<HTMLAudioElement | null>(null);

    // Load configuration from URL on startup
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const config = urlParams.get('choir');
        if (config) {
            const loadedSingers = decodeSingerConfig(config);
            setSingers(loadedSingers);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Only run on mount

    // Save configuration to URL whenever singers change
    useEffect(() => {
        const config = encodeSingerConfig(singers);
        const url = new URL(window.location.href);

        if (config) {
            url.searchParams.set('choir', config);
        } else {
            url.searchParams.delete('choir');
        }

        // Update URL without page reload
        window.history.replaceState(null, '', url.toString());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [singers]); // encodeSingerConfig is a pure function outside component

    // Initialize audio
    useEffect(() => {
        audioRef.current = new Audio('/assets/architect mel front row only loop.wav');
        audioRef.current.loop = true;
        audioRef.current.volume = 0.7;

        elevatedMelodyRef.current = new Audio('/assets/architect mel sequence all join in 2d.wav');
        elevatedMelodyRef.current.loop = false;
        elevatedMelodyRef.current.volume = 0.7;

        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
            if (elevatedMelodyRef.current) {
                elevatedMelodyRef.current.pause();
                elevatedMelodyRef.current = null;
            }
        };
    }, []);



    // Handle audio playback when all singing state changes
    useEffect(() => {
        if (audioRef.current && !isPlayingElevatedMelody) {
            if (isAllSinging && singers.length > 0) {
                audioRef.current.play().catch(console.error);
            } else {
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
            }
        }
    }, [isAllSinging, singers.length, isPlayingElevatedMelody]);

    const generateSingerId = () => Math.random().toString(36).substr(2, 9);

    const addSinger = useCallback((position: 'front' | 'back') => {
        const template = singerTemplates[Math.floor(Math.random() * singerTemplates.length)];
        const isFlipped = Math.random() > 0.5;

        const newSinger: Singer = {
            id: generateSingerId(),
            template,
            position,
            isFlipped,
            isSinging: false
        };

        setSingers(prev => [...prev, newSinger]);
    }, []);

    const addSpecificSinger = useCallback((template: SingerTemplate, position: 'front' | 'back') => {
        const isFlipped = Math.random() > 0.5;

        const newSinger: Singer = {
            id: generateSingerId(),
            template,
            position,
            isFlipped,
            isSinging: false
        };

        setSingers(prev => [...prev, newSinger]);
    }, []);

    const removeSinger = useCallback((id: string) => {
        setSingers(prev => prev.filter(singer => singer.id !== id));
    }, []);

    const removeAllSingers = useCallback(() => {
        setSingers([]);
        setIsAllSinging(false);
    }, []);

    const randomizeChoir = useCallback(() => {
        // Clear existing singers first
        setSingers([]);
        setIsAllSinging(false);

        // Randomly decide formation: either 3 back + 4 front, or 4 back + 3 front
        const frontCount = Math.random() > 0.5 ? 4 : 3;
        const backCount = frontCount === 4 ? 3 : 4;

        const newSingers: Singer[] = [];

        // Add back row singers
        for (let i = 0; i < backCount; i++) {
            const template = singerTemplates[Math.floor(Math.random() * singerTemplates.length)];
            newSingers.push({
                id: generateSingerId(),
                template,
                position: 'back',
                isFlipped: Math.random() > 0.5,
                isSinging: false
            });
        }

        // Add front row singers
        for (let i = 0; i < frontCount; i++) {
            const template = singerTemplates[Math.floor(Math.random() * singerTemplates.length)];
            newSingers.push({
                id: generateSingerId(),
                template,
                position: 'front',
                isFlipped: Math.random() > 0.5,
                isSinging: false
            });
        }

        setSingers(newSingers);
    }, []);

    const toggleAllSinging = useCallback(() => {
        setIsAllSinging(prev => {
            const newState = !prev;
            setSingers(singers => singers.map(singer => ({
                ...singer,
                isSinging: newState
            })));
            return newState;
        });
    }, []);

    const playElevatedMelody = useCallback(() => {
        if (elevatedMelodyRef.current && singers.length === 7) {
            setIsPlayingElevatedMelody(true);

            // Stop the regular melody if it's playing
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
            }
            setIsAllSinging(false);

            // Make all singers sing
            setSingers(singers => singers.map(singer => ({
                ...singer,
                isSinging: true
            })));

            // Play the elevated melody
            elevatedMelodyRef.current.currentTime = 0;
            elevatedMelodyRef.current.play().catch(console.error);

            // Listen for the end of the melody
            const handleEnded = () => {
                setIsPlayingElevatedMelody(false);
                setSingers(singers => singers.map(singer => ({
                    ...singer,
                    isSinging: false
                })));
                if (elevatedMelodyRef.current) {
                    elevatedMelodyRef.current.removeEventListener('ended', handleEnded);
                }
            };

            elevatedMelodyRef.current.addEventListener('ended', handleEnded);
        }
    }, [singers.length]);

    const toggleSingerSinging = useCallback((id: string) => {
        setSingers(prev => prev.map(singer =>
            singer.id === id
                ? { ...singer, isSinging: !singer.isSinging }
                : singer
        ));
    }, []);

    const flipSinger = useCallback((id: string) => {
        setSingers(prev => prev.map(singer =>
            singer.id === id
                ? { ...singer, isFlipped: !singer.isFlipped }
                : singer
        ));
    }, []);

    const frontRowCount = singers.filter(singer => singer.position === 'front').length;
    const backRowCount = singers.filter(singer => singer.position === 'back').length;

    return (
        <div className="choir-app">
            <header className="choir-header">
                <h1 className="choir-title">Architects Melody configurator</h1>
                <p className="choir-subtitle">Configure the statues and listen to the gift of the Architects</p>
            </header>

            <div className="choir-main">
                <SingerSelector
                    singerTemplates={singerTemplates}
                    onSelectSinger={addSpecificSinger}
                    frontRowCount={frontRowCount}
                    backRowCount={backRowCount}
                />

                <div className="choir-content">
                    <ControlPanel
                        onRandomize={randomizeChoir}
                        onRemoveAll={removeAllSingers}
                        onToggleAllSinging={toggleAllSinging}
                        onPlayElevatedMelody={playElevatedMelody}
                        isAllSinging={isAllSinging}
                        isPlayingElevatedMelody={isPlayingElevatedMelody}
                        singerCount={singers.length}
                    />

                    <ChoirFormation
                        singers={singers}
                        onSingerClick={toggleSingerSinging}
                        onRemoveSinger={removeSinger}
                        onFlipSinger={flipSinger}
                    />
                </div>
            </div>

            {/* Architect's Table (behind architect) */}
            <div className="architect-table">
                <img
                    src="/assets/architect_dressing_0008_1_table.png"
                    alt="Architect's Table"
                    className="table-image"
                />
            </div>

            {/* Twelfth Architect Image */}
            <div className="architect-portrait">
                <img
                    src="/assets/Twelfth_Architect.png"
                    alt="The Twelfth Architect"
                    className="architect-image"
                />
            </div>

            {/* Lower left decoration */}
            <div className="lower-left-decoration">
                <img
                    src="/assets/architect_dressing_0007_1.png"
                    alt="Workshop Decoration"
                    className="decoration-image"
                />
            </div>
        </div>
    );
};

export default ChoirApp;