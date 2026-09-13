import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Volume2, VolumeX, FastForward } from 'lucide-react';

interface CinematicIntroProps {
  onComplete: () => void;
  onSkip?: () => void;
}

type Phase = 'init' | 'reveal' | 'terminal_return' | 'graffiti' | 'transition';

const RGB_SCAN_SLICES = [
  { top: '22%', height: '2px', delay: '0.04s', bg: 'linear-gradient(90deg, transparent, #00f0ff 25%, #ff0055 75%, transparent)' },
  { top: '48%', height: '3px', delay: '0.12s', bg: 'linear-gradient(90deg, transparent, #ff0055 30%, #39ff14 70%, transparent)' },
  { top: '74%', height: '2px', delay: '0.20s', bg: 'linear-gradient(90deg, transparent, #00f0ff 35%, #ff0055 65%, transparent)' },
];

const SCATTERED_RGB_CLUSTERS = [
  { top: '15%', left: '12%', delay: '0.03s', dx: -8, dy: 4, label: '0x7F', color: '#00f0ff', pixels: ['#00f0ff', '#ff0055', '#39ff14'] },
  { top: '23%', left: '78%', delay: '0.11s', dx: 7, dy: -3, label: 'INIT_2026', color: '#ff0055', pixels: ['#ff0055', '#00f0ff', '#ff0055', '#39ff14'] },
  { top: '36%', left: '26%', delay: '0.07s', dx: -5, dy: -5, color: '#39ff14', pixels: ['#39ff14', '#00f0ff', '#39ff14'] },
  { top: '46%', left: '86%', delay: '0.16s', dx: 8, dy: 3, label: 'ACK', color: '#00f0ff', pixels: ['#00f0ff', '#ff0055'] },
  { top: '61%', left: '18%', delay: '0.13s', dx: -7, dy: 5, color: '#ff0055', pixels: ['#ff0055', '#39ff14', '#00f0ff'] },
  { top: '73%', left: '72%', delay: '0.09s', dx: 6, dy: -4, label: '0x9B', color: '#39ff14', pixels: ['#39ff14', '#ff0055', '#00f0ff'] },
  { top: '82%', left: '32%', delay: '0.21s', dx: -6, dy: 4, color: '#00f0ff', pixels: ['#00f0ff', '#00f0ff', '#ff0055'] },
  { top: '28%', left: '54%', delay: '0.15s', dx: 5, dy: 5, label: 'GIT//OK', color: '#ff0055', pixels: ['#ff0055', '#00f0ff'] },
  { top: '67%', left: '46%', delay: '0.19s', dx: -7, dy: -3, color: '#00f0ff', pixels: ['#00f0ff', '#39ff14', '#ff0055'] },
  { top: '17%', left: '44%', delay: '0.05s', dx: 4, dy: -3, color: '#39ff14', pixels: ['#39ff14', '#00f0ff'] },
  { top: '54%', left: '70%', delay: '0.14s', dx: -5, dy: 4, label: 'DECODE', color: '#ff0055', pixels: ['#ff0055', '#39ff14'] },
  { top: '86%', left: '80%', delay: '0.23s', dx: 6, dy: -4, color: '#00f0ff', pixels: ['#00f0ff', '#ff0055', '#00f0ff'] },
  { top: '11%', left: '62%', delay: '0.10s', dx: -4, dy: 5, label: 'PORT:01', color: '#39ff14', pixels: ['#39ff14', '#ff0055'] },
  { top: '41%', left: '9%', delay: '0.18s', dx: 6, dy: -3, color: '#ff0055', pixels: ['#ff0055', '#00f0ff', '#39ff14'] },
];

export function CinematicIntro({ onComplete, onSkip }: CinematicIntroProps) {
  const [phase, setPhase] = useState<Phase>('init');
  const [typedLines, setTypedLines] = useState<string[]>([]);
  const [phase3Lines, setPhase3Lines] = useState<{ step: number }>({ step: 0 });
  const [audioBlocked, setAudioBlocked] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [glitchActive, setGlitchActive] = useState(false);
  const [flashWord, setFlashWord] = useState<string>('');

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);

  const addTimeout = useCallback((fn: () => void, delay: number) => {
    const id = setTimeout(fn, delay);
    timeoutsRef.current.push(id);
    return id;
  }, []);

  // Audio smooth fade-out function with cosine curve
  const fadeOutAudio = useCallback((durationMs = 950, callback?: () => void) => {
    if (!audioRef.current) {
      if (callback) callback();
      return;
    }
    const audio = audioRef.current;
    const startVolume = audio.volume;
    const steps = 24;
    const stepTime = durationMs / steps;
    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep++;
      const factor = Math.cos((currentStep / steps) * (Math.PI / 2));
      const nextVolume = Math.max(0, startVolume * factor);
      audio.volume = nextVolume;
      if (currentStep >= steps || nextVolume <= 0) {
        clearInterval(interval);
        audio.pause();
        audio.currentTime = 0;
        if (callback) callback();
      }
    }, stepTime);
  }, []);

  // Handle Skip
  const handleSkip = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    setIsFadingOut(true);
    setPhase('transition');
    fadeOutAudio(800, () => {
      if (onSkip) onSkip();
      onComplete();
    });
  }, [fadeOutAudio, onSkip, onComplete]);

  // Keyboard shortcut (Escape to skip)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleSkip();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleSkip]);

  // Audio initialization and autoplay handling
  useEffect(() => {
    const audio = new Audio('/nepal_audio.mp3');
    audio.preload = 'auto';
    audio.volume = 1.0;
    audioRef.current = audio;

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Autoplay policy prevented immediate playback
        setAudioBlocked(true);
      });
    }

    const unlockAudio = () => {
      if (audioRef.current && audioRef.current.paused) {
        audioRef.current.play().then(() => {
          setAudioBlocked(false);
        }).catch(() => {});
      }
    };

    window.addEventListener('click', unlockAudio, { once: true });
    window.addEventListener('keydown', unlockAudio, { once: true });

    return () => {
      window.removeEventListener('click', unlockAudio);
      window.removeEventListener('keydown', unlockAudio);
      audio.pause();
      audio.src = '';
    };
  }, []);

  // Toggle Mute
  const toggleMute = () => {
    if (!audioRef.current) return;
    const next = !isMuted;
    audioRef.current.muted = next;
    setIsMuted(next);
  };

  // When video completes its full playback
  const handleVideoEnded = useCallback(() => {
    setPhase('terminal_return');

    // Step 1: Typing > GIT.COMMIT.PUSH
    addTimeout(() => {
      setPhase3Lines({ step: 1 });
    }, 200);

    // Step 2: THE FINAL PUSH
    addTimeout(() => {
      setPhase3Lines({ step: 2 });
    }, 1200);

    // Step 3: WIN THE NEPAL EXPERIENCE (Cyberpunk Glitch Climax)
    addTimeout(() => {
      setPhase3Lines({ step: 3 });
    }, 2000);

    // Step 4: Cyberpunk Glitch UI Stamp (PUSH -> NEPAL)
    addTimeout(() => {
      setPhase('graffiti');
    }, 4000);

    // Step 5: Smooth Transition into Website
    addTimeout(() => {
      setPhase('transition');
      setIsFadingOut(true);

      fadeOutAudio(1100, () => {
        onComplete();
      });
    }, 6400);
  }, [addTimeout, fadeOutAudio, onComplete]);

  // Timeline execution
  useEffect(() => {
    // -------------------------------------------------------------
    // PHASE 1: Terminal Typing (0.0s - 3.4s)
    // -------------------------------------------------------------
    const linesToType = [
      { text: '> INITIALIZING...', delay: 200, typeSpeed: 40 },
      { text: '> git init', delay: 1100, typeSpeed: 45 },
      { text: '> 24 HOURS', delay: 1900, typeSpeed: 35 },
      { text: '> 1 DESTINATION', delay: 2550, typeSpeed: 35 },
    ];

    linesToType.forEach(({ text, delay, typeSpeed }) => {
      addTimeout(() => {
        let currentIdx = 0;
        const interval = setInterval(() => {
          currentIdx++;
          const currentText = text.slice(0, currentIdx);
          setTypedLines((prev) => {
            const next = [...prev];
            if (next.length === 0 || next[next.length - 1].startsWith(text.slice(0, 1)) && next[next.length - 1].length < text.length) {
              if (next.length > 0 && text.startsWith(next[next.length - 1].slice(0, 2))) {
                next[next.length - 1] = currentText;
                return next;
              }
            }
            if (currentIdx === 1) {
              return [...next, currentText];
            } else {
              next[next.length - 1] = currentText;
              return next;
            }
          });
          if (currentIdx >= text.length) {
            clearInterval(interval);
          }
        }, typeSpeed);
      }, delay);
    });

    // -------------------------------------------------------------
    // PHASE 2: Nepal Reveal (3.4s - Video End ~43.5s)
    // Full 40s video plays with zero interruptions
    // -------------------------------------------------------------
    addTimeout(() => {
      setPhase('reveal');

      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.playbackRate = 1.0;
        videoRef.current.play().catch(() => {});
      }
    }, 3400);

    // Safety fallback timeout if video onEnded event is missed (~40.5s duration)
    addTimeout(() => {
      if (videoRef.current && (videoRef.current.ended || videoRef.current.currentTime >= 39.5)) {
        handleVideoEnded();
      }
    }, 44000);

    return () => {
      timeoutsRef.current.forEach(clearTimeout);
    };
  }, [addTimeout, handleVideoEnded]);



  return (
    <div
      className={`fixed inset-0 z-[99999] overflow-hidden bg-black select-none transition-opacity duration-700 ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Scanline overlay only for terminal and ending phases - never over the clean video */}
      {phase !== 'reveal' && (
        <div className="absolute inset-0 intro-scanlines z-30 opacity-40 pointer-events-none" />
      )}

      {/* Persistent Controls: Skip & Audio Toggle */}
      <div className="absolute top-6 right-6 z-50 flex items-center gap-3">
        {audioBlocked && (
          <button
            onClick={() => {
              if (audioRef.current) {
                audioRef.current.play().then(() => setAudioBlocked(false)).catch(() => {});
              }
            }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#7ee7d6]/40 bg-[#0d1117]/80 text-[#7ee7d6] font-mono-custom text-xs uppercase tracking-wider backdrop-blur-md animate-pulse hover:bg-[#7ee7d6]/20 transition-all cursor-pointer"
          >
            <VolumeX size={14} className="text-[#ff7c4c]" />
            <span>Tap to unmute</span>
          </button>
        )}

        <button
          onClick={toggleMute}
          aria-label={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          className="p-2 rounded-full border border-white/15 bg-black/40 text-neutral-300 hover:text-white hover:border-white/40 transition-all backdrop-blur-sm cursor-pointer"
        >
          {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>

        <button
          onClick={handleSkip}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/20 bg-black/60 text-white/90 hover:text-white hover:border-[#7ee7d6] hover:bg-[#0d1117]/90 font-mono-custom text-xs uppercase tracking-widest transition-all backdrop-blur-md shadow-lg shadow-black/50 cursor-pointer group"
        >
          <span>Skip</span>
          <span className="text-[10px] text-neutral-400 group-hover:text-[#7ee7d6]">[ESC]</span>
          <FastForward size={13} className="text-[#7ee7d6] transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>

      {/* ============================================================== */}
      {/* PHASE 1: BLACK / TERMINAL INITIALIZATION (0.0s - 3.4s)          */}
      {/* ============================================================== */}
      {phase === 'init' && (
        <div className="absolute inset-0 flex flex-col justify-center items-center px-6 text-left">
          <div className="w-full max-w-xl font-mono-custom">
            <div className="space-y-4">
              {typedLines.map((line, idx) => {
                const is24Hours = line.includes('24 HOURS');
                const isDestination = line.includes('1 DESTINATION');
                const isGitInit = line.includes('git init');

                return (
                  <div
                    key={idx}
                    className={`flex items-center text-lg sm:text-2xl tracking-wider transition-all duration-300 ${
                      is24Hours
                        ? 'text-[#ff7c4c] font-bold text-2xl sm:text-3xl'
                        : isDestination
                        ? 'text-[#7ee7d6] font-bold text-2xl sm:text-3xl'
                        : isGitInit
                        ? 'text-[#b990ff]'
                        : 'text-neutral-400'
                    }`}
                  >
                    <span>{line}</span>
                    {idx === typedLines.length - 1 && (
                      <span className="inline-block w-2.5 h-6 ml-2 bg-[#7ee7d6] animate-pulse shadow-[0_0_8px_#7ee7d6]" />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Corner metadata info */}
            <div className="absolute bottom-8 left-8 font-mono-custom text-[11px] uppercase tracking-[.2em] text-neutral-600">
              [SYSTEM://PORT_01 // LATENCY: 12MS // AUDIO_IN]
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* PHASE 2: THE NEPAL REVEAL (Full 40s video, pristine & smooth)  */}
      {/* ============================================================== */}
      <div 
        className={`absolute inset-0 z-20 transition-opacity duration-700 ${
          phase === 'reveal' ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <video
          ref={videoRef}
          src="/nepal_bg.mp4"
          preload="auto"
          playsInline
          muted
          onEnded={handleVideoEnded}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>

      {/* ============================================================== */}
      {/* PHASE 3: TERMINAL RETURNS & CLIMAX (11.2s - 14.5s)              */}
      {/* ============================================================== */}
      {phase === 'terminal_return' && (
        <div className="absolute inset-0 z-20 flex flex-col justify-center items-center px-6 text-center bg-black/90 backdrop-blur-md">
          <div className="max-w-4xl space-y-6">
            {/* Step 1: > GIT.COMMIT.PUSH */}
            {phase3Lines.step >= 1 && (
              <div className="font-mono-custom text-xl sm:text-3xl text-[#7ee7d6] tracking-widest flex items-center justify-center animate-in fade-in duration-300">
                <span>&gt; GIT.COMMIT.PUSH</span>
                <span className="inline-block w-2.5 h-6 ml-2 bg-[#7ee7d6] animate-pulse" />
              </div>
            )}

            {/* Step 2: THE FINAL PUSH */}
            {phase3Lines.step >= 2 && (
              <div className="font-mono-custom text-sm sm:text-xl uppercase tracking-[.3em] text-[#ff7c4c] animate-in fade-in slide-in-from-bottom-2 duration-300">
                THE FINAL PUSH
              </div>
            )}

            {/* Step 3: WIN THE NEPAL EXPERIENCE (Cyberpunk Glitch) */}
            {phase3Lines.step >= 3 && (
              <div className="pt-4 animate-in zoom-in-90 fade-in duration-500">
                <h1 
                  className="glitch-text font-display text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tight" 
                  data-text="WIN THE NEPAL EXPERIENCE"
                >
                  WIN THE NEPAL EXPERIENCE
                </h1>
                <p className="mt-4 font-mono-custom text-xs sm:text-sm uppercase tracking-[.25em] text-[#f5eedf]/80">
                  ALL-EXPENSES-PAID HACKATHON FINALE IN THE HIMALAYAS
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* PHASE 4 & 5: CYBERPUNK GLITCH UI (14.5s - 18.5s)               */}
      {/* ============================================================== */}
      {(phase === 'graffiti' || phase === 'transition') && (
        <div className="absolute inset-0 z-20 flex flex-col justify-center items-center pointer-events-none bg-black/90">
          <div className="relative z-20 text-center px-4 animate-in zoom-in-95 duration-200">
            <div className="cyber-box cyber-pixel-corners p-8 sm:p-12 inline-block">
              <div className="font-mono-custom text-xs sm:text-sm uppercase tracking-[.35em] text-[#7ee7d6] mb-3">
                ✓ MERGED & QUALIFIED
              </div>
              <h2 
                className="glitch-text font-display text-5xl sm:text-7xl font-black italic tracking-tighter"
                data-text="PUSH → NEPAL"
              >
                PUSH → NEPAL
              </h2>
              <div className="mt-4 flex items-center justify-center gap-4 font-mono-custom text-xs sm:text-sm text-neutral-300">
                <span className="px-3 py-1 rounded border border-[#ff7c4c]/40 text-[#ff7c4c]">2026 FINALE</span>
                <span className="px-3 py-1 rounded border border-[#7ee7d6]/40 text-[#7ee7d6]">GIT COMMIT PUSH</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* SCATTERED RGB HACKING GLITCH OVERLAY                           */}
      {/* ============================================================== */}
      {isFadingOut && (
        <div className="absolute inset-0 z-50 pointer-events-none overflow-hidden">
          {/* Subtle RGB ambient sweep flash */}
          <div className="absolute inset-0 rgb-ambient-sweep bg-gradient-to-r from-[#ff0055]/15 via-[#00f0ff]/20 to-[#39ff14]/15 mix-blend-screen pointer-events-none" />

          {/* Thin horizontal RGB scan slices that jitter gently */}
          {RGB_SCAN_SLICES.map((slice, i) => (
            <div
              key={i}
              className="absolute left-0 right-0 rgb-glitch-slice pointer-events-none"
              style={{
                top: slice.top,
                height: slice.height,
                background: slice.bg,
                animationDelay: slice.delay,
              }}
            />
          ))}

          {/* Scattered RGB pixel clusters and hacker fragments */}
          {SCATTERED_RGB_CLUSTERS.map((cluster, i) => (
            <div
              key={i}
              className="absolute rgb-pixel-frag pointer-events-none flex flex-col items-start gap-1"
              style={{
                top: cluster.top,
                left: cluster.left,
                animationDelay: cluster.delay,
                // @ts-ignore
                '--dx': cluster.dx,
                '--dy': cluster.dy,
              }}
            >
              {/* Micro RGB Pixel dots */}
              <div className="flex items-center gap-0.5">
                {cluster.pixels.map((col, pIdx) => (
                  <span
                    key={pIdx}
                    className="inline-block w-1.5 h-1.5 rounded-[1px]"
                    style={{
                      backgroundColor: col,
                      boxShadow: `0 0 5px ${col}`,
                    }}
                  />
                ))}
              </div>

              {/* Tiny Hacker Code Tag */}
              {cluster.label && (
                <span
                  className="font-mono-custom text-[9px] tracking-widest px-1 py-0.5 rounded-xs border uppercase leading-none"
                  style={{
                    color: cluster.color,
                    borderColor: `${cluster.color}55`,
                    backgroundColor: 'rgba(0, 0, 0, 0.75)',
                    textShadow: `0 0 5px ${cluster.color}`,
                  }}
                >
                  {cluster.label}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CinematicIntro;
