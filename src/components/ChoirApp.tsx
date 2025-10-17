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
    const singerAudioMap = useRef<Map<string, HTMLAudioElement>>(new Map());

    // Web Audio API refs for individual singers
    const audioContextRef = useRef<AudioContext | null>(null);
    const audioBufferRef = useRef<AudioBuffer | null>(null);
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

        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
            if (elevatedMelodyRef.current) {
                elevatedMelodyRef.current.pause();
                elevatedMelodyRef.current = null;
            }
            // Clean up all individual singer audio
            singerAudioMap.current.forEach((audio) => {
                audio.pause();
            });
            singerAudioMap.current.clear();
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

    // Initialize Web Audio API
    const initWebAudio = useCallback(async () => {
        if (!audioContextRef.current) {
            audioContextRef.current = new AudioContext();
        }

        if (audioContextRef.current.state === 'suspended') {
            await audioContextRef.current.resume();
        }

        // Load audio buffer if not already loaded
        if (!audioBufferRef.current) {
            try {
                const response = await fetch(`${process.env.PUBLIC_URL}/assets/statueSingleMelody.wav`);
                const arrayBuffer = await response.arrayBuffer();
                audioBufferRef.current = await audioContextRef.current.decodeAudioData(arrayBuffer);
                console.log('Individual singer audio buffer loaded successfully');
            } catch (error) {
                console.error('Error loading individual singer audio:', error);
                throw error;
            }
        }
    }, []);

    // Create and start individual audio for a singer using Web Audio API
    const createAndStartSingerAudio = useCallback(async (singer: Singer, positionInRow: number, totalInRow: number) => {
        try {
            await initWebAudio();

            if (!audioContextRef.current || !audioBufferRef.current) {
                throw new Error('Web Audio context or buffer not available');
            }

            // Calculate pitch in semitones - middle singer gets 0 (original pitch)
            let pitchSemitones = 0;

            // Base pitch adjustment by singer type (more noticeable differences)
            const singerTypeAdjustment: Record<string, number> = {
                'Short Front': 3,    // +3 semitones (much higher)
                'Short Side': 2,     // +2 semitones (higher)
                'Tall Front': -3,    // -3 semitones (much lower)
                'Tall Side': -2      // -2 semitones (lower)
            };

            pitchSemitones += singerTypeAdjustment[singer.template.alt] || 0;

            // Position within row variation - middle singer stays at base, others spread out
            if (totalInRow > 1) {
                const middlePosition = (totalInRow - 1) / 2;
                const distanceFromMiddle = positionInRow - middlePosition;
                // Each position away from middle adds ±1 semitone (doubled)
                pitchSemitones += distanceFromMiddle * 1.0;
            }

            // Front vs back row variation (increased)
            if (singer.position === 'front') {
                pitchSemitones += 1; // Front row higher by 1 semitone
            } else {
                pitchSemitones -= 1; // Back row lower by 1 semitone
            }

            // Small random variation for uniqueness
            const randomVariation = (Math.random() - 0.5) * 0.6; // ±0.3 semitones (doubled)
            pitchSemitones += randomVariation;

            // Create audio source
            const source = audioContextRef.current.createBufferSource();
            source.buffer = audioBufferRef.current;
            source.loop = true;

            // Apply pitch shift (convert semitones to frequency ratio)
            const pitchRatio = Math.pow(2, pitchSemitones / 12);
            source.playbackRate.setValueAtTime(pitchRatio, audioContextRef.current.currentTime);

            // Create gain node for volume control
            const gainNode = audioContextRef.current.createGain();
            gainNode.gain.setValueAtTime(0.4, audioContextRef.current.currentTime); // Quieter for individual singers

            // Connect: source -> gain -> destination
            source.connect(gainNode);
            gainNode.connect(audioContextRef.current.destination);

            // Start playing immediately
            source.start();

            const currentTime = audioContextRef.current.currentTime;

            // Schedule fade-out: Start fading at 0.7 seconds, complete fade by 1 second
            const fadeStartTime = currentTime + 0.7; // Start fading after 700ms
            const fadeEndTime = currentTime + 1.0;   // Complete fade at 1000ms

            // Schedule the fade-out
            gainNode.gain.setValueAtTime(0.4, currentTime); // Initial volume
            gainNode.gain.setValueAtTime(0.4, fadeStartTime); // Hold volume until fade starts
            gainNode.gain.linearRampToValueAtTime(0.0, fadeEndTime); // Fade to silence over 300ms

            // Auto-stop after fade completes
            setTimeout(() => {
                try {
                    source.stop();
                    singerSourceMap.current.delete(singer.id);
                } catch (e) {
                    // Source might already be stopped
                }
            }, 1000);

            console.log(`🎵 SINGER AUDIO STARTED (1 second with fade-out):
  Type: ${singer.template.alt}
  Position: ${positionInRow} of ${totalInRow} (${singer.position})
  🎼 Pitch: ${pitchSemitones > 0 ? '+' : ''}${pitchSemitones.toFixed(2)} semitones
  🔊 Ratio: ${pitchRatio.toFixed(3)}x
  🎚️ Fade: 0.7s-1.0s (300ms fade-out)`);

            // Store the source node for cleanup only
            singerSourceMap.current.set(singer.id, source);

            return true; // Success

        } catch (error) {
            console.error('Error creating singer audio:', error);
            return false; // Failure
        }
    }, [initWebAudio]);

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
            isSinging: false
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

            // Stop all individual singer audio when group singing starts
            if (newState) {
                singerAudioMap.current.forEach((audio) => {
                    audio.pause();
                    audio.currentTime = 0;
                });
            }

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

            // Stop all individual singer audio
            singerAudioMap.current.forEach((audio) => {
                audio.pause();
                audio.currentTime = 0;
            });

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

    const toggleSingerSinging = useCallback(async (id: string) => {
        setSingers(prev => {
            const updatedSingers = prev.map(singer => {
                if (singer.id === id) {
                    // Always clean up existing audio first
                    cleanupSingerAudio(id);

                    // Calculate position within row for pitch variation
                    const singersInSameRow = prev.filter(s => s.position === singer.position);
                    const positionInRow = singersInSameRow.findIndex(s => s.id === singer.id);
                    const totalInRow = singersInSameRow.length;

                    console.log(`🎵 Playing 1-second preview for ${singer.template.alt} (${singer.position}): position ${positionInRow} of ${totalInRow}`);

                    // Start singing for 1 second (handled by createAndStartSingerAudio)
                    createAndStartSingerAudio(singer, positionInRow, totalInRow).then(success => {
                        if (success) {
                            console.log(`🔊 Started 1-second preview for ${singer.template.alt}`);

                            // Auto-stop the UI state after 1 second to match audio
                            setTimeout(() => {
                                setSingers(currentSingers =>
                                    currentSingers.map(s =>
                                        s.id === id ? { ...s, isSinging: false } : s
                                    )
                                );
                                console.log(`🔇 Auto-stopped preview for ${singer.template.alt}`);
                            }, 1000);
                        } else {
                            console.error(`❌ Failed to start preview for ${singer.template.alt}`);
                        }
                    }).catch(console.error);

                    // Set singer as singing immediately (will be turned off after 1 second)
                    return { ...singer, isSinging: true };
                }
                return singer;
            });

            return updatedSingers;
        });
    }, [createAndStartSingerAudio, cleanupSingerAudio]);

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
                    isDisabled={isPlayingElevatedMelody}
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
                        isDisabled={isPlayingElevatedMelody}
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