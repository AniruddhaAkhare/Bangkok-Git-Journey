import { createContext, type FormEvent, type ReactNode, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import PixelTransition from '@/components/PixelTransition';
import { GlowingSnow } from '@/components/GlowingSnow';
import { CinematicIntro } from '@/components/CinematicIntro';
import {
  ArrowRight, Check, ChevronRight, Clock3, Code2, Compass, GitBranch, Github, Globe2, Linkedin, Mail, MapPin,
  Menu, Network, Pause, Phone, Play, Radio, Rocket, RotateCcw, Send, ShieldCheck, Sparkles, Terminal, TrainFront, Trophy, Twitter,
  Users, Video, X,
} from 'lucide-react';
import { Link, Route, Switch, Router as WouterRouter, useLocation } from 'wouter';
import NotFound from '@/pages/not-found';
import nepalMarketImage from '@assets/nepal/nepal-market.jpg';
import nepalMountainImage from '@assets/nepal/dhaulagiri-mountain-glowing-during-colorful-sunset-in-nepal-photo.jpg';
import swayambhuFestivalImage from '@assets/nepal/swayambhunath-festival.jpg';
import himalayasImage from '@assets/nepal/himalayas.jpg';
import heroBgImage from '@assets/nepal/hero-bg.jpg';
import treasureMapBg from '@assets/nepal/treasure-map-bg.jpg';
import treasureMapVideo from '@assets/nepal/treasure_map_video.mp4';

const queryClient = new QueryClient();

type Round = {
  id: string;
  command: string;
  title: string;
  place: string;
  date: string;
  description: string;
  accent: string;
  icon: typeof Terminal;
  videoSrc?: string;
};

const rounds: Round[] = [
  {
    id: 'init',
    command: 'git init',
    title: 'Round 1',
    place: 'Online · everywhere',
    date: '20-25th Sept',
    description: 'Open your first branch with a sharp, practical build. Submit remotely.',
    accent: '#b990ff',
    icon: Terminal,
    videoSrc: '/round1.mp4',
  },
  {
    id: 'commit',
    command: 'git commit',
    title: 'Round 2',
    place: 'Nagpur · in person',
    date: 'Date: TBA',
    description: 'Your qualifier branch gets checked out in an offline hackathon. one room, one commit that matters.',
    accent: '#ff7c4c',
    icon: GitBranch,
    videoSrc: '/round2_new.mp4',
  },
  {
    id: 'push',
    command: 'git push',
    title: 'The Winning Ticket',
    place: 'Nepal · the finish line',
    date: 'Date: TBA',
    description: 'The final merge happens under Nepal*. Experience the beuty of mountains and culture. (*T&C apply)',
    accent: '#ff4f9a',
    icon: Send,
    videoSrc: '/round3.mp4',
  },
];

const roundRoutes: Record<string, string> = {
  init: '/git-init',
  commit: '/git-commit',
  push: '/git-push',
};

const expeditionBeats = [
  { label: 'IDEA', detail: 'Find the problem nobody is solving.', color: '#b990ff' },
  { label: 'DESIGN A SOLUTION', detail: 'Create a PPT and a video explaining your solution and submit it.', color: '#7ee7d6' },
  { label: 'EVALUATION', detail: 'We will evaluate your PPTs and Videos based on the evaluation criteria stated in the rules and regulations.', color: '#ff7c4c' },
  { label: 'BUILD', detail: 'Shortlisted teams will be formally notified via email and onboarded into dedicated communication channels to actively develop their prototypes further.', color: '#ff4f9a' },
  { label: 'COMMIT', detail: 'Make the work real, readable, and ready. Offline seats for the in-person hackathon will be strictly allocated based on RSVP confirmations and logistical arrangements.', color: '#ff7c4c' },
  { label: 'PUSH (Offline)', detail: 'Following the evaluation of your Round 1 solutions, a Reverse Hackathon will be conducted. Take your idea past the edge of the screen and prove its resilience.', color: '#b990ff' },
  { label: 'FINAL MERGE', detail: 'The ultimate showdown! The top teams will earn a fully sponsored trip to Nepal* to pitch their solutions and claim the grand prize.', color: '#ff4f9a' },
];

const challenges = [
  {
    slug: "agent-trust-handshake-protocol",
    title: "AGENT TRUST HANDSHAKE PROTOCOL",
    tags: "AI, Cryptography, Protocols",
    question: "AI agents are increasingly transacting and communicating on behalf of humans and businesses — but right now, one agent has no reliable way to verify who another agent is, what it's authorized to do, or whether its claims can be trusted. This is a real, unsolved gap in the emerging agent economy.",
    detail: "Build a working handshake protocol between two AI agents that lets one verify the other's identity and permissions before it trusts what the other agent tells it.",
    accent: "#b990ff",
    difficulty: "Hard",
    output: "A secure verification handshake protocol with a working demo.",
  },
  {
    slug: "the-unknown-detector",
    title: "THE UNKNOWN DETECTOR",
    tags: "Data Science, Machine Learning",
    question: "AI has gotten very good at answering questions we already know how to ask. It's much worse at noticing when something in the data doesn't fit any existing explanation — the kind of gap that real discoveries usually start from.",
    detail: "Build a system that looks through a real dataset and surfaces something that doesn't fit — not an answer, but a genuine, well-justified mystery worth investigating, for someone deciding what to research next.",
    accent: "#7ee7d6",
    difficulty: "Medium",
    output: "Anomaly detection system with justification logs.",
  },
  {
    slug: "regional-climate-cascade-simulator",
    title: "REGIONAL CLIMATE-CASCADE SIMULATOR",
    tags: "Simulation, Data Viz, Environment",
    question: "Decision-makers need to understand how a change in one environmental factor cascades into others — but existing tools either flatten this into a single number or are too complex for anyone outside a research lab to actually use.",
    detail: "Build an interactive simulator for one real region where a user can change one variable and see how it cascades into the others.",
    accent: "#ff7c4c",
    difficulty: "Medium",
    output: "Interactive simulation dashboard.",
  },
  {
    slug: "micro-grid-energy-balancer",
    title: "MICRO-GRID ENERGY BALANCER",
    tags: "IoT, Optimization, Energy",
    question: "As homes, EVs, and local solar/battery systems multiply, no simple system exists to decide, moment to moment, who gets power, who waits, and who gets cut off during a shortfall — for a small, local grid.",
    detail: "Build a system that allocates limited power across competing sources and demands in real time, and can justify each decision it makes.",
    accent: "#ff4f9a",
    difficulty: "Hard",
    output: "Real-time resource allocation algorithm & dashboard.",
  },
  {
    slug: "the-digital-soul",
    title: "THE DIGITAL SOUL",
    tags: "LLM, Knowledge Graph, UX",
    question: "A person spends decades accumulating knowledge, decisions, and lessons learned — and most of it disappears when they do. There's no system today that preserves a person's actual accumulated wisdom while being honest about the difference between what they truly said and what's being guessed on their behalf.",
    detail: "Build a system that lets someone explore what a real person knew and why they made certain decisions — while clearly separating what that person actually said from anything the system inferred.",
    accent: "#b990ff",
    difficulty: "Medium",
    output: "Personal knowledge exploration interface.",
  },
  {
    slug: "localized-food-shortage-early-warning",
    title: "LOCALIZED FOOD-SHORTAGE EARLY WARNING",
    tags: "Predictive Analytics, Agriculture",
    question: "Prices for a single crop in a single region can spike suddenly and unpredictably, and the people affected usually only find out once it's already happened.",
    detail: "Build a system that predicts, ahead of time, when a specific crop in a specific region is heading toward a shortage — for the farmers, traders, or local officials who'd need to act on it.",
    accent: "#7ee7d6",
    difficulty: "Hard",
    output: "Early warning alert system and predictive model.",
  },
  {
    slug: "prove-without-revealing-identity-check",
    title: "PROVE-WITHOUT-REVEALING IDENTITY CHECK",
    tags: "ZKP, Identity, Web3",
    question: "People are constantly forced to hand over far more personal information than a situation requires — showing a full ID just to prove you're over 18, for example.",
    detail: "Build a system that lets someone prove a single fact about themselves to a verifier, without revealing anything else about who they are.",
    accent: "#ff7c4c",
    difficulty: "Hard",
    output: "Zero-knowledge proof verification app.",
  },
  {
    slug: "human-in-the-loop-decision-gate",
    title: "HUMAN-IN-THE-LOOP DECISION GATE",
    tags: "AI Safety, HCI, Workflow",
    question: "AI systems making high-stakes decisions — loans, medical triage, industrial alerts — either act with too much unchecked autonomy or ask a human every single time. Nothing today decides which one a given case actually deserves.",
    detail: "Build a layer that sits in front of an AI's decision and decides, case by case, whether the AI should act on its own, ask a human, or refuse — for the people relying on that decision.",
    accent: "#ff4f9a",
    difficulty: "Medium",
    output: "Decision-gating middleware layer.",
  },
  {
    slug: "the-agent-payment-and-settlement-rail",
    title: "THE AGENT PAYMENT & SETTLEMENT RAIL",
    tags: "Fintech, Web3, Smart Agents",
    question: "AI agents are starting to negotiate and pay on people's behalf, but there's no equivalent of a bank or escrow system between agents — if a payment goes wrong, there's no authorization proof, no dispute process, and no way to reverse it.",
    detail: "Build a payment flow between two AI agents that includes spend authorization and a way to dispute and reverse a bad transaction — for someone trusting an agent to spend on their behalf.",
    accent: "#b990ff",
    difficulty: "Hard",
    output: "Escrow and settlement smart contract.",
  },
  {
    slug: "agent-wallets-with-real-spending-limits-on-chain",
    title: "AGENT WALLETS WITH REAL SPENDING LIMITS (ON-CHAIN)",
    tags: "Smart Contracts, Web3, Security",
    question: "Giving an AI agent a crypto wallet it can use autonomously is dangerous unless a human can cap what it spends, revoke its access instantly, and audit everything it did. Most agent-wallet setups today don't actually guarantee that.",
    detail: "Build a smart contract wallet that an AI agent can transact through, with spending limits the human owner controls and can revoke — for someone who wants to delegate spending without losing control of it.",
    accent: "#7ee7d6",
    difficulty: "Medium",
    output: "Auditable wallet with revocation limits.",
  },
  {
    slug: "wildcard-mission-2040",
    title: "WILDCARD — MISSION 2040",
    tags: "Open-ended, Grand Challenge",
    question: "There are real problems today, affecting millions of people, that will get measurably worse by 2040 — and none of them currently have a solution good enough to stop that.",
    detail: "Pick one such problem, and build a working first step toward solving it — for the specific people it will affect.",
    accent: "#ff7c4c",
    difficulty: "Extreme",
    output: "Working prototype addressing a 2040 crisis.",
  }
];

type TreasureClue = {
  id: string;
  title: string;
  path: string;
  description: string;
  reward: string;
};

const clueRegistry: TreasureClue[] = [
  { id: 'clue-01', title: 'THE UNTRACKED FILE', path: '/unknown/.secret', description: 'A clean repository is never completely clean.', reward: 'a file with no README' },
  { id: 'clue-02', title: 'THE PIXEL ARTIFACT', path: '/signal/pixel', description: 'Curiosity has a frequency. Stay with the strange little signal.', reward: 'a brighter map fragment' },
  { id: 'clue-03', title: 'THE LOST BRANCH', path: '/branches/unknown', description: 'There is a branch the public route forgot to draw.', reward: 'an unlisted branch' },
  { id: 'clue-04', title: 'THE COMMIT RUNNER', path: '/runner/awake', description: 'The guide was here before the route had a name.', reward: 'a traveling companion' },
  { id: 'clue-05', title: 'THE NEPAL SIGIL', path: '/nepal/pattern', description: 'Old geometry can carry a new instruction.', reward: 'a city-side coordinate' },
  { id: 'clue-06', title: 'THE UNKNOWN CHECKOUT', path: '/checkout/question-mark', description: 'Some branches only exist after you ask the wrong question.', reward: 'a key with no lock' },
  { id: 'clue-07', title: 'THE HIDDEN ROUTE', path: '/map/lost-route', description: 'Follow the line that was never meant to be on the map.', reward: 'the final coordinate' },
];

type TreasureContextValue = {
  clues: TreasureClue[];
  unlockedIds: string[];
  latestClue: TreasureClue | null;
  unlockClue: (id: string) => void;
  dismissLatest: () => void;
  hasClue: (id: string) => boolean;
  complete: boolean;
};

const TreasureContext = createContext<TreasureContextValue | null>(null);
const treasureStorageKey = 'gcp-treasure-progress';

function useTreasure() {
  const context = useContext(TreasureContext);
  if (!context) throw new Error('useTreasure must be used inside TreasureProvider');
  return context;
}

function DiscoveryNotification({ clue, onDismiss }: { clue: TreasureClue | null; onDismiss: () => void }) {
  useEffect(() => {
    if (!clue) return;
    const timer = window.setTimeout(onDismiss, 5600);
    return () => window.clearTimeout(timer);
  }, [clue, onDismiss]);
  if (!clue) return null;
  return (
    <div className="discovery-notification" role="status" aria-live="polite">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-mono-custom text-[10px] uppercase tracking-[.18em] text-[#ff7c4c]">signal recovered / clue unlocked</p>
          <h2 className="mt-2 font-display text-xl font-bold text-[#f5eedf]">{clue.title}</h2>
          <p className="mt-2 text-xs leading-5 text-[#aeb8c6]">{clue.description}</p>
        </div>
        <button type="button" onClick={onDismiss} className="text-[#687386] hover:text-[#f5eedf]" aria-label="Dismiss discovery notification"><X size={16} /></button>
      </div>
      <div className="mt-4 flex items-center justify-between border-t border-[#f5eedf]/10 pt-3 font-mono-custom text-[10px]">
        <span className="text-[#7ee7d6]">{clue.path}</span>
        <span className="text-[#b990ff]">{clue.reward}</span>
      </div>
    </div>
  );
}

function DiscoveryHud() {
  const { unlockedIds, complete } = useTreasure();
  return (
    <div className="discovery-hud" aria-label={`Discovery progress: ${unlockedIds.length} of ${clueRegistry.length} clues found`}>
      <span className="font-mono-custom text-[9px] uppercase tracking-[.14em] text-[#687386]">{complete ? 'repository recovered' : 'discovery progress'}</span>
      <span className="mt-2 flex gap-1.5" aria-hidden="true">
        {clueRegistry.map((clue) => <span key={clue.id} className={`h-1.5 w-4 rounded-full transition ${unlockedIds.includes(clue.id) ? 'bg-[#7ee7d6] shadow-[0_0_8px_rgba(126,231,214,.8)]' : 'bg-[#f5eedf]/15'}`} />)}
      </span>
    </div>
  );
}

function TreasureProvider({ children }: { children: ReactNode }) {
  const [unlockedIds, setUnlockedIds] = useState<string[]>(() => {
    try {
      const saved = window.localStorage.getItem(treasureStorageKey);
      const parsed = saved ? JSON.parse(saved) : [];
      return Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === 'string' && clueRegistry.some((clue) => clue.id === id)) : [];
    } catch {
      return [];
    }
  });
  const [latestClue, setLatestClue] = useState<TreasureClue | null>(null);
  const unlockClue = (id: string) => {
    const clue = clueRegistry.find((item) => item.id === id);
    if (!clue) return;
    setUnlockedIds((current) => {
      if (current.includes(id)) return current;
      const next = [...current, id];
      window.localStorage.setItem(treasureStorageKey, JSON.stringify(next));
      setLatestClue(clue);
      return next;
    });
  };
  useEffect(() => {
    const sync = () => {
      try {
        const saved = window.localStorage.getItem(treasureStorageKey);
        const parsed = saved ? JSON.parse(saved) : [];
        if (Array.isArray(parsed)) setUnlockedIds(parsed.filter((id): id is string => typeof id === 'string' && clueRegistry.some((clue) => clue.id === id)));
      } catch {
        // Ignore malformed local progress and keep the current session alive.
      }
    };
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);
  const value = useMemo(() => ({
    clues: clueRegistry,
    unlockedIds,
    latestClue,
    unlockClue,
    dismissLatest: () => setLatestClue(null),
    hasClue: (id: string) => unlockedIds.includes(id),
    complete: unlockedIds.length === clueRegistry.length,
  }), [latestClue, unlockedIds]);
  return (
    <TreasureContext.Provider value={value}>
      {children}
      <DiscoveryNotification clue={latestClue} onDismiss={value.dismissLatest} />
    </TreasureContext.Provider>
  );
}

function Countdown({ compact = false }: { compact?: boolean }) {
  const target = useMemo(() => new Date('2026-11-07T19:00:00+07:00').getTime(), []);
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);
  const remaining = Math.max(0, target - now);
  const units = [
    { label: 'days', value: Math.floor(remaining / 86400000) },
    { label: 'hrs', value: Math.floor(remaining / 3600000) % 24 },
    { label: 'min', value: Math.floor(remaining / 60000) % 60 },
    { label: 'sec', value: Math.floor(remaining / 1000) % 60 },
  ];
  return (
    <div className={`flex items-end ${compact ? 'gap-2' : 'gap-3 sm:gap-5'}`} data-testid="status-countdown">
      {units.map((unit, index) => (
        <div key={unit.label} className="flex items-end gap-1">
          <span className={`${compact ? 'text-xl' : 'text-3xl sm:text-5xl'} font-display font-bold tracking-tight text-[#f5eedf] tabular-nums`}>
            {String(unit.value).padStart(index === 0 ? 2 : 2, '0')}
          </span>
          <span className="mb-1 font-mono-custom text-[9px] uppercase tracking-[.14em] text-[#8f98a8]">{unit.label}</span>
        </div>
      ))}
    </div>
  );
}

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-3" data-testid="link-logo">
      <span className="grid h-8 w-8 place-items-center rounded-sm border border-[#ff7c4c]/70 bg-[#ff7c4c]/10 text-[#ff7c4c]">
        <GitBranch size={17} strokeWidth={2.4} />
      </span>
      <span className="font-mono-custom text-[11px] font-semibold leading-tight tracking-[.08em] text-[#f5eedf]">
        GIT.COMMIT.PUSH<br /><span className="text-[#ff7c4c]">THE UNINVENTED HACKATHON</span>
      </span>
    </Link>
  );
}

function Navbar() {
  const [location] = useLocation();
  const [open, setOpen] = useState(false);
  const links = [
    { href: '/un-invented', label: 'The Uninvented' },
    { href: '/challenges', label: 'Challenges' },
    { href: '/journey', label: 'Journey' },
    { href: '/about-us', label: 'About Us' },
    { href: '/faq', label: 'FAQ' },
    { href: '/prizes', label: 'Prizes' },
    { href: '/rules', label: 'Rules' },
  ];
  return (
    <header className="nav-glass sticky top-0 z-50">
      <div className="mx-auto flex h-[72px] max-w-[1240px] items-center justify-between px-5 sm:px-8">
        <Logo />
        <nav className="hidden items-center gap-8 md:flex" aria-label="Main navigation">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="nav-link py-1 text-[12px] font-semibold uppercase tracking-[.12em]" data-active={location === link.href} data-testid={`link-nav-${link.label.toLowerCase()}`}>
              {link.label}
            </Link>
          ))}
          <Link href="/register" className="btn-primary min-h-[38px] px-4 text-[10px]" data-testid="link-nav-register">
            Initialize <ArrowRight size={14} />
          </Link>
        </nav>
        <button className="grid h-10 w-10 place-items-center border border-[#f5eedf]/15 text-[#f5eedf] md:hidden" onClick={() => setOpen(!open)} aria-label={open ? 'Close navigation' : 'Open navigation'} data-testid="button-mobile-menu">
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>
      {open && (
        <nav className="border-t border-[#f5eedf]/10 px-5 pb-5 pt-4 md:hidden" aria-label="Mobile navigation">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="block border-b border-[#f5eedf]/10 py-4 text-sm uppercase tracking-[.12em] text-[#c0b9c8]" onClick={() => setOpen(false)} data-testid={`link-mobile-${link.label.toLowerCase()}`}>
              {link.label}
            </Link>
          ))}
          <Link href="/register" className="btn-primary mt-4 w-full" onClick={() => setOpen(false)} data-testid="link-mobile-register">Initialize repository <ArrowRight size={15} /></Link>
        </nav>
      )}
    </header>
  );
}

function TempleSilhouette() {
  return (
    <svg viewBox="0 0 900 220" className="pointer-events-none absolute bottom-0 left-0 -z-10 w-full opacity-50" aria-hidden="true">
      <path d="M0 206h900v14H0zM55 206v-35h46v35M68 171l10-40 10 40M138 206v-57h63v57M152 149l18-47 18 47M269 206v-48h88v48M291 158l22-80 22 80M417 206v-36h42v36M435 170l10-48 10 48M540 206v-64h100v64M561 142l29-70 29 70M704 206v-47h75v47M721 159l21-68 21 68" fill="none" stroke="#b990ff" strokeWidth="2" />
      <path d="M0 206h900" stroke="#ff7c4c" strokeWidth="2" />
    </svg>
  );
}

function CommitRunner({ compact = false }: { compact?: boolean }) {
  const { unlockClue, hasClue } = useTreasure();
  const [mood, setMood] = useState<'idle' | 'discover'>('idle');
  const discover = () => {
    setMood('discover');
    unlockClue('clue-04');
    window.setTimeout(() => setMood('idle'), 1000);
  };
  return (
    <button
      type="button"
      className={`commit-runner group ${compact ? 'commit-runner-compact' : ''} ${mood === 'discover' ? 'is-discovering' : ''}`}
      onClick={discover}
      aria-label={hasClue('clue-04') ? 'The Commit Runner, clue already discovered' : 'Wake the Commit Runner'}
      title={hasClue('clue-04') ? 'The Commit Runner is watching the route.' : 'A small explorer is waiting.'}
    >
      <span className="runner-art" aria-hidden="true">
        <span className="runner-glow" />
        <span className="runner-pack" />
        <span className="runner-head"><span className="runner-visor" /></span>
        <span className="runner-body"><span className="runner-artifact" /></span>
        <span className="runner-leg runner-leg-left" /><span className="runner-leg runner-leg-right" />
      </span>
      <span className="runner-caption font-mono-custom text-[9px] uppercase tracking-[.13em]">{mood === 'discover' ? 'signal found' : 'commit runner'}</span>
    </button>
  );
}

function PixelArtifact() {
  const { unlockClue, hasClue } = useTreasure();
  const [armed, setArmed] = useState(false);
  useEffect(() => {
    if (!armed || hasClue('clue-02')) return;
    const timer = window.setTimeout(() => unlockClue('clue-02'), 1700);
    return () => window.clearTimeout(timer);
  }, [armed, hasClue, unlockClue]);
  return (
    <button
      type="button"
      className={`pixel-artifact ${armed ? 'is-armed' : ''} ${hasClue('clue-02') ? 'is-found' : ''}`}
      onMouseEnter={() => setArmed(true)}
      onMouseLeave={() => setArmed(false)}
      onFocus={() => setArmed(true)}
      onBlur={() => setArmed(false)}
      onClick={() => unlockClue('clue-02')}
      aria-label={hasClue('clue-02') ? 'Pixel artifact discovered' : 'Inspect the pixel artifact'}
    >
      <span className="pixel-artifact-core" aria-hidden="true" />
    </button>
  );
}

function NepalSigil() {
  const { unlockClue, hasClue } = useTreasure();
  return (
    <button
      type="button"
      className={`nepal-sigil ${hasClue('clue-05') ? 'is-found' : ''}`}
      onClick={() => unlockClue('clue-05')}
      aria-label={hasClue('clue-05') ? 'Nepal sigil discovered' : 'Inspect the Nepal graphic'}
    >
      ◈
    </button>
  );
}

function TerminalWindow() {
  const { unlockClue, hasClue } = useTreasure();
  const [stage, setStage] = useState<'init' | 'commit' | 'push'>('init');
  const [commandInput, setCommandInput] = useState('');
  const [commandOutput, setCommandOutput] = useState<string[]>([]);
  const messages = {
    init: { command: '$ git init', line: 'initializing_future...', status: 'repository_created', destination: 'signal acquired: 03 cities / 01 branch' },
    commit: { command: '$ git commit', line: 'building_what_doesnt_exist...', status: 'challenge_unlocked', destination: 'commit window: 24–36 hours / NAGPUR' },
    push: { command: '$ git push', line: 'pushing_to_nepal...', status: 'final_three_selected', destination: 'destination found: NEPAL → THE WORLD' },
  };
  const current = messages[stage];
  const fullText = current.line;
  const [typed, setTyped] = useState('');
  useEffect(() => {
    let index = 0;
    setTyped('');
    const timer = window.setInterval(() => {
      setTyped(fullText.slice(0, index + 1));
      index += 1;
      if (index >= fullText.length) window.clearInterval(timer);
    }, 55);
    return () => window.clearInterval(timer);
  }, [fullText]);
  const runCommand = (event: FormEvent) => {
    event.preventDefault();
    const command = commandInput.trim().toLowerCase();
    if (!command) return;
    const output: Record<string, string> = {
      'git status': hasClue('clue-01') ? 'Your repository is clean. .secret is already tracked.' : 'Your repository is clean. But there is one untracked file: .secret',
      'git branch --secret': hasClue('clue-03') ? 'main  init  commit  push  lost-branch' : 'main  init  commit  push  ?',
      'git checkout ?': hasClue('clue-06') ? 'The question has already been checked out.' : 'ACCESS DENIED. The branch is looking back.',
      'git checkout lost-commit': 'The Lost Commit is not in this working tree.',
      'git log --hidden': 'No history. Only evidence.',
      'git push origin world': 'PUSH QUEUED. The world is listening.',
    };
    setCommandOutput((current) => [...current.slice(-1), output[command] ?? 'command not found: try a smaller question']);
    if (command === 'git status') unlockClue('clue-01');
    if (command === 'git branch --secret') unlockClue('clue-03');
    if (command === 'git checkout ?') unlockClue('clue-06');
    setCommandInput('');
  };
  return (
    <div className="terminal-window scanline relative rounded-sm" data-testid="terminal-window">
      <div className="terminal-top flex items-center justify-between px-4 py-3">
        <div className="flex gap-1.5"><span className="terminal-dot bg-[#ff4f9a]" /><span className="terminal-dot bg-[#ff7c4c]" /><span className="terminal-dot bg-[#b990ff]" /></div>
        <span className="font-mono-custom text-[9px] uppercase tracking-[.2em] text-[#687386]">the-uninvented.sh</span>
      </div>
      <div className="space-y-2 p-5 font-mono-custom text-[11px] leading-relaxed text-[#aeb8c6] sm:p-6 sm:text-xs">
        <div><span className="text-[#ff7c4c]">guest@gcp</span><span className="text-[#687386]">:</span><span className="text-[#b990ff]">~/launch</span><span className="text-[#f5eedf]">$</span> {current.command.replace('$ ', '')} <span className="text-[#f5eedf]">{typed}</span><span className="cursor-blink ml-0.5 inline-block h-3 align-middle" /></div>
        <div className="text-[#7ee7d6]">✓ {current.destination}</div>
        <div className="text-[#ff4f9a]">→ {current.status}</div>
        <div className="pt-2 text-[#687386]"># no spectators. only contributors.</div>
        {commandOutput.map((line, index) => <div key={`${line}-${index}`} className="text-[#b990ff]">↳ {line}</div>)}
        <form onSubmit={runCommand} className="mt-3 flex items-center gap-2 border-t border-[#f5eedf]/10 pt-3">
          <label htmlFor="terminal-command" className="text-[#ff7c4c]">$</label>
          <input id="terminal-command" value={commandInput} onChange={(event) => setCommandInput(event.target.value)} className="min-w-0 flex-1 bg-transparent text-[#f5eedf] outline-none placeholder:text-[#4e596a]" placeholder="try a command" aria-label="Try a hidden terminal command" autoComplete="off" />
        </form>
      </div>
      <div className="terminal-stage-tabs border-t border-[#f5eedf]/10 px-4 py-3">
        <div className="flex gap-2">
          {(['init', 'commit', 'push'] as const).map((key) => (
            <button key={key} type="button" onClick={() => setStage(key)} className={`font-mono-custom text-[10px] uppercase tracking-[.14em] transition ${stage === key ? 'text-[#ff7c4c]' : 'text-[#687386] hover:text-[#f5eedf]'}`} aria-label={`Show ${key} terminal state`}>
              git {key}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function NepalDispatches() {
  return (
    <section className="mx-auto max-w-[1240px] px-5 pb-10 sm:px-8 sm:pb-16">
      <div className="mb-12 flex flex-col items-center text-center gap-5">
        <div className="reveal flex flex-col items-center">
          <p className="eyebrow mb-4 text-[#7ee7d6]">nepal field notes</p>
          <h2 className="font-display text-4xl font-bold tracking-[-.04em] text-[#f5eedf] sm:text-5xl">
            Build for the<br /><span className="text-[#ff4f9a]">mountains that wait.</span>
          </h2>
        </div>
      </div>

      <div className="nepali-corner relative min-h-[450px] sm:min-h-[500px] w-full overflow-hidden rounded-sm border border-[#f5eedf]/15 shadow-2xl group bg-[#0a0d14]">
        <video
          autoPlay
          loop
          muted
          playsInline
          src="/nepal_aesthetics.mp4"
          className="absolute inset-0 h-full w-full object-cover opacity-60 mix-blend-screen transition-transform duration-1000 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d1117] via-[#0d1117]/40 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0d1117]/60 via-transparent to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-[#ff4f9a]/10 mix-blend-color pointer-events-none" />

        <div className="absolute left-5 top-5 flex items-center gap-2 font-mono-custom text-[10px] uppercase tracking-[.14em] text-[#f5eedf] z-10">
          <span className="blink h-1.5 w-1.5 rounded-full bg-[#7ee7d6]" /> live visual feed
        </div>

        <div className="absolute bottom-8 left-5 right-5 flex items-end justify-between gap-5 sm:left-10 sm:right-10 z-10">
          <div className="max-w-2xl">
            <h3 className="font-display text-3xl font-bold leading-none text-[#f5eedf] sm:text-5xl drop-shadow-lg">The Final Merge.</h3>
            <p className="mt-4 text-base sm:text-lg leading-relaxed text-[#d2c8d3] drop-shadow-md">
              A fully sponsored trip to Nepal<span className="text-[#ff4f9a]">*</span> awaits the top teams. Pitch your solutions for where the air is thin and the stakes are highest.
            </p>
            <p className="mt-2 font-mono-custom text-[9px] uppercase tracking-[.1em] text-[#8f98a8] drop-shadow-md">* Terms and conditions apply.</p>
          </div>
          <span className="hidden h-16 w-16 shrink-0 place-items-center rounded-full border border-[#f5eedf]/35 bg-[#0d1117]/50 backdrop-blur-sm font-mono-custom text-[10px] text-[#f5eedf] sm:grid shadow-lg">01<br />GCP</span>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  const links = [
    { href: '/un-invented', label: 'The Uninvented' },
    { href: '/challenges', label: 'Challenges' },
    { href: '/journey', label: 'Journey' },
    { href: '/about-us', label: 'About Us' },
    { href: '/faq', label: 'FAQ' },
    { href: '/prizes', label: 'Prizes' },
    { href: '/rules', label: 'Rules' },
  ];

  return (
    <footer className="content-layer border-t border-[#f5eedf]/10 bg-[#0a0d12]/70 pt-16 pb-8 mt-auto">
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
        <div className="grid gap-12 sm:grid-cols-2 md:grid-cols-4 border-b border-[#f5eedf]/10 pb-12">
          <div>
            <p className="font-display text-xl font-bold text-[#f5eedf]">git commit and push hackathon</p>
            <p className="mt-4 max-w-sm text-sm leading-6 text-[#8f98a8]">
              Build what the future demands today. A launch-night hackathon by people who ship.
            </p>
          </div>
          <div>
            <h4 className="font-mono-custom text-[11px] uppercase tracking-[.15em] text-[#f5eedf] mb-5">Navigation</h4>
            <ul className="space-y-3">
              {links.slice(0, 4).map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-[#8f98a8] hover:text-[#ff7c4c] transition-colors">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-mono-custom text-[11px] uppercase tracking-[.15em] text-[#f5eedf] mb-5">Explore</h4>
            <ul className="space-y-3">
              {links.slice(4).map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-[#8f98a8] hover:text-[#ff7c4c] transition-colors">{link.label}</Link>
                </li>
              ))}
              <li>
                <Link href="/register" className="text-sm font-semibold text-[#b990ff] hover:text-[#f5eedf] transition-colors">Register Now</Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-mono-custom text-[11px] uppercase tracking-[.15em] text-[#f5eedf] mb-5">Contact</h4>
            <ul className="space-y-3 text-sm text-[#8f98a8]">
              <li>
                <span className="block text-[10px] text-[#687386] font-mono-custom uppercase tracking-wider">Aniruddha Akhare</span>
                <a href="tel:+919689158304" className="hover:text-[#7ee7d6] transition-colors font-mono-custom text-xs flex items-center gap-1.5 mt-0.5">
                  <Phone size={13} className="text-[#7ee7d6]" /> +91 9689158304
                </a>
              </li>
              <li>
                <span className="block text-[10px] text-[#687386] font-mono-custom uppercase tracking-wider">Parth Deshmukh</span>
                <a href="tel:+918839652553" className="hover:text-[#b990ff] transition-colors font-mono-custom text-xs flex items-center gap-1.5 mt-0.5">
                  <Phone size={13} className="text-[#b990ff]" /> +91 8839652553
                </a>
              </li>
              <li className="pt-1">
                <a href="mailto:work.parthdes@gmail.com" className="hover:text-[#ff7c4c] transition-colors font-mono-custom text-xs flex items-center gap-1.5">
                  <Mail size={13} className="text-[#ff7c4c]" /> work.parthdes@gmail.com
                </a>
              </li>
              <li>
                <a href="mailto:aniruddhaakhare2004@gmail.com" className="hover:text-[#7ee7d6] transition-colors font-mono-custom text-xs flex items-center gap-1.5">
                  <Mail size={13} className="text-[#7ee7d6]" /> aniruddhaakhare2004@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex items-center gap-6 font-mono-custom text-[10px] text-[#687386] uppercase tracking-[.12em]">
            <span className="flex items-center gap-2"><span className="blink h-1.5 w-1.5 rounded-full bg-[#7ee7d6]" /> system online</span>
            <span className="hidden sm:inline">v.01.26</span>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-4 text-center md:text-left text-[11px] text-[#687386]">
            <span>&copy; {new Date().getFullYear()} Git Commit Push Hackathon. All rights reserved.</span>
            <div className="hidden md:block h-3 w-px bg-[#f5eedf]/10" />
            <div className="flex gap-4">
              <a href="#" className="hover:text-[#f5eedf] transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-[#f5eedf] transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

function PageFrame({ kicker, title, intro, children }: { kicker: string; title: string; intro: string; children: ReactNode }) {
  return (
    <div className="site-shell">
      <Navbar />
      <DiscoveryHud />
      <main className="content-layer">
        <section className="mx-auto max-w-[1240px] px-5 pb-8 pt-10 sm:px-8 sm:pb-12 sm:pt-16">
          <div className="mx-auto max-w-3xl reveal flex flex-col items-center text-center">
            <p className="eyebrow mb-5">{kicker}</p>
            <h1 className="font-display text-5xl font-bold leading-[.95] tracking-[-.05em] text-[#f5eedf] sm:text-7xl">{title}</h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-[#a1a6b2]">{intro}</p>
          </div>
          {children}
        </section>
      </main>
      <Footer />
    </div>
  );
}

function RoundPreview({ round, index }: { round: Round; index: number }) {
  const Icon = round.icon;
  return (
    <Link href={roundRoutes[round.id]} className={`group glow-card reveal delay-${index + 1} relative block overflow-hidden rounded-sm p-5 sm:p-6`} data-testid={`card-round-${round.id}`}>
      {round.videoSrc && (
        <>
          <video
            autoPlay
            loop
            muted
            playsInline
            src={round.videoSrc}
            className="absolute inset-0 h-full w-full object-cover opacity-20 mix-blend-screen transition-all duration-700 group-hover:scale-110 group-hover:opacity-40"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0d1117] via-[#0d1117]/60 to-[#0d1117]/10" />
        </>
      )}
      <div className="relative z-10">
        <div className="mb-9 flex items-start justify-between">
          <span className="font-mono-custom text-[10px] uppercase tracking-[.16em]" style={{ color: round.accent }}>0{index + 1} / branch</span>
          <Icon size={19} style={{ color: round.accent }} />
        </div>
        <h3 className="font-display text-3xl font-bold tracking-[-.04em] text-[#f5eedf]">{round.title}</h3>
        <p className="mt-2 font-mono-custom text-[10px] uppercase tracking-[.2em]" style={{ color: round.accent }}>{round.command}</p>
        <div className="mt-4 flex items-center gap-2 text-[11px] text-[#8f98a8]"><MapPin size={13} style={{ color: round.accent }} />{round.place}</div>
        <p className="mt-4 text-sm leading-6 text-[#9198a7]">{round.description}</p>
        <span className="mt-6 inline-flex items-center gap-2 font-mono-custom text-[10px] uppercase tracking-[.12em] text-[#f5eedf] group-hover:text-[#ff7c4c]">inspect branch <ChevronRight size={14} /></span>
      </div>
    </Link>
  );
}

function Home() {
  const [showIntro, setShowIntro] = useState(true);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleReplay = () => setShowIntro(true);
    window.addEventListener('replay-cinematic-intro', handleReplay);
    return () => window.removeEventListener('replay-cinematic-intro', handleReplay);
  }, []);

  return (
    <div className="site-shell relative">
      {showIntro && (
        <CinematicIntro
          onComplete={() => setShowIntro(false)}
          onSkip={() => setShowIntro(false)}
        />
      )}
      <GlowingSnow />
      <Navbar />
      <DiscoveryHud />
      <main className="content-layer">
        <section className="relative isolate overflow-hidden px-5 pb-10 pt-8 sm:px-8 sm:pb-16 sm:pt-12">
          <div className="absolute inset-0 -z-20">
            <video autoPlay loop muted playsInline src="/hero_bg.mp4" className="absolute inset-0 h-full w-full object-cover object-top opacity-100 mix-blend-screen" />
            <div className="absolute inset-0 bg-[#0d1117]/40 mix-blend-multiply" />
            <div className="absolute inset-0 bg-blue-900/20 mix-blend-overlay" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0d1117] via-[#0d1117]/60 to-transparent" />
          </div>
          <div className="mx-auto grid max-w-[1240px] items-center gap-12 lg:grid-cols-[1.1fr_.65fr]">
            <div className="reveal">
              <div className="mb-6 flex items-center gap-3 font-mono-custom text-[10px] uppercase tracking-[.18em] text-[#7ee7d6]">
                <span className="blink h-2 w-2 rounded-full bg-[#7ee7d6]" /> season 01 · initializing the hackathon
              </div>
              <div onMouseMove={(event) => { const rect = event.currentTarget.getBoundingClientRect(); setTilt({ x: (event.clientY - rect.top - rect.height / 2) / 36, y: (event.clientX - rect.left - rect.width / 2) / -36 }); }} onMouseLeave={() => setTilt({ x: 0, y: 0 })}>
                <h1 className="font-display text-[clamp(2rem,6vw,5rem)] font-extrabold leading-[.78] tracking-[-.1em] text-[#f5eedf]" style={{ transform: `perspective(700px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`, transition: 'transform .25s ease-out' }}>
                  git<br /><span className="text-[#ff7c4c]">commit</span><br /><span className="text-[#b990ff]">and push</span><br />
                  <span className="text-[#7ee7d6] text-[clamp(1.25rem,4vw,3rem)] tracking-normal mt-4 block">hackathon</span>
                </h1>
              </div>
              <p className="mt-8 max-w-lg text-lg leading-8 text-[#a8aebb] sm:text-xl">Build what the future demands today. Start in a blank repository, solve tomorrow’s frontier problems, and push your code all the way to the peaks of Nepal to the world.</p>
              <div className="relative z-10 mt-8 mb-12 flex flex-col gap-3 sm:flex-row lg:mb-0">
                <Link href="/register" className="btn-primary" data-testid="link-hero-register">Initialize repository <ArrowRight size={16} /></Link>
                <Link href="/journey" className="btn-secondary" data-testid="link-hero-journey">View the route <TrainFront size={16} /></Link>
              </div>
            </div>
            <div className="reveal delay-2">
              <div className="relative z-10 mt-12 w-full lg:mt-0 xl:-ml-8">
                <NepalSigil />
                <PixelArtifact />
                <TerminalWindow />
              </div>
              <div className="mt-4 flex justify-end"><CommitRunner compact /></div>
              <div className="mt-4 flex items-center justify-between font-mono-custom text-[10px] uppercase tracking-[.14em] text-[#687386]">
                <span>Nepal / Nagpur / online</span><span className="text-[#ff7c4c]">v.01.26</span>
              </div>
            </div>
          </div>
          <div className="pointer-events-none absolute -bottom-20 left-1/2 -z-10 h-80 w-[720px] -translate-x-1/2 rounded-full bg-[#b990ff]/10 blur-[100px]" />
          <TempleSilhouette />
        </section>

        <div className="overflow-hidden border-y border-[#f5eedf]/10 bg-[#ff7c4c]/[.04] py-3">
          <div className="ticker flex w-max items-center gap-8 font-mono-custom text-[10px] uppercase tracking-[.2em] text-[#8f98a8]">
            {Array.from({ length: 2 }).map((_, copy) => <div className="flex items-center gap-8" key={copy}><span>01 init online</span><span className="text-[#ff7c4c]">+</span><span>02 commit Nagpur</span><span className="text-[#b990ff]">+</span><span>03 push Nepal</span><span className="text-[#ff4f9a]">+</span><span>ship something worth remembering</span></div>)}
          </div>
        </div>

        <section className="mx-auto max-w-[1240px] px-5 py-10 sm:px-8 sm:py-16">
          <div className="mb-12 flex flex-col items-center text-center gap-5">
            <div className="reveal flex flex-col items-center"><p className="eyebrow mb-4">the branching journey</p><h2 className="font-display text-4xl font-bold tracking-[-.04em] text-[#f5eedf] sm:text-5xl">One repo.<br /><span className="text-[#b990ff]">Three places.</span></h2></div>
            <Link href="/journey" className="font-mono-custom text-[11px] uppercase tracking-[.12em] text-[#ff7c4c] hover:text-[#f5eedf]" data-testid="link-home-journey">read the full protocol <ArrowRight size={14} className="ml-2 inline" /></Link>
          </div>
          <div className="grid gap-4 lg:grid-cols-3">{rounds.map((round, index) => <RoundPreview key={round.id} round={round} index={index} />)}</div>
        </section>

        <section className="mx-auto max-w-[1240px] px-5 pb-10 sm:px-8 sm:pb-16">
          <div className="reveal mb-12 flex flex-col items-center text-center">
            <p className="eyebrow mb-4 text-[#ff7c4c]">why participate</p>
            <h2 className="font-display text-4xl font-bold tracking-[-.04em] text-[#f5eedf] sm:text-5xl">More than just<br /><span className="text-[#ff7c4c]">another hackathon.</span></h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 auto-rows-fr">
            {[
              { title: 'Zero Entry Fee', text: 'Round 1 is completely free to enter. Register your team and submit your pitch with absolutely zero financial friction.', icon: Trophy, color: '#ff7c4c' },
              { title: 'Nepal-Bound', text: 'The top 3 teams from the offline round win a sponsored trip to Nepal*, experience the beauty of Himalyas and local hospitality', icon: TrainFront, color: '#ff4f9a' },
              { title: 'Real Problems', text: 'Tackle the 11 hand-picked challenges that represent actual, unsolved gaps in the tech landscape today.', icon: Code2, color: '#b990ff' },
              { title: 'Expert Guidance', text: 'Connect with mentors, receive real-time feedback, and forge network ties that outlast the competition.', icon: Network, color: '#7ee7d6' },
              { title: 'Something for Everyone', text: 'Top 20 teams get special runner-up goodies. Everyone receives a certificate, swag, and exclusive internship opportunities.', icon: Sparkles, color: '#f9a826' },
              { title: 'Reverse Hackathon', text: 'Instead of starting from a blank slate, you will reverse-engineer, fix, and optimize existing, complex flawed systems.', icon: RotateCcw, color: '#4caf50' },
              { title: 'Build Connections', text: 'Collaborate with like-minded builders, exchange ideas, and build relationships with industry leaders that can accelerate your career.', icon: Globe2, color: '#03a9f4' },
              { title: 'Youth-Led', text: 'Organized by Youth, for students. We understand your exact problems, needs, and what makes a hackathon truly worth your time.', icon: Users, color: '#e91e63' }
            ].map((reason, index) => {
              const Icon = reason.icon;
              return (
                <div key={reason.title} className={`reveal delay-${index + 1} glow-card nepali-corner rounded-sm p-6 sm:p-8 flex flex-col items-start hover:border-[#f5eedf]/30 transition-colors duration-300 h-full`}>
                  <div className="h-12 w-12 rounded-full flex items-center justify-center border bg-[#0d1117] mb-6" style={{ borderColor: `${reason.color}60` }}>
                    <Icon size={20} style={{ color: reason.color }} />
                  </div>
                  <h3 className="font-display text-xl font-bold text-[#f5eedf] mb-3">{reason.title}</h3>
                  <p className="text-sm leading-6 text-[#a1a6b2]">{reason.text}</p>
                </div>
              );
            })}
          </div>
        </section>

        <section className="mx-auto max-w-[1240px] px-5 pb-10 sm:px-8 sm:pb-16">
          <div className="reveal mb-12 flex flex-col items-center text-center gap-5">
            <div className="reveal flex flex-col items-center">
              <p className="eyebrow mb-4 text-[#7ee7d6]">the repositories</p>
              <h2 className="font-display text-4xl font-bold tracking-[-.04em] text-[#f5eedf] sm:text-5xl">Choose from well curated<br /><span className="text-[#7ee7d6]">11 challenges.</span></h2>
              <p className="mt-5 max-w-xl text-base leading-7 text-[#a1a6b2]">We’ve curated 11 real, unsolved problems facing the industry today. Explore the domains and start building the future.</p>
            </div>
            <Link href="/challenges" className="font-mono-custom text-[11px] uppercase tracking-[.12em] text-[#ff7c4c] hover:text-[#f5eedf]" data-testid="link-home-all-challenges">Explore all challenges <ArrowRight size={14} className="ml-2 inline" /></Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {challenges.slice(0, 3).map((challenge, index) => (
              <Link href="/challenges" key={challenge.slug} className={`reveal delay-${index + 1} group glow-card nepali-corner rounded-sm p-6 sm:p-8 flex flex-col items-start hover:border-[#f5eedf]/30 transition-colors duration-300 relative overflow-hidden`}>
                <div className="mb-4 flex items-start justify-between w-full">
                  <span className="font-mono-custom text-[10px] uppercase tracking-[.14em] line-clamp-1 mr-2" style={{ color: challenge.accent }}>repository / {challenge.slug}</span>
                  <Code2 size={16} className="text-[#687386] transition group-hover:text-[#f5eedf] shrink-0" />
                </div>
                <h3 className="mt-2 font-display text-2xl font-bold leading-[1.1] text-[#f5eedf]">{challenge.title}</h3>
                <p className="mt-4 text-sm leading-6 text-[#a1a6b2] line-clamp-4">{challenge.detail}</p>
                <div className="mt-auto pt-6 w-full flex items-center justify-between border-t border-[#f5eedf]/10">
                  <span className="font-mono-custom text-[10px] text-[#687386] truncate max-w-[60%]">{challenge.tags}</span>
                  <span className="font-mono-custom text-[10px] uppercase tracking-[.12em] shrink-0" style={{ color: challenge.accent }}>view domain</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <NepalDispatches />

        <section className="mx-auto max-w-[1240px] px-5 pb-12 sm:px-8 sm:pb-16">
          <div className="quest-panel relative overflow-hidden rounded-sm border border-[#7ee7d6]/20 bg-[#101d24] p-6 sm:p-10">
            <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-[#7ee7d6]/10 blur-[80px]" />
            <div className="relative">
              <div className="flex flex-col items-center text-center gap-5">
                <div className="flex flex-col items-center"><p className="eyebrow mb-4 text-[#7ee7d6]">the expedition protocol</p><h2 className="font-display text-4xl font-bold tracking-[-.05em] text-[#f5eedf] sm:text-5xl">Don’t follow a path.<br /><span className="text-[#7ee7d6]">Unlock one.</span></h2></div>
                <Link href="/un-invented" className="font-mono-custom text-[10px] uppercase tracking-[.14em] text-[#ff7c4c] hover:text-[#f5eedf]">open the map <ArrowRight size={14} className="ml-2 inline" /></Link>
              </div>
              <div className="quest-path mt-10 grid gap-3 md:grid-cols-7">
                {expeditionBeats.map((beat, index) => <Link key={beat.label} href="/un-invented" className="quest-node group relative border-l px-3 py-2 md:border-l-0 md:border-t md:pt-5" style={{ borderColor: `${beat.color}66` }}><span className="font-mono-custom text-[10px] tracking-[.12em]" style={{ color: beat.color }}>0{index + 1}</span><span className="mt-2 block font-display text-lg font-bold text-[#f5eedf] transition group-hover:translate-x-1">{beat.label}</span><span className="mt-2 hidden text-xs leading-5 text-[#91a0a7] md:block">{beat.detail.length > 45 ? beat.detail.slice(0, 45).trim() + '...' : beat.detail}</span></Link>)}
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1240px] px-5 pb-12 sm:px-8 sm:pb-16">
          <div className="relative overflow-hidden rounded-sm border border-[#ff4f9a]/35 bg-[#241527] p-7 sm:p-12">
            <div className="pointer-events-none absolute -right-24 -top-32 h-80 w-80 rounded-full bg-[#ff4f9a]/20 blur-[80px]" />
            <div className="relative flex flex-col items-center text-center gap-10">
              <div className="flex flex-col items-center"><p className="eyebrow mb-5 text-[#ff4f9a]">the pull request</p><h2 className="max-w-2xl font-display text-4xl font-bold tracking-[-.05em] text-[#f5eedf] sm:text-6xl">Your winning branch<br /><span className="text-[#ff7c4c]">ends in Nepal<span className="text-[#ff4f9a]">*</span>.</span></h2><p className="mt-5 max-w-xl text-[#c6b5c5]">A grand prize designed to turn a good build into a great story.</p><p className="mt-3 font-mono-custom text-[10px] uppercase tracking-[.12em] text-[#8f98a8]">* Terms and conditions apply.</p></div>
              <div className="rounded-sm border border-[#ff4f9a]/35 bg-[#0d1117]/55 p-5 sm:min-w-[320px] flex flex-col items-center"><p className="font-mono-custom text-[10px] uppercase tracking-[.15em] text-[#8f98a8]">trip launch in</p><div className="mt-3"><Countdown /></div><Link href="/prizes" className="mt-5 inline-flex items-center gap-2 font-mono-custom text-[10px] uppercase tracking-[.12em] text-[#ff7c4c]" data-testid="link-home-prizes">see the payload <ArrowRight size={14} /></Link></div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function JourneyPage() {
  const [selected, setSelected] = useState('commit');
  const [isPlaying, setIsPlaying] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const replayVideo = () => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = 0;
    videoRef.current.play();
    setIsPlaying(true);
  };

  const active = rounds.find((round) => round.id === selected) ?? rounds[1];

  // Sweeping S-curve matching a bottom-up drone flight path through the terrain
  const trailPath = 'M 600 900 C 700 850, 1300 800, 1300 550 C 1300 300, 1060 300, 960 150';

  const checkpoints = [
    {
      id: 'init',
      x: 600,
      y: 900,
      labelX: 600,
      labelY: 980,
      title: 'Round 1 (Online)',
      command: 'git init',
      accent: '#b990ff',
    },
    {
      id: 'commit',
      x: 1300,
      y: 550,
      labelX: 1475,
      labelY: 550,
      title: 'Round 2 (Nagpur)',
      command: 'git commit',
      accent: '#ff7c4c',
    },
    {
      id: 'push',
      x: 960,
      y: 150,
      labelX: 960,
      labelY: 75,
      title: 'Final (Nepal)',
      command: 'git push',
      accent: '#ff4f9a',
    },
  ];

  return (
    <PageFrame kicker="01 / route map" title="Follow the branch." intro="Not a conference. Not a weekend glued to a schedule. This is one connected GitGraph across three cities, with every round pushing the last one further.">
      <div className="mt-14 grid gap-10 lg:grid-cols-[1.35fr_.65fr]">
        <div className="glow-card nepali-corner relative overflow-hidden rounded-sm p-4 sm:p-8">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="font-mono-custom text-[10px] uppercase tracking-[.16em] text-[#687386]">origin/main → destination</span>
              <span className="flex items-center gap-2 font-mono-custom text-[10px] text-[#7ee7d6]">
                <span className="blink h-1.5 w-1.5 rounded-full bg-[#7ee7d6]" /> live video route
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={togglePlay}
                className="inline-flex items-center gap-1.5 rounded-sm border border-[#f5eedf]/20 bg-[#0d1117]/85 px-2.5 py-1 font-mono-custom text-[10px] text-[#f5eedf] hover:border-[#ff7c4c] transition-all cursor-pointer"
                title={isPlaying ? 'Pause video' : 'Play video'}
              >
                {isPlaying ? <Pause size={11} className="text-[#7ee7d6]" /> : <Play size={11} className="text-[#ff7c4c]" />}
                <span>{isPlaying ? 'Pause' : 'Play'}</span>
              </button>
              <button
                onClick={replayVideo}
                className="inline-flex items-center gap-1.5 rounded-sm border border-[#f5eedf]/20 bg-[#0d1117]/85 px-2.5 py-1 font-mono-custom text-[10px] text-[#f5eedf] hover:border-[#ff7c4c] transition-all cursor-pointer"
                title="Replay camera pan from beginning"
              >
                <RotateCcw size={11} className="text-[#ff7c4c]" />
                <span>Replay Pan</span>
              </button>
            </div>
          </div>

          {/* Treasure Map Video & Animated Trail Container */}
          <div className="relative w-full aspect-video rounded-md border border-[#f5eedf]/15 overflow-hidden bg-[#0a0d12] shadow-2xl">
            {/* Background Rendered Video */}
            <video
              ref={videoRef}
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              src="/formap.mp4"
              className="absolute inset-0 h-full w-full object-cover"
            />

            {/* Ambient Blend Vignette for text contrast while keeping video vibrant */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0a0d12]/75 via-transparent to-[#0a0d12]/35" />
            <div className="pointer-events-none absolute inset-0 bg-[#0a0d12]/15 mix-blend-multiply" />

            {/* Merged Animated Trail and Checkpoints SVG */}
            <svg
              viewBox="0 0 1920 1080"
              className="relative z-10 h-full w-full drop-shadow-2xl select-none mix-blend-screen"
              role="img"
              aria-label="Interactive animated treasure hunt map with live route and checkpoints"
            >
              <defs>
                <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="6" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <filter id="wideGlow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="16" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <linearGradient id="trailGoldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#b990ff" />
                  <stop offset="50%" stopColor="#ffb347" />
                  <stop offset="85%" stopColor="#ff7c4c" />
                  <stop offset="100%" stopColor="#ff4f9a" />
                </linearGradient>
                <linearGradient id="trailOuterGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#b990ff" stopOpacity="0.6" />
                  <stop offset="50%" stopColor="#ff9a3c" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#ff4f9a" stopOpacity="0.9" />
                </linearGradient>
              </defs>

              {/* Underlying atmospheric glow for the trail */}
              <path
                d={trailPath}
                fill="none"
                stroke="url(#trailOuterGlow)"
                strokeWidth="20"
                strokeLinecap="round"
                opacity="0.35"
                filter="url(#wideGlow)"
              />

              {/* Semi-transparent guiding base trail */}
              <path
                d={trailPath}
                fill="none"
                stroke="url(#trailGoldGradient)"
                strokeWidth="6"
                strokeLinecap="round"
                opacity="0.7"
              />

              {/* Animated Glowing Neon Dashed Trail */}
              <path
                d={trailPath}
                fill="none"
                stroke="#fff8eb"
                strokeWidth="4"
                strokeDasharray="18 14"
                strokeLinecap="round"
                className="route-trail-dash"
                filter="url(#softGlow)"
              />

              {/* Traveling Energy Pulse Packet along the trail */}
              <g>
                <circle r="16" fill="#ff7c4c" opacity="0.4" filter="url(#wideGlow)">
                  <animateMotion path={trailPath} dur="7s" repeatCount="indefinite" />
                </circle>
                <circle r="7" fill="#fffbe8" filter="url(#softGlow)">
                  <animateMotion path={trailPath} dur="7s" repeatCount="indefinite" />
                </circle>
              </g>

              {/* Interactive Checkpoints & Sonar Ripple Waves */}
              {checkpoints.map((node) => {
                const isCurrent = selected === node.id;
                return (
                  <g key={node.id} onClick={() => setSelected(node.id)} className="cursor-pointer group">
                    {/* Expanding Radar / Sonar Rings */}
                    <circle cx={node.x} cy={node.y} r="18" fill="none" stroke={node.accent} strokeWidth="3" opacity="0.85">
                      <animate attributeName="r" values="16; 65" dur="2.4s" repeatCount="indefinite" />
                      <animate attributeName="opacity" values="0.85; 0" dur="2.4s" repeatCount="indefinite" />
                    </circle>
                    <circle cx={node.x} cy={node.y} r="18" fill="none" stroke={node.accent} strokeWidth="1.8" opacity="0.85">
                      <animate attributeName="r" values="16; 65" begin="1.2s" dur="2.4s" repeatCount="indefinite" />
                      <animate attributeName="opacity" values="0.85; 0" begin="1.2s" dur="2.4s" repeatCount="indefinite" />
                    </circle>

                    {/* Shadow underneath the pin */}
                    <ellipse cx={node.x} cy={node.y + 6} rx="20" ry="7" fill="#000000" opacity="0.65" filter="url(#wideGlow)" />

                    {/* Active Checkpoint Radiating Beacon */}
                    {isCurrent && (
                      <circle
                        cx={node.x}
                        cy={node.y - 38}
                        r="30"
                        fill="none"
                        stroke={node.accent}
                        strokeWidth="3.5"
                        strokeDasharray="8 6"
                        className="animate-spin-slow"
                        filter="url(#softGlow)"
                      />
                    )}

                    {/* Teardrop Pin Marker with Smooth Hover Jump */}
                    <path
                      d={`M ${node.x} ${node.y} L ${node.x - 22} ${node.y - 38} A 22 22 0 1 1 ${node.x + 22} ${node.y - 38} Z`}
                      fill={node.accent}
                      filter="url(#softGlow)"
                      className="transition-transform duration-300 group-hover:-translate-y-3.5"
                    />
                    <circle
                      cx={node.x}
                      cy={node.y - 38}
                      r="10"
                      fill="#0d1117"
                      className="transition-transform duration-300 group-hover:-translate-y-3.5"
                    />
                    <circle
                      cx={node.x}
                      cy={node.y - 38}
                      r="4.5"
                      fill="#f5eedf"
                      className="transition-transform duration-300 group-hover:-translate-y-3.5"
                    />

                    {/* Checkpoint Glass Pill Label */}
                    <g className="transition-transform duration-300 group-hover:-translate-y-2">
                      <rect
                        x={node.labelX - 140}
                        y={node.labelY - 37}
                        width="280"
                        height="74"
                        rx="12"
                        fill="#0d1117"
                        fillOpacity="0.88"
                        stroke={isCurrent ? node.accent : 'rgba(245, 238, 223, 0.28)'}
                        strokeWidth={isCurrent ? 2.5 : 1}
                        filter="url(#wideGlow)"
                      />
                      <text
                        x={node.labelX}
                        y={node.labelY - 5}
                        fill="#f5eedf"
                        textAnchor="middle"
                        fontFamily="Syne, sans-serif"
                        fontSize="26"
                        fontWeight="bold"
                        className="tracking-wide drop-shadow-md"
                      >
                        {node.title}
                      </text>
                      <text
                        x={node.labelX}
                        y={node.labelY + 22}
                        fill={node.accent}
                        textAnchor="middle"
                        fontFamily="IBM Plex Mono, monospace"
                        fontSize="16"
                        fontWeight="600"
                        letterSpacing="1"
                      >
                        {node.command}
                      </text>
                    </g>
                  </g>
                );
              })}
            </svg>
          </div>
          <p className="mt-4 text-center font-mono-custom text-[10px] uppercase tracking-[.15em] text-[#687386]">
            tap any checkpoint pin or the playback controls to navigate the live expedition
          </p>
        </div>
        <div className="reveal delay-2">
          <div className="mb-4 flex gap-2">{rounds.map((round, index) => <button key={round.id} className={`h-1.5 flex-1 transition-opacity ${selected === round.id ? 'opacity-100' : 'opacity-25'}`} style={{ background: round.accent }} onClick={() => setSelected(round.id)} aria-label={`Show round ${index + 1}`} data-testid={`button-journey-${round.id}`} />)}</div>
          <div className="glow-card min-h-[320px] rounded-sm p-6 sm:p-8" style={{ borderColor: `${active.accent}55` }}>
            <div className="flex justify-end"><span className="font-mono-custom text-[10px] text-[#687386]">0{rounds.findIndex((round) => round.id === active.id) + 1} / 03</span></div>
            <div className="mt-7 h-56 relative flex justify-center items-center">
              {active.videoSrc ? (
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  src={active.videoSrc}
                  className="absolute inset-0 h-full w-full object-cover opacity-85 transition duration-700 hover:scale-105"
                  style={{ maskImage: 'radial-gradient(ellipse at center, black 55%, transparent 95%)', WebkitMaskImage: 'radial-gradient(ellipse at center, black 55%, transparent 95%)' }}
                />
              ) : (
                <img
                  src={active.id === 'push' ? swayambhuFestivalImage : active.id === 'commit' ? himalayasImage : nepalMarketImage}
                  alt={`${active.place} visual`}
                  className="absolute inset-0 h-full w-full object-cover opacity-85 transition duration-700 hover:scale-105"
                  style={{ maskImage: 'radial-gradient(ellipse at center, black 55%, transparent 95%)', WebkitMaskImage: 'radial-gradient(ellipse at center, black 55%, transparent 95%)' }}
                />
              )}
            </div>
            <h2 className="mt-12 font-display text-4xl font-bold tracking-[-.04em] text-[#f5eedf]">{active.title}</h2>
            <p className="mt-2 font-mono-custom text-[10px] uppercase tracking-[.2em]" style={{ color: active.accent }}>{active.command}</p>
            <p className="mt-2 flex items-center gap-2 font-mono-custom text-[10px] uppercase tracking-[.12em] text-[#8f98a8]"><MapPin size={13} style={{ color: active.accent }} /> {active.place}</p>
            <div className="my-7 hairline" /><p className="text-sm leading-7 text-[#a1a6b2]">{active.description}</p>
            <div className="mt-8 flex items-center justify-between"><span className="font-mono-custom text-[10px] uppercase tracking-[.14em] text-[#687386]">{active.date}</span><ChevronRight size={17} style={{ color: active.accent }} /></div>
          </div>
        </div>
      </div>
      <div className="mt-16 grid gap-4 sm:grid-cols-3">{[{ icon: ShieldCheck, title: 'Fair by design', text: 'Human judges, public rubrics, and a branch history that tells the truth.' }, { icon: Network, title: 'Build in public', text: 'Your repo is the story. Make the README part of the experience.' }, { icon: Globe2, title: 'Go somewhere', text: 'The strongest branches do not end at the merge button.' }].map((item, index) => { const Icon = item.icon; return <div key={item.title} className={`reveal delay-${index + 1} border-l border-[#b990ff]/40 px-5 py-2`}><Icon className="mb-5 text-[#b990ff]" size={19} /><h3 className="font-display text-xl font-bold text-[#f5eedf]">{item.title}</h3><p className="mt-2 text-sm leading-6 text-[#8f98a8]">{item.text}</p></div>; })}</div>
    </PageFrame>
  );
}

function AboutUsPage() {
  const team = [
    {
      name: 'Aniruddha Akhare',
      role: 'Agentic AI Developer and Co-Founder at ARQON Vectors, specializing in building intelligent, reasoning AI systems. With a track record of competing in over 80+ hackathons and securing multiple national-level podium finishes, he has mastered the art of turning ambitious ideas into real-world products under intense pressure. Now sharing his expertise as a Mentor and Judge for Smart India Hackathon (SIH) 2026, he is driven by a singular mindset: building AI that doesn\'t just answer, but gets things done.',
      image: '/team/aniruddha.png',
      github: 'https://github.com/AniruddhaAkhare',
      linkedin: 'http://www.linkedin.com/in/aniruddha-akhare-76b6a535a',
      twitter: 'https://x.com/AniruddhaAkhare',
      email: 'mailto:aniruddhaakhare2004@gmail.com',
      emailDisplay: 'aniruddhaakhare2004@gmail.com',
      phone: 'tel:+919689158304',
      phoneDisplay: '+91 9689158304'
    },
    {
      name: 'Parth Deshmukh',
      role: 'Software Developer and Co-Founder at ARQON Vectors. He bridges complex architecture with real-world execution—taking AI-driven platforms from prototypes to production-ready, high-traffic systems. Beyond technical scaling, he is a community leader who has orchestrated high-stakes technical competitions for 500+ participants and core team member at Google Developer Group. He also commands a massive digital footprint, generating over a million views.',
      image: '/team/parth.png',
      github: 'https://github.com/parth2506-wq',
      linkedin: 'https://www.linkedin.com/in/parth-deshmukh-47946b251/',
      twitter: 'https://x.com/iamyourparth',
      email: 'mailto:work.parthdes@gmail.com',
      emailDisplay: 'work.parthdes@gmail.com',
      phone: 'tel:+918839652553',
      phoneDisplay: '+91 8839652553'
    }
  ];

  return (
    <PageFrame kicker="05 / the architects" title="About Us" intro="Meet the minds behind GIT.COMMIT.PUSH.">
      <div className="mt-14 grid gap-8 sm:grid-cols-2 max-w-5xl mx-auto">
        {team.map((member) => (
          <div key={member.name} className="glow-card nepali-corner rounded-sm p-8 flex flex-col items-center text-center">
            <div className="h-40 w-40 sm:h-48 sm:w-48 rounded-full bg-[#0d1117] border border-[#f5eedf]/15 mb-6 flex items-center justify-center overflow-hidden">
              {member.image ? (
                <img src={member.image} alt={member.name} className="h-full w-full object-cover" />
              ) : (
                <Users size={32} className="text-[#8f98a8]" />
              )}
            </div>
            <h2 className="font-display text-2xl font-bold text-[#f5eedf]">{member.name}</h2>
            <p className="mt-5 text-[13.5px] sm:text-[14px] leading-relaxed text-justify text-[#c0c7d5] tracking-normal font-sans hyphens-auto min-h-[60px]">{member.role}</p>

            <div className="mt-6 flex flex-wrap justify-center gap-2 text-xs font-mono-custom">
              <a href={member.phone} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#f5eedf]/5 hover:bg-[#7ee7d6]/10 border border-[#f5eedf]/10 hover:border-[#7ee7d6]/40 text-[#7ee7d6] transition-colors">
                <Phone size={13} /> {member.phoneDisplay}
              </a>
              <a href={member.email} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#f5eedf]/5 hover:bg-[#ff7c4c]/10 border border-[#f5eedf]/10 hover:border-[#ff7c4c]/40 text-[#ff7c4c] transition-colors">
                <Mail size={13} /> {member.emailDisplay}
              </a>
            </div>

            <div className="mt-5 flex items-center gap-5">
              <a href={member.github} target="_blank" rel="noreferrer" title="GitHub" className="text-[#8f98a8] hover:text-[#f5eedf] transition-colors">
                <Github size={20} />
              </a>
              <a href={member.linkedin} target="_blank" rel="noreferrer" title="LinkedIn" className="text-[#8f98a8] hover:text-[#f5eedf] transition-colors">
                <Linkedin size={20} />
              </a>
              <a href={member.twitter} target="_blank" rel="noreferrer" title="X (Twitter)" className="text-[#8f98a8] hover:text-[#f5eedf] transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865l8.875 11.633Z" />
                </svg>
              </a>
              <a href={member.email} title={`Email: ${member.emailDisplay}`} className="text-[#8f98a8] hover:text-[#f5eedf] transition-colors">
                <Mail size={20} />
              </a>
              <a href={member.phone} title={`Call: ${member.phoneDisplay}`} className="text-[#8f98a8] hover:text-[#f5eedf] transition-colors">
                <Phone size={20} />
              </a>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-28 relative overflow-hidden rounded-sm border border-[#7ee7d6]/20 bg-[#0a0d14] p-8 sm:p-14 max-w-5xl mx-auto shadow-[0_0_40px_rgba(126,231,214,0.1)] group">
        <video
          autoPlay loop muted playsInline
          src="/arqon.mp4"
          className="absolute inset-0 h-full w-full object-cover opacity-40 mix-blend-screen transition-opacity duration-700 group-hover:opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0d14] via-[#0a0d14]/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0d14] via-[#0a0d14]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-br from-[#7ee7d6]/5 via-transparent to-[#b990ff]/5" />

        <div className="relative z-10 flex flex-col items-start max-w-3xl">
          <div className="mb-8 w-full">
            <div className="inline-block rounded-xl border border-[#7ee7d6]/40 bg-[#f8f9fa] p-3 sm:p-4 shadow-[0_0_35px_rgba(126,231,214,0.25)] transition-all hover:border-[#7ee7d6]">
              <img 
                src="/arqon_full_logo.png" 
                alt="ARQON VECTORS" 
                className="h-16 sm:h-20 w-auto max-w-full object-contain drop-shadow-sm" 
              />
            </div>
            <p className="font-mono-custom text-xs uppercase tracking-[0.25em] text-[#7ee7d6] mt-3 font-semibold">BUILD. ORCHESTRATE. SCALE.</p>
          </div>

          <div className="space-y-5">
            <p className="text-base sm:text-lg leading-relaxed text-[#c4b8c9]">
              <strong className="text-[#f5eedf] font-semibold">ARQON VECTORS</strong> is an AI-native technology company building intelligent software, autonomous AI agents, automation systems, cloud infrastructure, and next-generation digital products.
            </p>
            <p className="text-base sm:text-lg leading-relaxed text-[#c4b8c9]">
              We build our own AI products and subscription platforms while engineering personalized AI solutions, enterprise software, private AI systems, and scalable cloud deployments for businesses.
            </p>
            <p className="text-base sm:text-lg leading-relaxed text-[#c4b8c9]">
              From agent orchestration and AI automation to custom software, DevOps, observability, and industrial intelligence — we turn ideas into intelligent systems that build, decide, and scale.
            </p>

            <div className="mt-8 pt-6 border-t border-[#7ee7d6]/20 flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-3">
              <span className="font-mono-custom text-xs uppercase tracking-[0.2em] text-[#7ee7d6] font-semibold">Founders:</span>
              <span className="text-base text-[#f5eedf] font-semibold tracking-wide">Aniruddha Akhare, Parth Deshmukh, Riya Umekar</span>
            </div>
          </div>
        </div>
      </div>
    </PageFrame>
  );
}

function FaqPage() {
  const faqs = [
    { q: 'Do I need a team to participate?', a: 'Yes you mandatorily need to form a team of up to 5 members or minimum 3 members. We highly encourage teaming up to bring diverse skills.' },
    { q: 'Is there an entry fee?', a: 'No. Round 1 is completely free to enter. Register your team and submit your idea with absolutely zero financial friction.' },
    { q: 'What happens if we qualify for Round 2?', a: 'The top 300 teams from Round 1 will be invited to Nagpur for a rigorous physical hackathon. Be prepared to build live, further instruction would be clarrifies through communication channels' },
    { q: 'Who pays for the trip to Nepal?', a: 'The top 3 teams from the Nagpur qualifier will win a fully sponsored trip to Nepal for the final showdown and grand prize.' },
    { q: 'Can we change our challenge repository after registering?', a: 'No, once your team selects a challenge repository and initializes the branch, you are locked in to that specific problem statement.' },
    { q: 'How can we contact the organizers for queries or support?', a: 'You can reach out directly to the lead organizers: Aniruddha Akhare (+91 9689158304 / aniruddhaakhare2004@gmail.com) or Parth Deshmukh (+91 8839652553 / work.parthdes@gmail.com). We are actively responding to all participant queries.' }
  ];

  return (
    <PageFrame kicker="06 / questions answered" title="FAQ" intro="Everything you need to know about the GIT.COMMIT.PUSH expedition.">
      <div className="mt-14 max-w-4xl mx-auto space-y-6">
        {faqs.map((faq, index) => (
          <div key={index} className="glow-card nepali-corner rounded-sm p-6 sm:p-8 hover:border-[#f5eedf]/30 transition-colors duration-300">
            <h3 className="font-display text-xl font-bold text-[#f5eedf] mb-4 flex gap-4">
              <span className="text-[#ff7c4c]">Q.</span> {faq.q}
            </h3>
            <p className="text-sm leading-6 text-[#a1a6b2] pl-8 border-l-2 border-[#b990ff]/20">
              <span className="text-[#b990ff] font-bold mr-2">A.</span> {faq.a}
            </p>
          </div>
        ))}
        <div className="mt-12 glow-card nepali-corner rounded-sm p-8 text-center flex flex-col items-center border border-[#ff4f9a]/20 bg-[#ff4f9a]/5 relative overflow-hidden">
          <div className="absolute -left-20 -top-20 h-40 w-40 rounded-full bg-[#ff4f9a]/10 blur-[50px]" />
          <h3 className="font-display text-2xl font-bold text-[#f5eedf] mb-3 relative z-10">Have questions? Talk to the organizers.</h3>
          <p className="text-[#a1a6b2] text-sm mb-8 max-w-md relative z-10">Reach out directly to our team for any specific queries or support regarding the expedition.</p>
          
          <div className="grid sm:grid-cols-2 gap-6 w-full max-w-2xl relative z-10 text-left">
            <div className="p-6 rounded border border-[#f5eedf]/10 bg-[#0d1117]/80 hover:border-[#7ee7d6]/30 transition-colors">
              <p className="font-display font-bold text-[#f5eedf] text-lg">Aniruddha Akhare</p>
              <p className="text-xs text-[#8f98a8] mb-4">Organizer & Co-Founder, Arqon Vectors</p>
              <div className="space-y-3 font-mono-custom text-[13px]">
                <a href="tel:+919689158304" className="flex items-center gap-2.5 text-[#7ee7d6] hover:text-[#f5eedf] transition-colors">
                  <Phone size={15} /> +91 9689158304
                </a>
                <a href="mailto:aniruddhaakhare2004@gmail.com" className="flex items-center gap-2.5 text-[#ff7c4c] hover:text-[#f5eedf] transition-colors">
                  <Mail size={15} /> aniruddhaakhare2004@gmail.com
                </a>
                <div className="pt-2 flex items-center gap-3 text-[#8f98a8]">
                  <a href="https://github.com/AniruddhaAkhare" target="_blank" rel="noreferrer" title="GitHub" className="hover:text-[#f5eedf] transition-colors"><Github size={16} /></a>
                  <a href="http://www.linkedin.com/in/aniruddha-akhare-76b6a535a" target="_blank" rel="noreferrer" title="LinkedIn" className="hover:text-[#f5eedf] transition-colors"><Linkedin size={16} /></a>
                </div>
              </div>
            </div>

            <div className="p-6 rounded border border-[#f5eedf]/10 bg-[#0d1117]/80 hover:border-[#b990ff]/30 transition-colors">
              <p className="font-display font-bold text-[#f5eedf] text-lg">Parth Deshmukh</p>
              <p className="text-xs text-[#8f98a8] mb-4">Organizer & Co-Founder, Arqon Vectors</p>
              <div className="space-y-3 font-mono-custom text-[13px]">
                <a href="tel:+918839652553" className="flex items-center gap-2.5 text-[#b990ff] hover:text-[#f5eedf] transition-colors">
                  <Phone size={15} /> +91 8839652553
                </a>
                <a href="mailto:work.parthdes@gmail.com" className="flex items-center gap-2.5 text-[#ff7c4c] hover:text-[#f5eedf] transition-colors">
                  <Mail size={15} /> work.parthdes@gmail.com
                </a>
                <div className="pt-2 flex items-center gap-3 text-[#8f98a8]">
                  <a href="https://github.com/parth2506-wq" target="_blank" rel="noreferrer" title="GitHub" className="hover:text-[#f5eedf] transition-colors"><Github size={16} /></a>
                  <a href="https://www.linkedin.com/in/parth-deshmukh-47946b251/" target="_blank" rel="noreferrer" title="LinkedIn" className="hover:text-[#f5eedf] transition-colors"><Linkedin size={16} /></a>
                  <a href="https://x.com/iamyourparth" target="_blank" rel="noreferrer" title="X" className="hover:text-[#f5eedf] transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865l8.875 11.633Z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageFrame>
  );
}

function RegisterPage() {
  return (
    <PageFrame kicker="03 / initialize repository" title="The gates are open." intro="Registration is now officially open on Unstop. Gather your team, select your challenge, and submit your proposal.">
      <div className="mt-14 max-w-4xl mx-auto glow-card nepali-corner rounded-sm p-8 sm:p-12 text-center flex flex-col items-center">
        <div className="flex items-center gap-3 mb-6">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
          </span>
          <span className="font-mono-custom text-xs uppercase tracking-widest text-red-400 font-bold">Live Status</span>
        </div>

        <h2 className="font-display text-4xl font-bold text-white sm:text-6xl tracking-tight">Round 1 is LIVE!</h2>
        <p className="mt-6 text-lg leading-8 text-[#a1a6b2] max-w-2xl mx-auto">
          The vault is open. Head over to Unstop to officially register your team and submit your Round 1 PPT and Video pitch.
        </p>

        <div className="mt-10 w-full flex justify-center">
          <a href="#" target="_blank" rel="noreferrer" className="btn-primary min-h-[56px] text-base px-10">
            Register Now on Unstop <ArrowRight size={18} className="ml-2" />
          </a>
        </div>

        <div className="my-14 w-full hairline opacity-50" />

        <p className="font-mono-custom text-xs uppercase tracking-widest text-[#ff7c4c] mb-8">Before you commit</p>

        <div className="grid gap-6 w-full sm:grid-cols-2 text-left">
          <div className="border border-[#f5eedf]/10 p-7 bg-[#0d1117]/60 rounded-sm hover:bg-[#f5eedf]/[.04] transition duration-300">
            <h3 className="font-display text-2xl font-bold text-white mb-3">Read the Rules</h3>
            <p className="text-sm leading-6 text-[#8f98a8] mb-8">It is highly emphasized to read the rules and regulations for Round 1 before submitting to ensure your team is fully eligible.</p>
            <Link href="/rules" className="btn-secondary w-full justify-center min-h-[44px]">
              Read Rules & Regulations
            </Link>
          </div>

          <div className="border border-[#f5eedf]/10 p-7 bg-[#0d1117]/60 rounded-sm hover:bg-[#f5eedf]/[.04] transition duration-300">
            <h3 className="font-display text-2xl font-bold text-white mb-3">Pick a Repository</h3>
            <p className="text-sm leading-6 text-[#8f98a8] mb-8">Your team must select exactly one of the 11 official challenge repositories. Once selected, it cannot be changed.</p>
            <Link href="/challenges" className="btn-secondary w-full justify-center min-h-[44px]">
              See All Challenges
            </Link>
          </div>
        </div>
      </div>
    </PageFrame>
  );
}

function PrizeVisual() {
  return (
    <div className="prize-sheen relative min-h-[340px] overflow-hidden rounded-sm border border-[#ff4f9a]/45 bg-gradient-to-br from-[#261c42] via-[#302052] to-[#0e202a] p-6 sm:min-h-[450px] sm:p-9">
      <video autoPlay loop muted playsInline src="/nepal_aesthetics.mp4" className="absolute inset-0 h-full w-full object-cover opacity-55" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#191326] via-[#281b3a]/65 to-[#ff4f9a]/10" />
      <div className="absolute right-[-10%] top-[-12%] h-64 w-64 rounded-full border border-[#ff7c4c]/30 bg-[#ff7c4c]/10 blur-[1px]" /><div className="absolute right-[13%] top-[13%] h-36 w-36 rounded-full border border-[#ff7c4c]/40 bg-[#ff7c4c]/15" />
      <div className="relative flex h-full min-h-[280px] flex-col justify-between"><div className="flex items-center justify-between"><span className="font-mono-custom text-[10px] uppercase tracking-[.16em] text-[#7ee7d6]">payload / 001</span><Trophy size={21} className="text-[#ff7c4c]" /></div><div><p className="eyebrow text-[#ff4f9a]">the grand prize</p><h2 className="mt-4 max-w-md font-display text-5xl font-bold leading-[.9] tracking-[-.06em] text-[#f5eedf] sm:text-7xl">Nepal<br /><span className="text-[#ff7c4c]">unlocked<span className="text-[#ff4f9a]">*</span>.</span></h2><p className="mt-5 max-w-sm text-sm leading-6 text-[#c4b8c9]">A winning trip for the winning branch — Himalayas, city lights, river air, and the kind of debrief that lasts forever.</p><p className="mt-3 font-mono-custom text-[10px] uppercase tracking-[.12em] text-[#8f98a8]">* Terms and conditions apply.</p></div></div>
    </div>
  );
}

function PrizesPage() {
  return (
    <PageFrame kicker="04 / merge reward" title="The payload is a foreign trip." intro="The grand prize is not another gadget box. It is a live city, a full team trip, and a destination worth building toward.">
      <div className="mt-14 grid gap-8 lg:grid-cols-[1.25fr_.75fr] lg:items-stretch"><PrizeVisual /><div className="glow-card flex flex-col justify-between rounded-sm p-7 sm:p-9"><div><p className="eyebrow text-[#ff7c4c]">winning branch includes</p><ul className="mt-7 space-y-5">{['Nepal trip* for the full winning team', 'Hotel, flights, and a city-led winning itinerary', 'All major destinations covered', 'The GCP trophy, custom merch, and bragging rights'].map((item) => <li key={item} className="flex gap-3 text-sm leading-6 text-[#b6bac5]"><Check size={17} className="mt-1 shrink-0 text-[#7ee7d6]" />{item}</li>)}</ul></div><div className="mt-10 border-t border-[#f5eedf]/10 pt-5"><p className="font-mono-custom text-[10px] uppercase tracking-[.12em] text-[#687386]">estimated branch value</p><p className="mt-2 font-display text-3xl font-bold text-[#f5eedf]">priceless<span className="text-[#ff7c4c]">.</span></p></div></div></div>
      <div className="mt-12 grid gap-4 sm:grid-cols-3">{[{ icon: ShieldCheck, title: 'Certificates For All', text: 'Every builder who initializes a branch and submits their work receives a verified participation certificate to showcase their effort.' }, { icon: Trophy, title: 'Top 20 Rewards', text: 'Falling just short of the grand prize? The top 20 teams still walk away with exclusive rewards and premium runner-up perks.' }, { icon: Sparkles, title: 'Swags For Everyone', text: 'We believe every great commit deserves recognition. Expect limited edition stickers, custom apparel, and physical artifacts for participating.' }].map((item, index) => { const Icon = item.icon; return <div key={item.title} className={`glow-card reveal delay-${index + 1} rounded-sm p-6`}><Icon size={19} className="text-[#ff7c4c]" /><h3 className="mt-6 font-display text-xl font-bold text-[#f5eedf]">{item.title}</h3><p className="mt-2 text-sm leading-6 text-[#8f98a8]">{item.text}</p></div>; })}</div>
      <div className="mt-14 flex flex-col items-start justify-between gap-5 border-t border-[#f5eedf]/10 pt-7 sm:flex-row sm:items-center"><div><p className="font-display text-2xl font-bold text-[#f5eedf]">Ready to make the trip?</p><p className="mt-1 text-sm text-[#8f98a8]">Start with a single line in a new repository.</p></div><Link href="/register" className="btn-primary" data-testid="link-prizes-register">Initialize your branch <ArrowRight size={15} /></Link></div>
    </PageFrame>
  );
}

function UninventedPage() {
  const [selected, setSelected] = useState(0);
  const { unlockClue, hasClue } = useTreasure();
  const beat = expeditionBeats[selected];
  return (
    <PageFrame kicker="00 / the operating philosophy" title="Build what doesn’t exist yet." intro="GIT.COMMIT.PUSH is an expedition for people who would rather invent the question than polish the obvious answer. The map is not a schedule. It is a sequence of unlocks.">
      <div className="mt-14 grid gap-8 lg:grid-cols-[.7fr_1.3fr] lg:items-start">
        <div className="glow-card nepali-corner rounded-sm p-5 sm:p-7 h-fit">
          <div className="mb-6 flex items-center justify-between"><span className="font-mono-custom text-[10px] uppercase tracking-[.15em] text-[#687386]">quest map / 001</span><button type="button" className={`hidden-route-marker ${hasClue('clue-07') ? 'is-found' : ''}`} onClick={() => { setSelected(7); unlockClue('clue-07'); }} aria-label="Follow the hidden route on the map">⌁</button></div>
          <div className="space-y-2">
            {expeditionBeats.map((item, index) => <button key={item.label} type="button" onClick={() => setSelected(index)} className={`quest-list-item flex w-full items-center gap-3 rounded-sm border px-3 py-3 text-left transition ${selected === index ? 'border-[#f5eedf]/30 bg-[#f5eedf]/[.06]' : 'border-transparent hover:border-[#f5eedf]/15'}`}><span className="font-mono-custom text-[10px]" style={{ color: item.color }}>0{index + 1}</span><span className="font-display text-lg font-bold text-[#f5eedf]">{item.label}</span><ChevronRight size={14} className={`ml-auto transition ${selected === index ? 'translate-x-1 text-[#ff7c4c]' : 'text-[#687386]'}`} /></button>)}
          </div>
        </div>
        <div className="invented-panel relative overflow-hidden rounded-sm border border-[#7ee7d6]/25 bg-[#111c21] p-7 sm:p-10">
          <div className="absolute -bottom-24 -right-20 h-72 w-72 rounded-full bg-[#b990ff]/10 blur-[90px]" />
          <div className="relative">
            <div className="flex items-center justify-between"><span className="font-mono-custom text-[10px] uppercase tracking-[.16em]" style={{ color: beat.color }}>unlock / {String(selected + 1).padStart(2, '0')}</span><span className="font-mono-custom text-[10px] text-[#687386]">THE UNINVENTED</span></div>
            <h2 className="mt-16 font-display text-5xl font-bold tracking-[-.06em] text-[#f5eedf] sm:text-7xl">{beat.label}</h2>
            <p className="mt-5 max-w-xl text-lg leading-8 text-[#cad1d3]">{beat.detail}</p>
            {selected === 0 && (
              <div className="mt-8 flex flex-col items-start gap-4 rounded-sm border border-[#b990ff]/20 bg-[#b990ff]/5 p-5 sm:p-6 backdrop-blur-sm">
                <p className="text-base text-[#f5eedf] font-semibold">Ready to pick your battle? Choose from 11 well-curated challenges!</p>
                <Link href="/challenges" className="btn-primary" data-testid="link-uninvented-challenges">
                  View Challenges <ArrowRight size={15} />
                </Link>
              </div>
            )}
            {selected === 1 && (
              <div className="mt-8 flex flex-col items-start gap-4 rounded-sm border border-[#7ee7d6]/20 bg-[#7ee7d6]/5 p-5 sm:p-6 backdrop-blur-sm">
                <p className="text-base text-[#f5eedf] font-semibold">Ready to design your solution? Create your PPT and video, and initialize your branch!</p>
                <Link href="/register" className="btn-primary" data-testid="link-uninvented-register">
                  Initialize <ArrowRight size={15} />
                </Link>
              </div>
            )}
            {selected === 2 && (
              <div className="mt-8 flex flex-col items-start gap-4 rounded-sm border border-[#ff7c4c]/20 bg-[#ff7c4c]/5 p-5 sm:p-6 backdrop-blur-sm">
                <p className="text-base text-[#f5eedf] font-semibold">Curious about how you will be judged? Review the evaluation criteria.</p>
                <Link href="/rules" className="btn-primary" data-testid="link-uninvented-rules">
                  View Rules & Criteria <ArrowRight size={15} />
                </Link>
              </div>
            )}
            {selected === 6 && (
              <div className="mt-8 flex flex-col items-start gap-4 rounded-sm border border-[#ff4f9a]/20 bg-[#ff4f9a]/5 p-5 sm:p-6 backdrop-blur-sm">
                <p className="text-base text-[#f5eedf] font-semibold">The top teams will head to Nepal* for the Final Merge. Check out what awaits you!</p>
                <Link href="/prizes" className="btn-primary" data-testid="link-uninvented-prizes">
                  Explore Prizes <ArrowRight size={15} />
                </Link>
              </div>
            )}
            <div className="mt-10 flex flex-wrap gap-3 font-mono-custom text-[10px] uppercase tracking-[.12em] text-[#8f98a8]"><span className="border border-[#f5eedf]/15 px-3 py-2">idea / build / break</span><span className="border border-[#f5eedf]/15 px-3 py-2">signal {String(selected + 1).padStart(2, '0')} / 07</span></div>
            <div className="mt-12 border-t border-[#f5eedf]/10 pt-5 font-mono-custom text-[11px] text-[#7ee7d6]">$ {beat.label.toLowerCase()}_the_unknown<span className="cursor-blink ml-1 inline-block h-3 align-middle" /></div>
          </div>
        </div>
      </div>
      <div className="mt-14 grid gap-4 sm:grid-cols-3">
        {[
          ['01', 'No spectators', 'Every person in the room is here to contribute, question, and ship.'],
          ['02', 'No safe brief', 'The strongest idea may begin as the strangest question on the board.'],
          ['03', 'No small finish', 'A good build leaves the screen and changes the conversation outside it.'],
        ].map(([number, title, text]) => <div key={number} className="glow-card rounded-sm p-6"><span className="font-mono-custom text-[10px] text-[#ff7c4c]">{number}</span><h3 className="mt-6 font-display text-xl font-bold text-[#f5eedf]">{title}</h3><p className="mt-2 text-sm leading-6 text-[#8f98a8]">{text}</p></div>)}
      </div>
    </PageFrame>
  );
}

function ChallengesPage() {
  const [selected, setSelected] = useState<typeof challenges[0] | null>(null);
  return (
    <PageFrame kicker="05 / challenge repositories" title="Find the problem nobody is solving." intro="These are not prompts to decorate a demo. They are open repositories for questions that deserve a first commit. Pick one, fork the thinking, and make your own branch.">
      <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {challenges.map((challenge, index) => (
          <button key={challenge.slug} type="button" onClick={() => setSelected(challenge)} className="challenge-card group relative overflow-hidden rounded-sm border p-5 text-left transition sm:p-6 bg-[#10141b]/70 hover:bg-[#f5eedf]/[.04]" style={{ borderColor: 'rgba(245,238,223,.14)' }}>
            <div className="flex items-start justify-between">
              <span className="font-mono-custom text-[10px] uppercase tracking-[.14em]" style={{ color: challenge.accent }}>repository / {challenge.slug}</span>
              <ChevronRight size={16} className="text-[#687386] transition group-hover:translate-x-1 group-hover:text-[#f5eedf]" />
            </div>
            <h2 className="mt-14 font-display text-xl font-bold leading-none text-[#f5eedf]">{challenge.title}</h2>
            <p className="mt-4 font-mono-custom text-[10px] uppercase tracking-[.12em] text-[#8f98a8]">{challenge.tags}</p>
            <div className="mt-7 flex items-center justify-between border-t border-[#f5eedf]/10 pt-4">
              <span className="font-mono-custom text-[10px] text-[#687386]">{challenge.difficulty}</span>
              <span className="font-mono-custom text-[10px] uppercase tracking-[.12em]" style={{ color: challenge.accent }}>open repository</span>
            </div>
          </button>
        ))}
      </div>

      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-w-3xl border-0 p-0 bg-transparent shadow-none [&>button]:hidden">
          {selected && (
            <PixelTransition
              firstContent={<div className="w-full h-full bg-[#10141b] rounded-sm border min-h-[400px]" style={{ borderColor: `${selected.accent}66` }} />}
              secondContent={
                <div className="challenge-detail nepali-corner relative rounded-sm border p-6 sm:p-10 shadow-2xl backdrop-blur-2xl" style={{ borderColor: `${selected.accent}66`, background: `linear-gradient(145deg, ${selected.accent}33, rgba(16,20,28,.95))` }}>
                  <button type="button" onClick={() => setSelected(null)} className="absolute right-6 top-6 text-[#8f98a8] hover:text-[#f5eedf] transition-colors z-50"><X size={20} /></button>
                  <div className="flex items-center gap-4"><span className="font-mono-custom text-[10px] uppercase tracking-[.15em]" style={{ color: selected.accent }}>repository / {selected.slug}</span><span className="blink h-2 w-2 rounded-full" style={{ backgroundColor: selected.accent }} /></div>
                  <DialogTitle className="mt-10 font-display text-4xl font-bold leading-none text-[#f5eedf]">{selected.title}</DialogTitle>
                  <DialogDescription className="mt-6 text-lg leading-8 text-[#d1c9d4]">{selected.question}</DialogDescription>
                  <div className="my-7 hairline" />
                  <p className="font-mono-custom text-[10px] uppercase tracking-[.14em] text-[#687386]">why it matters</p>
                  <p className="mt-3 text-sm leading-7 text-[#a1a6b2]">{selected.detail}</p>
                  <div className="mt-8 grid gap-3 sm:grid-cols-2"><div className="border border-[#f5eedf]/10 p-4"><p className="font-mono-custom text-[10px] uppercase tracking-[.12em] text-[#687386]">expected output</p><p className="mt-2 text-sm text-[#f5eedf]">{selected.output}</p></div><div className="border border-[#f5eedf]/10 p-4"><p className="font-mono-custom text-[10px] uppercase tracking-[.12em] text-[#687386]">branch status</p><p className="mt-2 flex items-center gap-2 text-sm text-[#7ee7d6]"><span className="blink h-1.5 w-1.5 rounded-full bg-[#7ee7d6]" /> accepting forks</p></div></div>
                  <Link href="/register" className="btn-primary mt-8 w-full" onClick={() => setSelected(null)}>Fork this challenge <GitBranch size={15} /></Link>
                </div>
              }
              gridSize={12}
              pixelColor={selected.accent}
              animationStepDuration={0.4}
              className="w-full rounded-sm"
            />
          )}
        </DialogContent>
      </Dialog>
    </PageFrame>
  );
}

const stageData = {
  init: {
    kicker: '06 / git init',
    title: 'Start the idea.',
    intro: 'Every revolution starts as an idea. Initialize a repository for the question you cannot stop thinking about, then make it legible enough for a team to join.',
    command: 'git init',
    location: 'ONLINE · EVERYWHERE',
    image: nepalMarketImage,
    videoSrc: '/round1.mp4',
    accent: '#b990ff',
    stats: ['20-25th Sept', 'TOP 300 ADVANCE', 'PUBLIC REPOSITORY'],
    steps: ['Register your team and choose a challenge repository.', 'Build a sharp solution with a clear README.', 'Push one submission before the qualifier closes.'],
  },
  commit: {
    kicker: '07 / git commit',
    title: 'Build the idea.',
    intro: 'The selected branches get checked out in Nagpur for a physical hack. Build, break, rebuild, and commit something that can survive a room full of questions.',
    command: 'git commit',
    location: 'NAGPUR · INDIA',
    image: himalayasImage,
    videoSrc: '/round2_new.mp4',
    accent: '#ff7c4c',
    stats: ['Date: TBA', 'Offline', 'TOP 03 PUSH'],
    steps: ['Arrive with a working branch and an open mind.', 'Use the room, mentors, constraints, and the clock.', 'Present the commit that changed after the first failure.'],
  },
  push: {
    kicker: '08 / git push',
    title: 'Take it to the world.',
    intro: 'The final three branches leave Nagpur and push across the border.',
    command: 'git push',
    location: 'NAGPUR → NEPAL → THE WORLD',
    image: swayambhuFestivalImage,
    videoSrc: '/round3.mp4',
    accent: '#ff4f9a',
    stats: ['Date: TBA', 'FINAL 03 TEAMS', 'Foreign Travel'],
    steps: ['Travel with the repository that earned its place.', 'Build the final narrative under Nepal lights and cold.', 'Push the idea beyond the screen and onto the world.'],
  },
};

function StagePage({ stage }: { stage: keyof typeof stageData }) {
  const data = stageData[stage];
  return (
    <PageFrame kicker={data.kicker} title={data.title} intro={data.intro}>
      <div className="mt-14 grid gap-8 lg:grid-cols-[1.15fr_.85fr]">
        <div className="stage-photo nepali-corner relative min-h-[420px] overflow-hidden rounded-sm border" style={{ borderColor: `${data.accent}66` }}>
          {(data as any).videoSrc ? (
            <video
              autoPlay
              loop
              muted
              playsInline
              src={(data as any).videoSrc}
              className="absolute inset-0 h-full w-full object-cover opacity-60 mix-blend-screen"
            />
          ) : (
            <img src={data.image} alt={`${data.location} event visual`} className="absolute inset-0 h-full w-full object-cover opacity-75" />
          )}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0d1117] via-[#0d1117]/50 to-transparent" />
          <div className="relative flex h-full min-h-[420px] flex-col justify-between p-6 sm:p-9"><div className="flex items-center justify-between font-mono-custom text-[10px] uppercase tracking-[.14em] text-[#f5eedf]"><span style={{ color: data.accent }}>$ {data.command}</span><span>stage / 0{stage === 'init' ? 1 : stage === 'commit' ? 2 : 3}</span></div><div><p className="font-mono-custom text-[10px] uppercase tracking-[.16em]" style={{ color: data.accent }}>{data.location}</p><h2 className="mt-3 max-w-lg font-display text-5xl font-bold leading-[.9] tracking-[-.05em] text-[#f5eedf] sm:text-7xl">{stage === 'push' ? <>Nepal<br /><span style={{ color: data.accent }}>is the payload.</span></> : stage === 'commit' ? <>The room<br /><span style={{ color: data.accent }}>is the pressure.</span></> : <>The blank repo<br /><span style={{ color: data.accent }}>is the invitation.</span></>}</h2></div></div>
          <div className="absolute bottom-5 right-5"><CommitRunner compact /></div>
        </div>
        <div className="glow-card rounded-sm p-6 sm:p-8">
          <div className="flex items-center justify-between"><span className="font-mono-custom text-xs" style={{ color: data.accent }}>$ {data.command}</span><Rocket size={18} style={{ color: data.accent }} /></div>
          <div className="mt-8 grid gap-2 sm:grid-cols-3">{data.stats.map((stat) => <div key={stat} className="border border-[#f5eedf]/10 px-3 py-3 font-mono-custom text-[9px] uppercase leading-4 tracking-[.1em] text-[#a1a6b2]">{stat}</div>)}</div>
          <div className="my-8 hairline" />
          <p className="font-mono-custom text-[10px] uppercase tracking-[.15em] text-[#687386]">commit protocol</p>
          <div className="mt-5 space-y-5">{data.steps.map((item, index) => <div key={item} className="flex gap-3"><span className="font-mono-custom text-[10px]" style={{ color: data.accent }}>0{index + 1}</span><p className="text-sm leading-6 text-[#b6bac5]">{item}</p></div>)}</div>
          <Link href={stage === 'push' ? '/prizes' : stage === 'init' ? '/register' : '/about-us'} className="btn-primary mt-9 w-full" style={{ backgroundColor: stage === 'push' ? '#ff4f9a' : undefined }}>{stage === 'push' ? 'Enter the final vault' : stage === 'init' ? 'Initialize your branch' : 'Meet the architects'} <ArrowRight size={15} /></Link>
        </div>
      </div>
      {stage === 'commit' && <div className="mt-10 glow-card rounded-sm p-6 sm:p-8"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"><div><p className="eyebrow text-[#ff7c4c]">sample commit activity</p><h2 className="mt-2 font-display text-2xl font-bold text-[#f5eedf]">The room is alive before the demo.</h2></div><span className="font-mono-custom text-[10px] uppercase tracking-[.12em] text-[#687386]">live data arrives at event time</span></div><div className="mt-8 grid gap-4 sm:grid-cols-3">{[['TEAM 001', '86%', '#b990ff'], ['TEAM 042', '68%', '#ff7c4c'], ['TEAM 117', '42%', '#7ee7d6']].map(([team, progress, color]) => <div key={team}><div className="mb-2 flex justify-between font-mono-custom text-[10px] text-[#8f98a8]"><span>{team}</span><span style={{ color }}>{progress}</span></div><div className="h-2 bg-[#f5eedf]/10"><div className="h-full" style={{ width: progress, backgroundColor: color }} /></div></div>)}</div></div>}
    </PageFrame>
  );
}

function LostCommitPage() {
  const { complete, unlockedIds } = useTreasure();
  const [progress, setProgress] = useState(complete ? 100 : 0);
  useEffect(() => {
    if (!complete) {
      setProgress(0);
      return;
    }
    let value = 0;
    const timer = window.setInterval(() => {
      value = Math.min(100, value + 10);
      setProgress(value);
      if (value >= 100) window.clearInterval(timer);
    }, 90);
    return () => window.clearInterval(timer);
  }, [complete]);
  return (
    <PageFrame kicker="secret / recovered history" title={complete ? 'You found what was never meant to be found.' : 'This branch is looking back.'} intro={complete ? 'The repository has yielded its missing history. Keep the commit close; some discoveries are better carried than explained.' : 'ACCESS DENIED. The lost commit is not in the current working tree. Keep exploring the route until the repository recognizes you.'}>
      <div className={`lost-commit-vault mt-14 ${complete ? 'is-open' : ''}`}>
        <div className="relative z-10">
          <div className="flex items-center justify-between font-mono-custom text-[10px] uppercase tracking-[.16em] text-[#687386]">
            <span className={complete ? 'text-[#7ee7d6]' : 'text-[#ff4f9a]'}>$ git checkout lost-commit</span>
            <span>{complete ? 'commit recovered' : `${unlockedIds.length} / ${clueRegistry.length} signals`}</span>
          </div>
          <div className="mt-10 space-y-3 font-mono-custom text-xs leading-6">
            <p className="text-[#8f98a8]">Loading...</p>
            <p className="text-[#8f98a8]">Recovering deleted commit...</p>
            <div className="flex items-center gap-3 text-[#f5eedf]"><span className="tracking-[.1em]">{'█'.repeat(Math.floor(progress / 4))}{'░'.repeat(25 - Math.floor(progress / 4))}</span><span>{progress}%</span></div>
            <p className={complete && progress === 100 ? 'text-[#7ee7d6]' : 'text-[#687386]'}>{complete && progress === 100 ? 'COMMIT RECOVERED.' : 'COMMIT NOT FOUND.'}</p>
          </div>
          {complete && progress === 100 && <div className="mt-12 border-t border-[#f5eedf]/10 pt-8"><p className="font-mono-custom text-[10px] uppercase tracking-[.18em] text-[#ff7c4c]">achievement unlocked</p><h2 className="mt-3 font-display text-5xl font-bold tracking-[-.06em] text-[#f5eedf] sm:text-7xl">THE LOST COMMIT</h2><p className="mt-5 max-w-xl text-base leading-7 text-[#b9c0ca]">You found what was never meant to be found.</p><div className="mt-8 inline-flex items-center gap-3 border border-[#ff7c4c]/50 bg-[#ff7c4c]/[.06] px-4 py-3 font-mono-custom text-[10px] uppercase tracking-[.14em] text-[#ffb398]"><GitBranch size={16} /> repository explorer · {clueRegistry.length}/{clueRegistry.length}</div></div>}
          {!complete && <div className="mt-10 border-t border-[#f5eedf]/10 pt-6"><Link href="/un-invented" className="btn-secondary">Return to the route <ArrowRight size={15} /></Link></div>}
        </div>
      </div>
    </PageFrame>
  );
}

function RulesPage() {
  const rules = [
    {
      title: "1. Team Eligibility",
      text: [
        "Team size: minimum 3, maximum 5 members.",
        "Solo entries and teams of fewer than 4 are not eligible — no exceptions.",
        "All members must be registered individually on the official registration platform under the same team ID before submission opens.",
        "One participant cannot be part of more than one team.",
        "Cross-college / cross-city teams are allowed."
      ]
    },
    {
      title: "2. Problem Statement Selection",
      text: [
        "Each team must select exactly one problem statement from the official list.",
        "Once selected and submitted, the problem statement cannot be changed in later rounds.",
        "Teams must build around the problem statement as given — reinterpreting it into an unrelated idea will be marked down or disqualified at judges' discretion."
      ]
    },
    {
      title: "3. What to Submit",
      text: [
        "Every team submits exactly two files:",
        "Presentation (PPT/PDF) — max 6 slides (title slide not counted).",
        "Video — max 2 minutes 30 seconds, hard limit."
      ]
    },
    {
      title: "4. PPT Structure — Required Slide Titles",
      text: [
        "Use these titles, in this order. Do not skip or rename them — judges are scoring against this structure across every team, and off-format decks are harder to score fairly (and will be scored that way).",
        "Title Slide — Team name, team ID, problem statement chosen, member names, member college names (if enrolled).",
        "Problem Understanding — What is the core problem, in your own words, and who is it a problem for",
        "Why This Matters Now — Why this problem is real and unsolved today (not a hypothetical)",
        "Proposed Solution — What you're building, in one clear statement",
        "How It Works — Core mechanism / architecture / flow (diagram strongly preferred over paragraphs)",
        "Tech Stack — Tools, frameworks, APIs you intend to use",
        "Risk & Open Question — What could go wrong, and what you're still unsure about",
        "Slides beyond 7 will not be reviewed. Slide 7 (Risks & Open Questions) is deliberately part of the rubric — judges read this as a sign of real technical thinking, not weakness. Teams that show only confidence and no open questions are typically scored as less credible, not more."
      ]
    },
    {
      title: "5. Video — Rules & Format",
      text: [
        "Maximum duration: 3 minutes. Videos exceeding this will be cut off at 3:00 by the judging team — anything after that mark will not be watched or scored.",
        "The video must include:",
        "A brief team introduction (a few seconds — not the focus)",
        "A verbal walkthrough of the problem and your proposed solution",
        "At minimum, a visual mockup, wireframe, or sketch of what the working product will look like — a video with only people talking to camera and no visual of the actual concept will be scored lower",
        "No requirement for working code or a functional prototype at this stage — Round 1 evaluates clarity of thinking, not execution.",
        "Language: English or Hindi (with English subtitles if Hindi is used)."
      ]
    },
    {
      title: "6. Submission Logistics",
      text: [
        "Submission is only accepted through the official submission portal/form — emailed or messaged submissions will not be considered.",
        "File naming convention: TeamID_TeamName_ProblemNumber for both PPT and video files.",
        "Late submissions: not accepted under any circumstances, including technical issues on the participant's end. Submit at least a few hours before deadline to allow for upload issues."
      ]
    },
    {
      title: "7. Evaluation Criteria (Round 1)",
      text: [
        "Teams are scored out of 100:",
        "Clarity of problem understanding - 20",
        "Originality and feasibility of proposed solution - 25",
        "Technical soundness of the approach described - 20",
        "Realism of 24-hour scope (is it actually buildable in the time given) - 15",
        "Quality of communication (PPT clarity + video clarity) - 10",
        "Team's honesty about risks/unknowns - 10",
        "Solutions that are technically impressive but not buildable in 24 hours will be scored down under \"Realism of Scope\" — teams are encouraged to under-promise on Round 1 and over-deliver at the Nagpur build round, not the reverse."
      ]
    },
    {
      title: "8. Disqualification Conditions",
      text: [
        "A team will be disqualified from Round 1, with no appeal, if:",
        "The video exceeds 3:00 and the team attempts to disguise this (e.g., sped-up footage, misleading file metadata)",
        "Any plagiarized content is used without credit — this includes reused stock pitch decks, AI-generated slide content presented as original team analysis without disclosure, or copied problem-solution framing from another public source",
        "A team member is found registered on more than one team",
        "The submitted idea is substantially identical to a submission from a previous, unrelated hackathon by the same team without meaningful new work (recycled submissions are allowed only if disclosed and substantially extended)",
        "Any submission contains offensive, discriminatory, or inappropriate content"
      ]
    },
    {
      title: "9. Use of AI Tools",
      text: [
        "Teams may use AI tools (ChatGPT, Claude, etc.) to help draft, structure, or refine their pitch — this is not penalized.",
        "However, teams must be able to explain and defend every part of their submission in later rounds. If a team cannot explain their own architecture or reasoning when asked in Round 2 or the Bangkok final, judges may treat this as a red flag for authenticity of the work."
      ]
    },
    {
      title: "10. What Happens After Round 1",
      text: [
        "Shortlisted teams will be notified via the registered team email/contact within the announced timeline.",
        "Shortlisted teams proceed to the 24-hour onsite build round in Nagpur.",
        "Feedback is not provided individually for non-shortlisted teams unless specifically requested; judges' scoring notes are final and not open for debate or re-evaluation.",
        "The organizing committee reserves the right to adjust the number of shortlisted teams based on submission quality and slot availability."
      ]
    },
    {
      title: "11. General Conduct",
      text: [
        "All communication with the organizing team must go through official channels (announced Slack/Discord/WhatsApp/email — specify at registration).",
        "Any attempt to contact judges directly to influence scoring will result in disqualification of the entire team.",
        "The organizing committee's decisions at every stage are final.",
        "Rules are subject to minor clarification/updates before the submission deadline; any changes will be communicated to all registered teams through official channels."
      ]
    },
    {
      title: "12. Quick Checklist Before You Submit",
      text: [
        "Team has 4–5 registered members, locked (Y/N)",
        "One problem statement selected (Y/N)",
        "PPT follows the 7 required slide titles, in order (Y/N)",
        "Video is under 3:00, includes a visual of the concept (not just talking heads) (Y/N)",
        "Files named correctly: TeamID_TeamName_ProblemNumber (Y/N)"
      ]
    }
  ];

  return (
    <PageFrame kicker="09 / execution guardrails" title="Rules & Regulations." intro="Round 1 — Online Screening Round | PPT + Video Submission. Dated: 15th Aug 2026. The boundaries of the build.">
      <div className="mt-14 flex flex-col gap-8">
        {rules.map((rule, index) => (
          <div key={rule.title} className="glow-card reveal delay-1 rounded-sm p-6 sm:p-10 flex flex-col">
            <div className="flex items-center gap-3">
              <span className="font-mono-custom text-xs sm:text-sm font-bold text-[#ff7c4c]">0{index + 1}</span>
            </div>
            <h3 className="mt-4 font-display text-2xl sm:text-3xl font-bold text-white">{rule.title.replace(/^\\d+\\.\\s*/, '')}</h3>
            <ul className="mt-6 space-y-4 text-base sm:text-lg leading-relaxed text-white">
              {rule.text.map((line, i) => (
                <li key={i} className="flex gap-3">
                  <span className="text-[#b990ff] font-bold mt-1">›</span>
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </PageFrame>
  );
}

function ScrollToTop() {
  const [pathname] = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function Router() {
  return (
    <ErrorBoundary resetKey={useLocation()[0]}>
      <ScrollToTop />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/un-invented" component={UninventedPage} />
        <Route path="/challenges" component={ChallengesPage} />
        <Route path="/git-init"><StagePage stage="init" /></Route>
        <Route path="/git-commit"><StagePage stage="commit" /></Route>
        <Route path="/git-push"><StagePage stage="push" /></Route>
        <Route path="/lost-commit" component={LostCommitPage} />
        <Route path="/journey" component={JourneyPage} />
        <Route path="/about-us" component={AboutUsPage} />
        <Route path="/faq" component={FaqPage} />
        <Route path="/prizes" component={PrizesPage} />
        <Route path="/rules" component={RulesPage} />
        <Route path="/register" component={RegisterPage} />
        <Route component={NotFound} />
      </Switch>
    </ErrorBoundary>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <TreasureProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
            <Router />
          </WouterRouter>
        </TreasureProvider>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;