import React, { useState, useCallback, useRef, useEffect } from 'react';
import './ChoirApp.css';
import ChoirFormation from './ChoirFormation';
import ControlPanel from './ControlPanel';
import SingerSelector from './SingerSelector';
import { Singer, SingerTemplate } from '../types/Singer';

// Singer templates - using actual image assets
const singerTemplates: SingerTemplate[] = [
    {
        bodyImg: `${process.env.PUBLIC_URL}/assets/Cog_Choir__0004_short_front.png`,
        headImg: `${process.env.PUBLIC_URL}/assets/Cog_Choir__0003_short_front_head.png`,
        classes: 'singer-short-front',
        alt: 'Short Front'
    },
    {
        bodyImg: `${process.env.PUBLIC_URL}/assets/Cog_Choir__0006_right_short.png`,
        headImg: `${process.env.PUBLIC_URL}/assets/Cog_Choir__0005_right_short_head.png`,
        classes: 'singer-short-side',
        alt: 'Short Side'
    },
    {
        bodyImg: `${process.env.PUBLIC_URL}/assets/Cog_Choir__0002_tall_front.png`,
        headImg: `${process.env.PUBLIC_URL}/assets/Cog_Choir__0001_tall_front_head.png`,
        classes: 'singer-tall-front',
        alt: 'Tall Front'
    },
    {
        bodyImg: `${process.env.PUBLIC_URL}/assets/Cog_Choir__0008_right_tall.png`,
        headImg: `${process.env.PUBLIC_URL}/assets/Cog_Choir__0007_right_tall_head.png`,
        classes: 'singer-tall-side',
        alt: 'Tall Side'
    },
    {
        bodyImg: `${process.env.PUBLIC_URL}/assets/CC_destroyed_0000_1.png`,
        headImg: `${process.env.PUBLIC_URL}/assets/CC_destroyed_0000_1.png`,
        classes: 'singer-destroyed-tall',
        alt: 'Destroyed Tall',
        canSing: false
    },
    {
        bodyImg: `${process.env.PUBLIC_URL}/assets/CC_destroyed_0001_1.png`,
        headImg: `${process.env.PUBLIC_URL}/assets/CC_destroyed_0001_1.png`,
        classes: 'singer-destroyed-short',
        alt: 'Destroyed Short',
        canSing: false
    }
];

// Helper functions for URL parameter encoding/decoding
const encodeSingerConfig = (singers: Singer[]): string => {
    if (singers.length === 0) return '';

    return singers.map(singer => {
        // Find template index
        const templateIndex = singerTemplates.findIndex(t => t.alt === singer.template.alt);

        // Compact encoding: use base36 for numbers, single chars for flags
        // Format: templateIndex + position(f/b) + flip(0/1) + base36(xPos+500) + base36(zIdx) + base36(yOff+500)
        // Adding 500 to x/y offsets to handle negative numbers in base36
        const positionCode = singer.position === 'front' ? 'f' : 'b';
        const flipCode = singer.isFlipped ? '1' : '0';
        const xPos = ((singer.xPosition || 0) + 500).toString(36);
        const zIdx = (singer.zIndex || 10).toString(36);
        const yOff = ((singer.yOffset || 0) + 500).toString(36);

        return `${templateIndex}${positionCode}${flipCode}${xPos}.${zIdx}.${yOff}`;
    }).join(',');
};

const decodeSingerConfig = (config: string): Singer[] => {
    if (!config) return [];

    // Detect format: compact (contains '.'), old underscore (contains '_'), or legacy (contains '-')
    const isCompactFormat = config.includes('.') && config.includes(',');
    const isOldUnderscoreFormat = config.includes('_') && config.includes('|');

    let parts: string[];
    if (isCompactFormat) {
        parts = config.split(',');
    } else if (isOldUnderscoreFormat) {
        parts = config.split('|');
    } else {
        parts = config.split('-');
    }

    const singers: Singer[] = [];

    for (const part of parts) {
        if (isCompactFormat) {
            // New compact format: templateIndex + position + flip + base36values
            if (part.length >= 6) { // Minimum: t + p + f + x.z.y
                const templateIndex = parseInt(part[0]);
                const position = part[1] === 'f' ? 'front' : 'back';
                const isFlipped = part[2] === '1';

                const coords = part.substring(3).split('.');
                if (coords.length === 3) {
                    const xPosition = (parseInt(coords[0], 36) || 500) - 500;
                    const zIndex = parseInt(coords[1], 36) || 10;
                    const rawYOffset = (parseInt(coords[2], 36) || 500) - 500;
                    const yOffset = Math.max(-70, Math.min(40, rawYOffset)); // Restrict yOffset between -70px and 40px

                    if (templateIndex >= 0 && templateIndex < singerTemplates.length) {
                        const template = singerTemplates[templateIndex];
                        singers.push({
                            id: Math.random().toString(36).substr(2, 9),
                            template,
                            position: position as 'front' | 'back',
                            isFlipped,
                            isSinging: false,
                            xPosition,
                            zIndex,
                            yOffset,
                            isSelected: false
                        });
                    }
                }
            }
        } else if (isOldUnderscoreFormat) {
            // Old underscore format: templateIndex_position_isFlipped_xPosition_zIndex_yOffset
            const elements = part.split('_');
            if (elements.length === 6) {
                const templateIndex = parseInt(elements[0]);
                const position = elements[1] === 'f' ? 'front' : 'back';
                const isFlipped = elements[2] === '1';
                const xPosition = parseInt(elements[3]) || 0;
                const zIndex = parseInt(elements[4]) || 10;
                const rawYOffset = parseInt(elements[5]) || 0;
                const yOffset = Math.max(-70, Math.min(40, rawYOffset)); // Restrict yOffset between -70px and 40px

                if (templateIndex >= 0 && templateIndex < singerTemplates.length) {
                    const template = singerTemplates[templateIndex];
                    singers.push({
                        id: Math.random().toString(36).substr(2, 9),
                        template,
                        position: position as 'front' | 'back',
                        isFlipped,
                        isSinging: false,
                        xPosition,
                        zIndex,
                        yOffset,
                        isSelected: false
                    });
                }
            }
        } else if (part.length === 3) {
            // Legacy format: templateIndex+position+isFlipped (3 chars total)
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
                    isSinging: false,
                    xPosition: 0,
                    zIndex: 10,
                    yOffset: 0,
                    isSelected: false
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
    const [isExperimentMode, setIsExperimentMode] = useState(false);
    const [experimentHeads, setExperimentHeads] = useState<Array<{ id: string, headImg: string, bodyImg: string, x: number, y: number, flipped: boolean, scale?: number }>>([]);
    const [choirStartTime, setChoirStartTime] = useState<number | undefined>(undefined);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const elevatedMelodyRef = useRef<HTMLAudioElement | null>(null);
    const singerAudioMap = useRef<Map<string, HTMLAudioElement>>(new Map());

    // Web Audio API refs for individual singers
    const singerSourceMap = useRef<Map<string, AudioBufferSourceNode>>(new Map());

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
        audioRef.current = new Audio(`${process.env.PUBLIC_URL}/assets/architect mel front row only loop.wav`);
        audioRef.current.loop = true;
        audioRef.current.volume = 0.7;

        elevatedMelodyRef.current = new Audio(`${process.env.PUBLIC_URL}/assets/architect mel sequence all join in 2d.wav`);
        elevatedMelodyRef.current.loop = false;
        elevatedMelodyRef.current.volume = 0.7;

        // Capture ref values for cleanup
        const audioElement = audioRef.current;
        const elevatedMelodyElement = elevatedMelodyRef.current;
        const singerAudioMapCurrent = singerAudioMap.current;

        return () => {
            if (audioElement) {
                audioElement.pause();
                audioRef.current = null;
            }
            if (elevatedMelodyElement) {
                elevatedMelodyElement.pause();
                elevatedMelodyRef.current = null;
            }
            // Clean up all individual singer audio
            singerAudioMapCurrent.forEach((audio) => {
                audio.pause();
            });
            singerAudioMapCurrent.clear();
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





    // Clean up audio for a singer (Web Audio API)
    const cleanupSingerAudio = useCallback((singerId: string) => {
        // Clean up Web Audio API source
        const source = singerSourceMap.current.get(singerId);
        if (source) {
            try {
                source.stop();
            } catch (e) {
                // Source might already be stopped
            }
            singerSourceMap.current.delete(singerId);
        }

        // Clean up old HTML5 audio if it exists (for backward compatibility)
        const audio = singerAudioMap.current.get(singerId);
        if (audio) {
            audio.pause();
            audio.currentTime = 0;
            singerAudioMap.current.delete(singerId);
        }
    }, []);

    const addSpecificSinger = useCallback((template: SingerTemplate, position: 'front' | 'back') => {
        const isFlipped = Math.random() > 0.5;

        const newSinger: Singer = {
            id: generateSingerId(),
            template,
            position,
            isFlipped,
            isSinging: false,
            xPosition: 0, // Start at center
            zIndex: 10, // Default z-index, can be adjusted with move forward/back
            yOffset: 0, // Default y-offset, will be adjusted for depth
            isSelected: false
        };

        setSingers(prev => [...prev, newSinger]);
    }, []);

    const removeSinger = useCallback((id: string) => {
        // Clean up audio before removing singer
        cleanupSingerAudio(id);
        setSingers(prev => prev.filter(singer => singer.id !== id));
    }, [cleanupSingerAudio]);

    const removeAllSingers = useCallback(() => {
        // Clean up all individual singer audio
        singerAudioMap.current.forEach((audio, singerId) => {
            cleanupSingerAudio(singerId);
        });
        setSingers([]);
        setIsAllSinging(false);
    }, [cleanupSingerAudio]);



    const toggleAllSinging = useCallback(() => {
        setIsAllSinging(prev => {
            const newState = !prev;

            // Stop all individual singer audio when group singing starts
            if (newState) {
                singerAudioMap.current.forEach((audio) => {
                    audio.pause();
                    audio.currentTime = 0;
                });
            }

            setSingers(singers => singers.map(singer => ({
                ...singer,
                isSinging: newState && singer.template.canSing !== false
            })));
            return newState;
        });
    }, []);

    // Helper function to generate full choir background singers


    const playElevatedMelody = useCallback(() => {
        if (elevatedMelodyRef.current) {
            setIsPlayingElevatedMelody(true);

            // Show the full choir when elevated melody starts and set start time
            setChoirStartTime(Date.now());

            // Stop the regular melody if it's playing
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
            }
            setIsAllSinging(false);

            // Stop all individual singer audio
            singerAudioMap.current.forEach((audio) => {
                audio.pause();
                audio.currentTime = 0;
            });

            // Make all singers sing (only those who can sing)
            setSingers(singers => singers.map(singer => ({
                ...singer,
                isSinging: singer.template.canSing !== false
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
    }, [isExperimentMode]);


    const flipSinger = useCallback((id: string) => {
        setSingers(prev => prev.map(singer =>
            singer.id === id
                ? { ...singer, isFlipped: !singer.isFlipped }
                : singer
        ));
    }, []);

    const updateSingerPosition = useCallback((id: string, xPosition: number, yOffset?: number) => {
        setSingers(prev => {
            const updated = prev.map(singer =>
                singer.id === id
                    ? {
                        ...singer,
                        xPosition,
                        ...(yOffset !== undefined ? { yOffset: Math.max(-70, Math.min(40, yOffset)) } : {})
                    }
                    : singer
            );
            return updated;
        });
    }, []);

    const selectSinger = useCallback((id: string) => {
        setSingers(prev => prev.map(singer => ({
            ...singer,
            isSelected: singer.id === id
        })));
    }, []);

    const clearSelection = useCallback(() => {
        setSingers(prev => prev.map(singer => ({
            ...singer,
            isSelected: false
        })));
    }, []);

    const moveForward = useCallback((id: string) => {
        setSingers(prev => prev.map(singer =>
            singer.id === id
                ? {
                    ...singer,
                    zIndex: (singer.zIndex || 10) + 1
                }
                : singer
        ));
    }, []);

    const moveBack = useCallback((id: string) => {
        setSingers(prev => prev.map(singer =>
            singer.id === id
                ? {
                    ...singer,
                    zIndex: Math.max((singer.zIndex || 10) - 1, 1) // Don't go below 1
                }
                : singer
        ));
    }, []);

    const singerCount = singers.length;

    // Keyboard controls for selected singer
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (isPlayingElevatedMelody) return; // Disable during elevated melody

            const selectedSinger = singers.find(s => s.isSelected);
            if (!selectedSinger) return; // No singer selected

            const moveDistance = 5; // Pixels per keypress for finer control

            switch (e.key) {
                case 'ArrowLeft':
                    e.preventDefault();
                    updateSingerPosition(selectedSinger.id,
                        Math.max(-350, (selectedSinger.xPosition || 0) - moveDistance)
                    );
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    updateSingerPosition(selectedSinger.id,
                        Math.min(350, (selectedSinger.xPosition || 0) + moveDistance)
                    );
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    updateSingerPosition(selectedSinger.id,
                        selectedSinger.xPosition || 0,
                        Math.max(-70, (selectedSinger.yOffset || 0) - moveDistance)
                    );
                    break;
                case 'ArrowDown':
                    e.preventDefault();
                    updateSingerPosition(selectedSinger.id,
                        selectedSinger.xPosition || 0,
                        Math.min(40, (selectedSinger.yOffset || 0) + moveDistance)
                    );
                    break;
                default:
                    return; // Don't prevent default for other keys
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [singers, isPlayingElevatedMelody, updateSingerPosition]);

    return (
        <div className="choir-app" >
            <header className="choir-header">
                <h1 className="choir-title">Cogwork Choir Configurator</h1>
                <p className="choir-subtitle">Configure the statues and listen to the gift of the Architects</p>
            </header>

            <div className="choir-main">
                <SingerSelector
                    singerTemplates={singerTemplates}
                    onSelectSinger={addSpecificSinger}
                    singerCount={singerCount}
                    isDisabled={isPlayingElevatedMelody}
                    selectedSinger={singers.find(s => s.isSelected) || null}
                    onRemoveSinger={removeSinger}
                    onFlipSinger={flipSinger}
                    onClearSelection={clearSelection}
                    onMoveForward={moveForward}
                    onMoveBack={moveBack}
                    onRemoveAll={removeAllSingers}
                />

                <div className="choir-content">
                    <ControlPanel
                        onToggleAllSinging={toggleAllSinging}
                        onPlayElevatedMelody={playElevatedMelody}
                        isAllSinging={isAllSinging}
                        isPlayingElevatedMelody={isPlayingElevatedMelody}
                        isExperimentMode={isExperimentMode}
                        singerCount={singers.length}
                    />

                    <ChoirFormation
                        singers={singers}
                        onSingerSelect={selectSinger}
                        onUpdatePosition={updateSingerPosition}
                        onClearSelection={clearSelection}
                        isDisabled={isPlayingElevatedMelody}
                        singerTemplates={singerTemplates}
                        choirStartTime={choirStartTime}
                    />
                </div>
            </div>

            {/* Architect's Table (behind architect) */}
            <div className="architect-table">
                <img
                    src={`${process.env.PUBLIC_URL}/assets/architect_dressing_0008_1_table.png`}
                    alt="Architect's Table"
                    className="table-image"
                />
            </div>

            {/* Twelfth Architect Image */}
            <div className="architect-portrait">
                <img
                    src={`${process.env.PUBLIC_URL}/assets/Twelfth_Architect.png`}
                    alt="The Twelfth Architect"
                    className="architect-image"
                />
            </div>

            {/* Lower left decoration */}
            <div className="lower-left-decoration">
                <img
                    src={`${process.env.PUBLIC_URL}/assets/architect_dressing_0007_1.png`}
                    alt="Workshop Decoration"
                    className="decoration-image"
                />
            </div>

            {/* Footer with Team Cherry credit */}
            <footer className="team-cherry-footer">
                <p className="credit-text">
                    All assets belong to Team Cherry. This is a fan project for fun. Thanks to Team Cherry for the amazing game and art! <a href="https://store.steampowered.com/app/1030300/Hollow_Knight_Silksong/" target="_blank" rel="noopener noreferrer" className="silksong-link">Go buy Silksong!</a> ❤️
                </p>
            </footer>
        </div>
    );
};

export default ChoirApp;