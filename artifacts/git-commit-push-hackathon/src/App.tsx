import { type FormEvent, type ReactNode, useEffect, useMemo, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import {
  ArrowRight, Check, ChevronRight, Clock3, Code2, GitBranch, Globe2, MapPin,
  Menu, Network, Send, ShieldCheck, Sparkles, Terminal, TrainFront, Trophy,
  Users, X,
} from 'lucide-react';
import { Link, Route, Switch, Router as WouterRouter, useLocation } from 'wouter';
import NotFound from '@/pages/not-found';

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
};

const rounds: Round[] = [
  {
    id: 'init',
    command: 'git init',
    title: 'The Qualifier',
    place: 'Online · everywhere',
    date: '01 — 18 OCT 2026',
    description: 'Open your first branch with a sharp, practical build. Submit remotely, ship from anywhere.',
    accent: '#b990ff',
    icon: Terminal,
  },
  {
    id: 'commit',
    command: 'git commit',
    title: 'The Offline Hack',
    place: 'Nagpur · in person',
    date: '31 OCT — 01 NOV 2026',
    description: 'Your qualifier branch gets checked out in Nagpur. One night, one room, one commit that matters.',
    accent: '#ff7c4c',
    icon: GitBranch,
  },
  {
    id: 'push',
    command: 'git push',
    title: 'The Bangkok Finale',
    place: 'Bangkok · the finish line',
    date: '07 — 10 NOV 2026',
    description: 'The final merge happens under Bangkok lights. Build live, take the city, leave with the story.',
    accent: '#ff4f9a',
    icon: Send,
  },
];

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
        GIT COMMIT<br /><span className="text-[#ff7c4c]">AND PUSH</span>
      </span>
    </Link>
  );
}

function Navbar() {
  const [location] = useLocation();
  const [open, setOpen] = useState(false);
  const links = [
    { href: '/journey', label: 'Journey' },
    { href: '/timeline', label: 'Timeline' },
    { href: '/prizes', label: 'Prizes' },
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
    <svg viewBox="0 0 900 220" className="absolute bottom-0 left-0 w-full opacity-50" aria-hidden="true">
      <path d="M0 206h900v14H0zM55 206v-35h46v35M68 171l10-40 10 40M138 206v-57h63v57M152 149l18-47 18 47M269 206v-48h88v48M291 158l22-80 22 80M417 206v-36h42v36M435 170l10-48 10 48M540 206v-64h100v64M561 142l29-70 29 70M704 206v-47h75v47M721 159l21-68 21 68" fill="none" stroke="#b990ff" strokeWidth="2" />
      <path d="M0 206h900" stroke="#ff7c4c" strokeWidth="2" />
    </svg>
  );
}

function TerminalWindow() {
  const fullText = 'booting launch-night sequence...';
  const [typed, setTyped] = useState('');
  useEffect(() => {
    let index = 0;
    const timer = window.setInterval(() => {
      setTyped(fullText.slice(0, index + 1));
      index += 1;
      if (index >= fullText.length) window.clearInterval(timer);
    }, 55);
    return () => window.clearInterval(timer);
  }, []);
  return (
    <div className="terminal-window scanline relative rounded-sm" data-testid="terminal-window">
      <div className="terminal-top flex items-center justify-between px-4 py-3">
        <div className="flex gap-1.5"><span className="terminal-dot bg-[#ff4f9a]" /><span className="terminal-dot bg-[#ff7c4c]" /><span className="terminal-dot bg-[#b990ff]" /></div>
        <span className="font-mono-custom text-[9px] uppercase tracking-[.2em] text-[#687386]">launch.sh</span>
      </div>
      <div className="space-y-2 p-5 font-mono-custom text-[11px] leading-relaxed text-[#aeb8c6] sm:p-6 sm:text-xs">
        <div><span className="text-[#ff7c4c]">guest@gcp</span><span className="text-[#687386]">:</span><span className="text-[#b990ff]">~/launch</span><span className="text-[#f5eedf]">$</span> {typed}<span className="cursor-blink ml-0.5 inline-block h-3 align-middle" /></div>
        <div className="text-[#7ee7d6]">✓ signal acquired: 03 cities / 01 branch</div>
        <div className="text-[#ff4f9a]">→ destination found: BANGKOK</div>
        <div className="pt-2 text-[#687386]"># no spectators. only contributors.</div>
      </div>
    </div>
  );
}

function Footer() {
  return (
    <footer className="content-layer border-t border-[#f5eedf]/10 bg-[#0a0d12]/70">
      <div className="mx-auto flex max-w-[1240px] flex-col justify-between gap-6 px-5 py-8 sm:px-8 md:flex-row md:items-center">
        <div>
          <p className="font-display text-lg font-bold text-[#f5eedf]">git commit and push</p>
          <p className="mt-1 font-mono-custom text-[10px] uppercase tracking-[.12em] text-[#687386]">A launch-night hackathon by people who ship.</p>
        </div>
        <div className="flex items-center gap-5 font-mono-custom text-[10px] text-[#8f98a8]">
          <span className="flex items-center gap-2"><span className="blink h-1.5 w-1.5 rounded-full bg-[#7ee7d6]" /> system online</span>
          <span>© 2026 GCP</span>
        </div>
      </div>
    </footer>
  );
}

function PageFrame({ kicker, title, intro, children }: { kicker: string; title: string; intro: string; children: ReactNode }) {
  return (
    <div className="site-shell">
      <Navbar />
      <main className="content-layer">
        <section className="mx-auto max-w-[1240px] px-5 pb-12 pt-20 sm:px-8 sm:pb-20 sm:pt-28">
          <div className="max-w-3xl reveal">
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
    <Link href="/journey" className={`group glow-card reveal delay-${index + 1} relative block overflow-hidden rounded-sm p-5 sm:p-6`} data-testid={`card-round-${round.id}`}>
      <div className="mb-9 flex items-start justify-between">
        <span className="font-mono-custom text-[10px] uppercase tracking-[.16em]" style={{ color: round.accent }}>0{index + 1} / branch</span>
        <Icon size={19} style={{ color: round.accent }} />
      </div>
      <p className="font-mono-custom text-xl font-medium tracking-tight text-[#f5eedf]">{round.command}</p>
      <h3 className="mt-2 font-display text-2xl font-bold text-[#f5eedf]">{round.title}</h3>
      <div className="mt-4 flex items-center gap-2 text-[11px] text-[#8f98a8]"><MapPin size={13} style={{ color: round.accent }} />{round.place}</div>
      <p className="mt-4 text-sm leading-6 text-[#9198a7]">{round.description}</p>
      <span className="mt-6 inline-flex items-center gap-2 font-mono-custom text-[10px] uppercase tracking-[.12em] text-[#f5eedf] group-hover:text-[#ff7c4c]">inspect branch <ChevronRight size={14} /></span>
    </Link>
  );
}

function Home() {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  return (
    <div className="site-shell">
      <Navbar />
      <main className="content-layer">
        <section className="relative isolate overflow-hidden px-5 pb-20 pt-14 sm:px-8 sm:pb-28 sm:pt-24">
          <div className="mx-auto grid max-w-[1240px] items-end gap-12 lg:grid-cols-[1.1fr_.65fr]">
            <div className="reveal">
              <div className="mb-6 flex items-center gap-3 font-mono-custom text-[10px] uppercase tracking-[.18em] text-[#7ee7d6]">
                <span className="blink h-2 w-2 rounded-full bg-[#7ee7d6]" /> season 01 · now compiling
              </div>
              <div onMouseMove={(event) => { const rect = event.currentTarget.getBoundingClientRect(); setTilt({ x: (event.clientY - rect.top - rect.height / 2) / 36, y: (event.clientX - rect.left - rect.width / 2) / -36 }); }} onMouseLeave={() => setTilt({ x: 0, y: 0 })}>
                <h1 className="font-display text-[clamp(3.9rem,12vw,10rem)] font-extrabold leading-[.78] tracking-[-.1em] text-[#f5eedf]" style={{ transform: `perspective(700px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`, transition: 'transform .25s ease-out' }}>
                  git<br /><span className="text-[#ff7c4c]">commit</span><br /><span className="text-[#b990ff]">and push</span>
                </h1>
              </div>
              <p className="mt-8 max-w-lg text-lg leading-8 text-[#a8aebb] sm:text-xl">A three-round hackathon for ambitious developers who want their next commit to travel further.</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/register" className="btn-primary" data-testid="link-hero-register">Initialize repository <ArrowRight size={16} /></Link>
                <Link href="/journey" className="btn-secondary" data-testid="link-hero-journey">View the route <TrainFront size={16} /></Link>
              </div>
            </div>
            <div className="reveal delay-2">
              <TerminalWindow />
              <div className="mt-4 flex items-center justify-between font-mono-custom text-[10px] uppercase tracking-[.14em] text-[#687386]">
                <span>Bangkok / Nagpur / online</span><span className="text-[#ff7c4c]">v.01.26</span>
              </div>
            </div>
          </div>
          <div className="pointer-events-none absolute -bottom-20 left-1/2 -z-10 h-80 w-[720px] -translate-x-1/2 rounded-full bg-[#b990ff]/10 blur-[100px]" />
          <TempleSilhouette />
        </section>

        <div className="overflow-hidden border-y border-[#f5eedf]/10 bg-[#ff7c4c]/[.04] py-3">
          <div className="ticker flex w-max items-center gap-8 font-mono-custom text-[10px] uppercase tracking-[.2em] text-[#8f98a8]">
            {Array.from({ length: 2 }).map((_, copy) => <div className="flex items-center gap-8" key={copy}><span>01 init online</span><span className="text-[#ff7c4c]">+</span><span>02 commit Nagpur</span><span className="text-[#b990ff]">+</span><span>03 push Bangkok</span><span className="text-[#ff4f9a]">+</span><span>ship something worth remembering</span></div>)}
          </div>
        </div>

        <section className="mx-auto max-w-[1240px] px-5 py-20 sm:px-8 sm:py-28">
          <div className="mb-9 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div className="reveal"><p className="eyebrow mb-4">the branching journey</p><h2 className="font-display text-4xl font-bold tracking-[-.04em] text-[#f5eedf] sm:text-5xl">One repo.<br /><span className="text-[#b990ff]">Three places.</span></h2></div>
            <Link href="/journey" className="font-mono-custom text-[11px] uppercase tracking-[.12em] text-[#ff7c4c] hover:text-[#f5eedf]" data-testid="link-home-journey">read the full protocol <ArrowRight size={14} className="ml-2 inline" /></Link>
          </div>
          <div className="grid gap-4 lg:grid-cols-3">{rounds.map((round, index) => <RoundPreview key={round.id} round={round} index={index} />)}</div>
        </section>

        <section className="mx-auto max-w-[1240px] px-5 pb-24 sm:px-8 sm:pb-36">
          <div className="relative overflow-hidden rounded-sm border border-[#ff4f9a]/35 bg-[#241527] p-7 sm:p-12">
            <div className="pointer-events-none absolute -right-24 -top-32 h-80 w-80 rounded-full bg-[#ff4f9a]/20 blur-[80px]" />
            <div className="relative grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
              <div><p className="eyebrow mb-5 text-[#ff4f9a]">the pull request</p><h2 className="max-w-2xl font-display text-4xl font-bold tracking-[-.05em] text-[#f5eedf] sm:text-6xl">Your winning branch<br /><span className="text-[#ff7c4c]">ends in Bangkok.</span></h2><p className="mt-5 max-w-xl text-[#c6b5c5]">Four days. One city that never stops moving. A grand prize designed to turn a good build into a great story.</p></div>
              <div className="rounded-sm border border-[#ff4f9a]/35 bg-[#0d1117]/55 p-5 sm:min-w-[250px]"><p className="font-mono-custom text-[10px] uppercase tracking-[.15em] text-[#8f98a8]">finale launch in</p><div className="mt-3"><Countdown /></div><Link href="/prizes" className="mt-5 inline-flex items-center gap-2 font-mono-custom text-[10px] uppercase tracking-[.12em] text-[#ff7c4c]" data-testid="link-home-prizes">see the payload <ArrowRight size={14} /></Link></div>
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
  const active = rounds.find((round) => round.id === selected) ?? rounds[1];
  return (
    <PageFrame kicker="01 / route map" title="Follow the branch." intro="Not a conference. Not a weekend glued to a schedule. This is one connected GitGraph across three cities, with every round pushing the last one further.">
      <div className="mt-14 grid gap-10 lg:grid-cols-[1.35fr_.65fr]">
        <div className="glow-card thai-corner relative overflow-hidden rounded-sm p-4 sm:p-8">
          <div className="mb-6 flex items-center justify-between"><span className="font-mono-custom text-[10px] uppercase tracking-[.16em] text-[#687386]">origin/main → finale</span><span className="flex items-center gap-2 font-mono-custom text-[10px] text-[#7ee7d6]"><span className="blink h-1.5 w-1.5 rounded-full bg-[#7ee7d6]" /> live route</span></div>
          <svg viewBox="0 0 800 400" className="h-auto w-full" role="img" aria-label="A neon transit route connecting Online, Nagpur, and Bangkok">
            <defs><filter id="softGlow"><feGaussianBlur stdDeviation="4" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter></defs>
            <path d="M90 300 C 180 240, 218 100, 370 128 S 510 330, 700 84" fill="none" stroke="#293142" strokeWidth="9" />
            <path d="M90 300 C 180 240, 218 100, 370 128 S 510 330, 700 84" fill="none" stroke="#b990ff" strokeWidth="2" className="route-line" filter="url(#softGlow)" />
            <path d="M370 128 S 510 330, 700 84" fill="none" stroke="#ff7c4c" strokeWidth="3" className={selected === 'commit' ? 'route-line' : ''} opacity={selected === 'init' ? .35 : 1} />
            {[{ x: 90, y: 300, id: 'init', label: 'ONLINE' }, { x: 370, y: 128, id: 'commit', label: 'NAGPUR' }, { x: 700, y: 84, id: 'push', label: 'BANGKOK' }].map((node) => <g key={node.id} onClick={() => setSelected(node.id)} className="cursor-pointer"><circle cx={node.x} cy={node.y} r={selected === node.id ? 23 : 15} fill="#0d1117" stroke={rounds.find((round) => round.id === node.id)?.accent} strokeWidth="2" /><circle cx={node.x} cy={node.y} r="5" fill={rounds.find((round) => round.id === node.id)?.accent} filter="url(#softGlow)" /><text x={node.x} y={node.y + 45} fill="#f5eedf" textAnchor="middle" fontFamily="IBM Plex Mono" fontSize="11" letterSpacing="2">{node.label}</text></g>)}
            <path d="M90 300l-30 30M700 84l30-25" stroke="#ff4f9a" strokeWidth="1" strokeDasharray="2 5" />
          </svg>
          <p className="mt-4 text-center font-mono-custom text-[10px] uppercase tracking-[.15em] text-[#687386]">tap a node to inspect the release notes</p>
        </div>
        <div className="reveal delay-2">
          <div className="mb-4 flex gap-2">{rounds.map((round, index) => <button key={round.id} className={`h-1.5 flex-1 transition-opacity ${selected === round.id ? 'opacity-100' : 'opacity-25'}`} style={{ background: round.accent }} onClick={() => setSelected(round.id)} aria-label={`Show round ${index + 1}`} data-testid={`button-journey-${round.id}`} />)}</div>
          <div className="glow-card min-h-[320px] rounded-sm p-6 sm:p-8" style={{ borderColor: `${active.accent}55` }}>
            <div className="flex items-start justify-between"><span className="font-mono-custom text-xs" style={{ color: active.accent }}>{active.command}</span><span className="font-mono-custom text-[10px] text-[#687386]">0{rounds.findIndex((round) => round.id === active.id) + 1} / 03</span></div>
            <h2 className="mt-12 font-display text-3xl font-bold text-[#f5eedf]">{active.title}</h2>
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

function TimelinePage() {
  const milestones = [
    { date: '12 SEP 2026', label: 'repository opens', title: 'Registration goes live', text: 'Pick your team, sharpen your idea, and initialize your branch before the first gate closes.', icon: Code2, color: '#b990ff', rules: 'Teams of 1–4 · open worldwide' },
    { date: '18 OCT 2026 · 23:59 IST', label: 'first commit', title: 'Online qualifier closes', text: 'Push a working prototype and a clear README. The top 24 branches advance to Nagpur.', icon: GitBranch, color: '#7ee7d6', rules: 'Public GitHub repository · one submission' },
    { date: '31 OCT — 01 NOV 2026', label: 'offline merge', title: 'Nagpur overnight hack', text: 'A focused 24-hour build sprint with mentors, a physical room, and a new constraint to solve.', icon: Clock3, color: '#ff7c4c', rules: 'Top 24 teams · Nagpur, Maharashtra' },
    { date: '07 — 10 NOV 2026', label: 'final push', title: 'Bangkok finale', text: 'Eight finalists cross the border for the final build, city challenges, and the grand prize reveal.', icon: Globe2, color: '#ff4f9a', rules: 'Top 8 teams · Bangkok, Thailand' },
  ];
  return (
    <PageFrame kicker="02 / release schedule" title="Ship by the deadline." intro="Four gates. No mystery. Keep this route pinned while you move from a blank repo to a Bangkok-bound pull request.">
      <div className="relative mt-14 max-w-4xl">
        <div className="absolute bottom-10 left-[19px] top-3 w-px bg-gradient-to-b from-[#b990ff] via-[#ff7c4c] to-[#ff4f9a] opacity-50 sm:left-[31px]" />
        <div className="space-y-10">
          {milestones.map((milestone, index) => { const Icon = milestone.icon; return <article key={milestone.title} className={`relative grid gap-6 pl-12 reveal delay-${Math.min(index + 1, 4)} sm:grid-cols-[64px_1fr] sm:pl-0`} data-testid={`timeline-item-${index}`}><div className="absolute left-0 top-0 grid h-10 w-10 place-items-center rounded-full border bg-[#0d1117] sm:relative sm:h-16 sm:w-16" style={{ borderColor: `${milestone.color}99`, color: milestone.color }}><Icon size={19} /></div><div className="glow-card rounded-sm p-5 sm:p-7"><div className="flex flex-wrap items-center justify-between gap-3"><span className="font-mono-custom text-[10px] uppercase tracking-[.14em]" style={{ color: milestone.color }}>{milestone.label}</span><span className="font-mono-custom text-[10px] text-[#687386]">{milestone.date}</span></div><h2 className="mt-4 font-display text-2xl font-bold text-[#f5eedf] sm:text-3xl">{milestone.title}</h2><p className="mt-3 max-w-2xl text-sm leading-7 text-[#a1a6b2]">{milestone.text}</p><div className="mt-5 flex items-center gap-2 font-mono-custom text-[10px] uppercase tracking-[.1em] text-[#687386]"><ShieldCheck size={13} style={{ color: milestone.color }} /> {milestone.rules}</div></div></article>; })}
        </div>
      </div>
      <div className="mt-14 flex flex-col items-start justify-between gap-5 border-y border-[#f5eedf]/10 py-6 sm:flex-row sm:items-center"><div><p className="eyebrow text-[#7ee7d6]">the next gate</p><p className="mt-2 text-sm text-[#a1a6b2]">Bangkok finale starts in</p></div><Countdown compact /><Link href="/register" className="btn-primary min-h-[40px]" data-testid="link-timeline-register">Join the queue <ArrowRight size={14} /></Link></div>
    </PageFrame>
  );
}

type Registration = { name: string; email: string; github: string; teamSize: string };

function RegisterPage() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<Registration>({ name: '', email: '', github: '', teamSize: '2' });
  const [submitted, setSubmitted] = useState(false);
  useEffect(() => { const saved = window.localStorage.getItem('gcp-registration'); if (saved) setSubmitted(true); }, []);
  const update = (key: keyof Registration, value: string) => setForm((current) => ({ ...current, [key]: value }));
  const next = () => {
    if (step === 1 && form.name.trim() && form.email.includes('@')) setStep(2);
    if (step === 2 && form.github.trim()) setStep(3);
  };
  const submit = (event: FormEvent) => {
    event.preventDefault();
    window.localStorage.setItem('gcp-registration', JSON.stringify({ ...form, submittedAt: new Date().toISOString() }));
    setSubmitted(true);
  };
  if (submitted) return <PageFrame kicker="03 / repository initialized" title="You are in the queue." intro="Your branch has been registered locally. Watch your inbox for the next signal and start thinking about what you want to ship."><div className="mt-14 max-w-2xl glow-card thai-corner rounded-sm p-7 sm:p-10"><div className="grid h-12 w-12 place-items-center rounded-full bg-[#7ee7d6]/10 text-[#7ee7d6]"><Check size={24} /></div><p className="mt-8 font-mono-custom text-xs text-[#7ee7d6]">$ git status — registered</p><h2 className="mt-3 font-display text-3xl font-bold text-[#f5eedf]">The first commit is yours.</h2><p className="mt-4 text-sm leading-7 text-[#a1a6b2]">We saved your registration on this device. Your next move: make a public repository, find your crew, and keep an eye on the route.</p><div className="mt-8 flex flex-col gap-3 sm:flex-row"><Link href="/journey" className="btn-primary" data-testid="link-success-journey">Study the route <ArrowRight size={15} /></Link><button className="btn-secondary" onClick={() => { window.localStorage.removeItem('gcp-registration'); setSubmitted(false); setStep(1); }} data-testid="button-reset-registration">Register another team</button></div></div></PageFrame>;
  const inputClass = "mt-2 w-full rounded-sm border border-[#f5eedf]/15 bg-[#0d1117] px-4 py-3 text-sm text-[#f5eedf] outline-none transition placeholder:text-[#687386] focus:border-[#b990ff] focus:ring-2 focus:ring-[#b990ff]/15";
  return (
    <PageFrame kicker="03 / initialize repository" title="Put your name on the branch." intro="Registration takes under two minutes. No account creation, no dark patterns — just the details we need to route you to the right gate.">
      <div className="mt-14 grid gap-10 lg:grid-cols-[1fr_.7fr]">
        <form onSubmit={submit} className="glow-card thai-corner rounded-sm p-6 sm:p-9" data-testid="form-registration">
          <div className="mb-8 flex items-center gap-2">{[1, 2, 3].map((item) => <div key={item} className={`h-1.5 flex-1 ${item <= step ? 'bg-[#ff7c4c]' : 'bg-[#f5eedf]/10'}`} />)}</div>
          {step === 1 && <div className="reveal"><p className="eyebrow">01 / author identity</p><label className="mt-8 block font-mono-custom text-xs text-[#d7cfdb]" htmlFor="name">Your name<input id="name" className={inputClass} value={form.name} onChange={(event) => update('name', event.target.value)} placeholder="e.g. Narin Chai" required data-testid="input-name" /></label><label className="mt-5 block font-mono-custom text-xs text-[#d7cfdb]" htmlFor="email">Email for the signal<input id="email" type="email" className={inputClass} value={form.email} onChange={(event) => update('email', event.target.value)} placeholder="you@domain.dev" required data-testid="input-email" /></label><button type="button" className="btn-primary mt-8 w-full" onClick={next} data-testid="button-register-next-1">Continue to profile <ArrowRight size={15} /></button></div>}
          {step === 2 && <div className="reveal"><p className="eyebrow">02 / show your work</p><label className="mt-8 block font-mono-custom text-xs text-[#d7cfdb]" htmlFor="github">GitHub profile<input id="github" className={inputClass} value={form.github} onChange={(event) => update('github', event.target.value)} placeholder="github.com/your-handle" required data-testid="input-github" /></label><p className="mt-3 text-xs leading-5 text-[#687386]">A profile link is enough. We will not ask for permissions or access your repositories.</p><div className="mt-8 flex gap-3"><button type="button" className="btn-secondary flex-1" onClick={() => setStep(1)} data-testid="button-register-back-2">Back</button><button type="button" className="btn-primary flex-1" onClick={next} data-testid="button-register-next-2">Choose team <ArrowRight size={15} /></button></div></div>}
          {step === 3 && <div className="reveal"><p className="eyebrow">03 / branch size</p><label className="mt-8 block font-mono-custom text-xs text-[#d7cfdb]" htmlFor="teamSize">How many on your branch<select id="teamSize" className={inputClass} value={form.teamSize} onChange={(event) => update('teamSize', event.target.value)} data-testid="select-team-size"><option value="1">Just me</option><option value="2">2 contributors</option><option value="3">3 contributors</option><option value="4">4 contributors</option></select></label><div className="mt-6 border border-[#7ee7d6]/20 bg-[#7ee7d6]/[.04] p-4 text-xs leading-5 text-[#a1bdb9]"><Users size={15} className="mb-2 text-[#7ee7d6]" /> Teams can be finalized after registration. Solo branches are welcome.</div><div className="mt-8 flex gap-3"><button type="button" className="btn-secondary flex-1" onClick={() => setStep(2)} data-testid="button-register-back-3">Back</button><button type="submit" className="btn-primary flex-1" data-testid="button-submit-registration">Initialize <Check size={15} /></button></div></div>}
        </form>
        <div className="space-y-5">
          <div className="reveal delay-2 border-l-2 border-[#ff7c4c] pl-5"><p className="font-mono-custom text-xs text-[#ff7c4c]">why register early?</p><p className="mt-3 text-sm leading-6 text-[#a1a6b2]">Because the best teams start their README before they start their pitch.</p></div>
          <div className="glow-card p-6"><Terminal size={18} className="text-[#b990ff]" /><p className="mt-5 font-mono-custom text-xs leading-6 text-[#a1a6b2]"><span className="text-[#7ee7d6]">const</span> eligibility = <span className="text-[#ff7c4c]">"ambition"</span>;<br /><span className="text-[#7ee7d6]">return</span> eligibility === <span className="text-[#ff7c4c]">"enough"</span>;</p></div>
        </div>
      </div>
    </PageFrame>
  );
}

function PrizeVisual() {
  return (
    <div className="prize-sheen relative min-h-[340px] overflow-hidden rounded-sm border border-[#ff4f9a]/45 bg-gradient-to-br from-[#261c42] via-[#302052] to-[#0e202a] p-6 sm:min-h-[450px] sm:p-9">
      <div className="absolute right-[-10%] top-[-12%] h-64 w-64 rounded-full border border-[#ff7c4c]/30 bg-[#ff7c4c]/10 blur-[1px]" /><div className="absolute right-[13%] top-[13%] h-36 w-36 rounded-full border border-[#ff7c4c]/40 bg-[#ff7c4c]/15" />
      <svg viewBox="0 0 700 260" className="absolute bottom-0 left-0 w-full opacity-80" aria-hidden="true"><path d="M0 230L50 190l42 20 48-73 32 55 65-30 46-55 44 67 54-27 62-72 38 89 71-38 44 39 64-52 49 38 54-41v100H0z" fill="#101c2a" /><path d="M0 230L50 190l42 20 48-73 32 55 65-30 46-55 44 67 54-27 62-72 38 89 71-38 44 39 64-52 49 38 54-41" fill="none" stroke="#7ee7d6" strokeWidth="2" /></svg>
      <div className="relative flex h-full min-h-[280px] flex-col justify-between"><div className="flex items-center justify-between"><span className="font-mono-custom text-[10px] uppercase tracking-[.16em] text-[#7ee7d6]">payload / 001</span><Trophy size={21} className="text-[#ff7c4c]" /></div><div><p className="eyebrow text-[#ff4f9a]">the grand prize</p><h2 className="mt-4 max-w-md font-display text-5xl font-bold leading-[.9] tracking-[-.06em] text-[#f5eedf] sm:text-7xl">Bangkok<br /><span className="text-[#ff7c4c]">unlocked.</span></h2><p className="mt-5 max-w-sm text-sm leading-6 text-[#c4b8c9]">A four-day finale trip for the winning branch — city lights, river air, and the kind of debrief that lasts forever.</p></div></div>
    </div>
  );
}

function PrizesPage() {
  return (
    <PageFrame kicker="04 / merge reward" title="The payload is a passport stamp." intro="The grand prize is not another gadget box. It is a live city, a full team trip, and a finale worth building toward.">
      <div className="mt-14 grid gap-8 lg:grid-cols-[1.25fr_.75fr] lg:items-stretch"><PrizeVisual /><div className="glow-card flex flex-col justify-between rounded-sm p-7 sm:p-9"><div><p className="eyebrow text-[#ff7c4c]">winning branch includes</p><ul className="mt-7 space-y-5">{['Four days in Bangkok for the full winning team', 'Hotel, flights, and a city-led finale itinerary', 'A private river cruise through the lights', 'The GCP trophy, custom merch, and bragging rights'].map((item) => <li key={item} className="flex gap-3 text-sm leading-6 text-[#b6bac5]"><Check size={17} className="mt-1 shrink-0 text-[#7ee7d6]" />{item}</li>)}</ul></div><div className="mt-10 border-t border-[#f5eedf]/10 pt-5"><p className="font-mono-custom text-[10px] uppercase tracking-[.12em] text-[#687386]">estimated branch value</p><p className="mt-2 font-display text-3xl font-bold text-[#f5eedf]">priceless<span className="text-[#ff7c4c]">.</span></p></div></div></div>
      <div className="mt-12 grid gap-4 sm:grid-cols-3">{[{ icon: MapPin, title: 'Night market brief', text: 'Solve a city prompt as the stalls light up around you.' }, { icon: TrainFront, title: 'Riverline pass', text: 'A moving debrief across the Chao Phraya at blue hour.' }, { icon: Sparkles, title: 'Final merge', text: 'Demo your build where the skyline becomes part of the stage.' }].map((item, index) => { const Icon = item.icon; return <div key={item.title} className={`glow-card reveal delay-${index + 1} rounded-sm p-6`}><Icon size={19} className="text-[#ff7c4c]" /><h3 className="mt-6 font-display text-xl font-bold text-[#f5eedf]">{item.title}</h3><p className="mt-2 text-sm leading-6 text-[#8f98a8]">{item.text}</p></div>; })}</div>
      <div className="mt-14 flex flex-col items-start justify-between gap-5 border-t border-[#f5eedf]/10 pt-7 sm:flex-row sm:items-center"><div><p className="font-display text-2xl font-bold text-[#f5eedf]">Ready to make the trip?</p><p className="mt-1 text-sm text-[#8f98a8]">Start with a single line in a new repository.</p></div><Link href="/register" className="btn-primary" data-testid="link-prizes-register">Initialize your branch <ArrowRight size={15} /></Link></div>
    </PageFrame>
  );
}

function Router() {
  return (
    <ErrorBoundary resetKey={useLocation()[0]}>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/journey" component={JourneyPage} />
        <Route path="/timeline" component={TimelinePage} />
        <Route path="/register" component={RegisterPage} />
        <Route path="/prizes" component={PrizesPage} />
        <Route component={NotFound} />
      </Switch>
    </ErrorBoundary>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;