'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowDown, ArrowLeft, ArrowRight, Heart, Music2, Pause, Play, Volume2, VolumeX, X } from 'lucide-react';
import confetti from 'canvas-confetti';
import { birthdayConfig as config } from '@/config/birthday';

const sectionNames = ['A little surprise', 'A letter for you', 'Our little moments', 'Our universe', 'Make a wish', 'Always, Buggu'];
const photoTurns = [-3, 2.5, -2, 2.2, -2.5, 3];

function MissingPhoto({ number }: { number: number }) {
  return <div className="photo-missing"><span className="photo-glow">♡</span><span>your photo goes here</span><small>photo{number}.jpg</small></div>;
}

export default function Home() {
  const [active, setActive] = useState(0);
  const [opened, setOpened] = useState(false);
  const [letterChars, setLetterChars] = useState(0);
  const [candlesOut, setCandlesOut] = useState(false);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [musicOn, setMusicOn] = useState(false);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(0.55);
  const audioRef = useRef<HTMLAudioElement>(null);
  const touchStart = useRef<number | null>(null);
  const sections = useRef<Array<HTMLElement | null>>([]);

  const goTo = useCallback((index: number) => {
    const next = Math.min(Math.max(index, 0), 5);
    sections.current[next]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setActive(next);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActive(Number((entry.target as HTMLElement).dataset.index));
      });
    }, { threshold: 0.55 });
    sections.current.forEach((section) => section && observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!opened || letterChars >= config.letter.length) return;
    const timer = window.setInterval(() => setLetterChars((count) => Math.min(count + 3, config.letter.length)), 18);
    return () => window.clearInterval(timer);
  }, [opened, letterChars]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = muted ? 0 : volume;
    if (musicOn) audio.play().catch(() => setMusicOn(false)); else audio.pause();
  }, [musicOn, muted, volume]);

  const movePhoto = useCallback((direction: number) => {
    setLightbox((current) => current === null ? null : (current + direction + config.photos.length) % config.photos.length);
  }, []);
  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setLightbox(null);
      if (event.key === 'ArrowRight') movePhoto(1);
      if (event.key === 'ArrowLeft') movePhoto(-1);
    };
    window.addEventListener('keydown', onKey);
    document.body.classList.add('modal-open');
    return () => { window.removeEventListener('keydown', onKey); document.body.classList.remove('modal-open'); };
  }, [lightbox, movePhoto]);

  const birthdayBurst = () => {
    void confetti({ particleCount: 105, spread: 82, startVelocity: 36, origin: { y: 0.65 }, colors: ['#e50935', '#ff4969', '#fff1f3', '#a30025'] });
    window.setTimeout(() => void confetti({ particleCount: 45, spread: 110, startVelocity: 23, origin: { y: 0.55, x: 0.2 }, colors: ['#e50935', '#ff4969', '#fff1f3'] }), 180);
    setCandlesOut(true);
  };

  return <main>
    <audio ref={audioRef} src="/music/romantic.mp3" loop preload="none" />
    <div className="ambient" aria-hidden="true"><div className="ambient-orb"/><div className="grain"/><div className="stars">{Array.from({ length: 24 }, (_, i) => <i key={i} style={{ left: `${(i * 43 + 7) % 100}%`, top: `${(i * 67 + 11) % 100}%`, animationDelay: `${(i % 8) * -0.7}s` }} />)}</div></div>

    <aside className="side-rail" aria-label="Experience progress">
      <span className="rail-brand"><Heart size={14} fill="currentColor"/> PLU</span>
      <div className="rail-dots">{sectionNames.map((label, index) => <button key={label} className={active === index ? 'current' : ''} onClick={() => goTo(index)} aria-label={`Go to ${label}`} title={label}><span/></button>)}</div>
      <span className="rail-count">0{active + 1}<i/>06</span>
    </aside>
    <div className="top-wordmark"><Heart size={14} fill="currentColor"/> PRIYA'S LITTLE UNIVERSE</div>

    <section className="scene intro" data-index="0" ref={(el) => { sections.current[0] = el; }}>
      <div className="intro-content">
        <motion.div className="eyebrow" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .3 }}>A LITTLE WORLD, CREATED JUST FOR YOU</motion.div>
        <motion.div className="hero-orb" initial={{ scale: .75, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 1.5, ease: 'easeOut' }}><span>✦</span></motion.div>
        <motion.p className="intro-line intro-one" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .75 }}>Hey, Buggu<span className="red">...</span></motion.p>
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.15, duration: .9 }}>Aaj ki raat<br/><em>kuch special hai.</em></motion.h1>
        <motion.p className="intro-copy" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8, duration: 1 }}>Because someone very special deserves<br className="desktop-break"/> a whole little universe of her own.</motion.p>
        <motion.div className="birth-date" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.3 }}><span/> 11 NOVEMBER 2004 <span/></motion.div>
        <motion.button className="primary-button intro-button" onClick={() => goTo(1)} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.7 }}><span>Open your surprise</span><Heart size={16} fill="currentColor"/></motion.button>
      </div>
      <div className="scroll-hint" onClick={() => goTo(1)}><span>SCROLL INTO YOUR WORLD</span><ArrowDown size={13}/></div>
      <div className="scene-number">01 <i/> 06</div>
    </section>

    <section className="scene letter-scene" data-index="1" ref={(el) => { sections.current[1] = el; }}>
      <div className="section-heading"><span className="eyebrow">SOME THINGS ARE BETTER SAID BY HAND</span><h2>A letter <em>for you.</em></h2><p>Ek chhoti si baat, dil se.</p></div>
      <div className={`envelope-wrap ${opened ? 'is-open' : ''}`}>
        <div className="envelope-shadow"/><div className="letter-paper"><div className="letter-topline">A NOTE FOR MY FAVOURITE PERSON <Heart size={13} fill="currentColor"/></div><p className="letter-body">{opened ? config.letter.slice(0, letterChars) : ''}</p>{opened && <div className="letter-sign">With all my love,<br/><span>Harsh</span> <Heart size={13} fill="currentColor"/></div>}</div>
        <button className="envelope" onClick={() => { setLetterChars(0); setOpened(true); }} aria-label="Open the love letter" disabled={opened}>
          <div className="env-back"/><div className="env-flap"/><div className="env-front"/><span className="wax-seal"><Heart size={22} fill="currentColor"/></span>
          {!opened && <span className="tap-envelope">Tap to open</span>}
        </button>
      </div>
      {!opened && <p className="envelope-instruction">A little something, written just for you <span>↗</span></p>}
      <div className="scene-number">02 <i/> 06</div>
    </section>

    <section className="scene gallery-scene" data-index="2" ref={(el) => { sections.current[2] = el; }}>
      <div className="section-heading"><span className="eyebrow">LITTLE MOMENTS, BIG FEELINGS</span><h2>My favourite <em>views.</em></h2><p>Har ek frame mein, meri favourite person.</p></div>
      <div className="polaroid-grid">{config.photos.map((photo, index) => <motion.button className="polaroid" style={{ ['--turn' as string]: `${photoTurns[index]}deg`, ['--photo-ratio' as string]: `${photo.width} / ${photo.height}`, ['--photo-ratio-value' as string]: `${photo.width / photo.height}` }} key={photo.src} onClick={() => setLightbox(index)} initial={{ opacity: 0, y: 28, rotate: photoTurns[index] * 2 }} whileInView={{ opacity: 1, y: 0, rotate: photoTurns[index] }} viewport={{ once: true, amount: .25 }} transition={{ delay: index * .08, duration: .65 }} aria-label={`Open photo ${index + 1}: ${photo.caption}`}>
        <div className="polaroid-image"><img src={photo.src} width={photo.width} height={photo.height} alt={photo.caption} loading="lazy" onError={(event) => { event.currentTarget.style.display = 'none'; event.currentTarget.parentElement?.classList.add('is-missing'); }} /><MissingPhoto number={index + 1}/><span className="photo-index">0{index + 1}</span><span className="photo-open">↗</span></div><span className="polaroid-caption">{photo.caption}</span>
      </motion.button>)}</div>
      <p className="gallery-note"><span>✦</span> Tap any memory to see it a little closer</p>
      <div className="scene-number">03 <i/> 06</div>
    </section>

    <section className="scene timeline-scene" data-index="3" ref={(el) => { sections.current[3] = el; }}>
      <div className="section-heading"><span className="eyebrow">A STORY STILL BEING WRITTEN</span><h2>Our little <em>universe.</em></h2><p>Some moments stay with you, quietly and forever.</p></div>
      <div className="timeline">{config.memories.map((memory, index) => <motion.article className={`memory-card ${index % 2 ? 'right' : 'left'}`} key={memory.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .5 }} transition={{ duration: .55, delay: .05 }}><span className="memory-dot"><Heart size={11} fill="currentColor"/></span><span className="memory-number">CHAPTER 0{index + 1}</span><h3>{memory.title}</h3><p>{memory.note}</p></motion.article>)}</div>
      <p className="timeline-footer">And the best chapters are still ahead <Heart size={13} fill="currentColor"/></p>
      <div className="scene-number">04 <i/> 06</div>
    </section>

    <section className="scene cake-scene" data-index="4" ref={(el) => { sections.current[4] = el; }}>
      <div className="section-heading"><span className="eyebrow">MAKE A WISH, BUGGU</span><h2>It's your day, <em>Buggu!</em></h2><p>Aankhein band karo, ek wish maango<br/> aur candles blow karo...</p></div>
      <div className={`cake-stage ${candlesOut ? 'blown' : ''}`}>
        <div className="cake-glow"/><div className="candle-row">{[0,1,2,3,4].map((c) => <div className="candle" key={c}><span className="flame"/><i/></div>)}</div>
        <div className="cake-top"><span className="cake-icing"/><span className="rose-decoration">✿</span><span className="rose-decoration second">✿</span></div><div className="cake-layer cake-layer-one"><span className="drip"/></div><div className="cake-layer cake-layer-two"/><div className="cake-layer cake-layer-three"/><div className="cake-plate"/>
      </div>
      <AnimatePresence mode="wait">{candlesOut ? <motion.div className="wish-reveal" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}><span>✦</span> May all your beautiful dreams come true. ❤️</motion.div> : <motion.button className="primary-button blow-button" onClick={birthdayBurst} initial={{ opacity: 0 }} animate={{ opacity: 1 }}><span>Blow out the candles</span><span className="button-spark">✦</span></motion.button>}</AnimatePresence>
      <div className="scene-number">05 <i/> 06</div>
    </section>

    <section className="scene finale-scene" data-index="5" ref={(el) => { sections.current[5] = el; }}>
      <div className="final-heart" aria-hidden="true"><Heart fill="currentColor" strokeWidth={0}/></div>
      <motion.div className="finale-content" initial={{ opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .3 }} transition={{ duration: 1 }}>
        <span className="eyebrow">TODAY, TOMORROW, ALWAYS</span><h2>Happy Birthday,<br/><em>Priya!</em> <span className="final-red-heart">♥</span></h2><p className="final-tagline">My Buggu, my favourite person.</p><div className="final-divider"><i/> <Heart size={12} fill="currentColor"/> <i/></div><p className="final-message">{config.finale}</p><div className="signature"><span>With love,</span><strong>Harsh <Heart size={13} fill="currentColor"/></strong></div>
        <button className="replay-button" onClick={() => { setOpened(false); setLetterChars(0); setCandlesOut(false); goTo(0); }}><Heart size={13}/> Start our little universe again</button>
      </motion.div>
      <div className="scene-number">06 <i/> 06</div>
    </section>

    <div className="music-control"><button className={`music-toggle ${musicOn ? 'playing' : ''}`} onClick={() => setMusicOn((v) => !v)} aria-label={musicOn ? 'Pause music' : 'Play music'} title={musicOn ? 'Pause music' : 'Play music'}>{musicOn ? <Pause size={15}/> : <Play size={15}/>}<span className="music-label">{musicOn ? 'PAUSE' : 'OUR SONG'}</span></button><div className="volume-wrap"><button onClick={() => setMuted((v) => !v)} aria-label={muted ? 'Unmute' : 'Mute'}>{muted ? <VolumeX size={14}/> : <Volume2 size={14}/>}</button><input aria-label="Music volume" type="range" min="0" max="1" step="0.05" value={volume} onChange={(e) => setVolume(Number(e.target.value))}/></div><Music2 size={13} className={musicOn ? 'music-note dancing' : 'music-note'}/></div>

    <AnimatePresence>{lightbox !== null && <motion.div className="lightbox" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setLightbox(null)} onTouchStart={(e) => { touchStart.current = e.touches[0].clientX; }} onTouchEnd={(e) => { if (touchStart.current === null) return; const delta = e.changedTouches[0].clientX - touchStart.current; if (Math.abs(delta) > 45) movePhoto(delta < 0 ? 1 : -1); touchStart.current = null; }} role="dialog" aria-modal="true" aria-label="Photo gallery">
      <button className="lightbox-close" onClick={() => setLightbox(null)} aria-label="Close photo"><X size={19}/></button><button className="lightbox-arrow previous" onClick={(e) => { e.stopPropagation(); movePhoto(-1); }} aria-label="Previous photo"><ArrowLeft size={19}/></button><motion.div className="lightbox-card" key={lightbox} initial={{ scale: .96, y: 10 }} animate={{ scale: 1, y: 0 }} onClick={(e) => e.stopPropagation()}><div className="lightbox-image" style={{ ['--photo-ratio' as string]: `${config.photos[lightbox].width} / ${config.photos[lightbox].height}`, ['--photo-ratio-value' as string]: `${config.photos[lightbox].width / config.photos[lightbox].height}` }}><img src={config.photos[lightbox].src} width={config.photos[lightbox].width} height={config.photos[lightbox].height} alt={config.photos[lightbox].caption} onError={(event) => { event.currentTarget.style.display = 'none'; event.currentTarget.parentElement?.classList.add('is-missing'); }}/><MissingPhoto number={lightbox + 1}/></div><p>{config.photos[lightbox].caption}</p><span className="lightbox-counter">0{lightbox + 1} <i/> 0{config.photos.length}</span></motion.div><button className="lightbox-arrow next" onClick={(e) => { e.stopPropagation(); movePhoto(1); }} aria-label="Next photo"><ArrowRight size={19}/></button><span className="lightbox-tip">← USE ARROW KEYS OR SWIPE →</span>
    </motion.div>}</AnimatePresence>
  </main>;
}
