import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useSceneTimer } from '@/lib/video';
import { EASE } from '../Phone';

const LINES = [
  <>A feed <span style={{ color: 'var(--color-accent)' }}>you control.</span></>,
  <>Built to teach,<br /><span style={{ color: 'var(--color-text-secondary)' }}>not to hook.</span></>,
  <>You set the dial.<br /><span style={{ color: 'var(--color-accent)' }}>The feed follows.</span></>,
];

export function Scene5() {
  const [h, setH] = useState(0);
  useSceneTimer([{ time: 3600, callback: () => setH(1) }, { time: 7000, callback: () => setH(2) }]);
  return (
    <motion.section className="absolute inset-0 pointer-events-none" exit={{ opacity: 0, transition: { duration: 0.35 } }}>
      <div className="absolute" style={{ left: '8%', right: '8%', bottom: '4%', height: '15%' }}>
        <AnimatePresence>
          <motion.div key={h} className="absolute inset-x-0 bottom-0 f-display" style={{ fontSize: '7.6vmin', lineHeight: 1.05 }}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12, transition: { duration: 0.3 } }} transition={{ delay: h === 0 ? 0.2 : 0, duration: 0.6, ease: EASE }}>
            {LINES[h]}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.section>
  );
}

type Reel = { img: string; handle: string; cap: string; tag: string; likes: string; fresh?: boolean };
const REELS: Reel[] = [
  { img: 'reel_volcano', handle: '@kitchenlab', cap: 'Why does the lava foam? Acid meets base.', tag: 'SCIENCE', likes: '18.2K' },
  { img: 'reel_cat', handle: '@chaospets', cap: 'wait for it…', tag: 'JUST FOR FUN', likes: '2.4M' },
  { img: 'reel_prank', handle: '@prankdaily', cap: 'he did NOT see that coming', tag: 'JUST FOR FUN', likes: '1.1M' },
  { img: 'reel_bridge', handle: '@makerkids', cap: 'A folded paper bridge holds 41 coins. Why?', tag: 'ENGINEERING', likes: '9,630', fresh: true },
  { img: 'reel_bees', handle: '@fieldnotes', cap: 'Bees dance to give directions to flowers.', tag: 'NATURE', likes: '27.5K', fresh: true },
];
// reel index over time; dial sheet in between
const AT = [0, 1300, 2600, 8000, 10000];

export function Scene5Screen() {
  const [i, setI] = useState(0);
  const [d, setD] = useState(0);
  useSceneTimer([
    ...AT.slice(1).map((t, k) => ({ time: t, callback: () => setI(k + 1) })),
    { time: 4000, callback: () => setD(1) },
    { time: 5000, callback: () => setD(2) },
    { time: 7600, callback: () => setD(3) },
  ]);
  const learn = d >= 2 ? 0.8 : 0.3;
  const base = import.meta.env.BASE_URL;
  const mono = { fontSize: '1.1vh', letterSpacing: '0.06em' } as const;
  return (
    <motion.div className="absolute inset-0" style={{ overflow: 'hidden', background: '#17191c' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.25 } }}>
      <motion.div className="absolute inset-x-0 top-0" style={{ height: '100%' }} initial={false} animate={{ y: `${-i * 100}%` }} transition={{ duration: 0.45, ease: [0.65, 0, 0.35, 1] }}>
        {REELS.map((r, k) => (
          <div key={r.img} className="absolute inset-x-0" style={{ top: `${k * 100}%`, height: '100%' }}>
            <img src={`${base}images/${r.img}.jpg`} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(23,25,28,0.45) 0%, rgba(23,25,28,0) 22%, rgba(23,25,28,0) 55%, rgba(23,25,28,0.8) 100%)' }} />
            <div style={{ position: 'absolute', left: '1.8vh', right: '7vh', bottom: '4.2vh', color: '#f3f2ee' }}>
              <div className="f-mono" style={{ ...mono, display: 'inline-block', padding: '0.4vh 0.8vh', borderRadius: '0.8vh', background: r.fresh ? '#1e6b66' : 'rgba(243,242,238,0.2)' }}>
                {r.fresh ? `FROM YOUR RULE · ${r.tag}` : r.tag}
              </div>
              <div style={{ fontSize: '1.6vh', fontWeight: 600, marginTop: '0.8vh' }}>{r.handle}</div>
              <div style={{ fontSize: '1.55vh', lineHeight: 1.35, marginTop: '0.4vh' }}>{r.cap}</div>
            </div>
            <div style={{ position: 'absolute', right: '1.4vh', bottom: '5vh', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.8vh', color: '#f3f2ee' }}>
              {[r.likes, 'Ask Me', 'Save'].map((l) => (
                <div key={l} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4vh' }}>
                  <div style={{ width: '3.6vh', height: '3.6vh', borderRadius: '50%', background: 'rgba(243,242,238,0.22)', border: '0.15vh solid rgba(243,242,238,0.6)' }} />
                  <span style={{ fontSize: '1vh' }}>{l}</span>
                </div>
              ))}
            </div>
            <div style={{ position: 'absolute', left: 0, right: 0, bottom: '2vh', height: '0.3vh', background: 'rgba(243,242,238,0.25)' }}>
              {i === k && <motion.div style={{ height: '100%', background: '#f3f2ee', originX: 0 }} initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 2, ease: 'linear' }} />}
            </div>
          </div>
        ))}
      </motion.div>
      <div className="absolute inset-x-0" style={{ top: '5.5vh', display: 'flex', justifyContent: 'center', gap: '2vh', color: '#f3f2ee', fontSize: '1.6vh', fontWeight: 600 }}>
        <span style={{ opacity: 0.6 }}>Following</span><span style={{ borderBottom: '0.25vh solid #f3f2ee', paddingBottom: '0.4vh' }}>For Maya</span>
      </div>
      <div className="absolute f-mono" style={{ ...mono, top: '9.2vh', left: 0, right: 0, textAlign: 'center', color: '#8fc2bc' }}>RANKED ON ME HOME · RULES BY MOM & DAD</div>
      <AnimatePresence>
        {(d === 1 || d === 2) && (
          <motion.div key="rules" style={{ position: 'absolute', left: '1.2vh', right: '1.2vh', bottom: '2vh', background: '#fff', color: '#17191c', borderRadius: '2vh', padding: '1.8vh', boxShadow: '0 -1vh 3vh rgba(23,25,28,0.25)' }}
            initial={{ y: '40vh' }} animate={{ y: 0 }} exit={{ y: '40vh', transition: { duration: 0.4 } }} transition={{ duration: 0.5, ease: EASE }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.4vh' }}>
              <div style={{ fontSize: '1.8vh', fontWeight: 600 }}>Feed rules</div>
              {d === 2 && <motion.span className="f-mono" style={{ fontSize: '1.05vh', color: '#1e6b66' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>MOM CHANGED THIS</motion.span>}
            </div>
            {([['Learning', learn], ['Just for fun', 1 - learn]] as [string, number][]).map(([a, v]) => (
              <div key={a} style={{ marginBottom: '1.4vh' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.4vh' }}><span>{a}</span><span className="f-mono" style={{ color: '#1e6b66' }}>{Math.round(v * 100)}%</span></div>
                <div style={{ position: 'relative', height: '0.6vh', background: '#ecebe6', borderRadius: '0.3vh', marginTop: '0.8vh' }}>
                  <motion.div style={{ position: 'absolute', inset: 0, background: '#1e6b66', originX: 0, borderRadius: '0.3vh' }} initial={false} animate={{ scaleX: v }} transition={{ duration: 0.9, ease: EASE }} />
                  <motion.div style={{ position: 'absolute', top: '-0.9vh', width: '2.4vh', height: '2.4vh', marginLeft: '-1.2vh', borderRadius: '50%', background: '#fff', border: '0.2vh solid #1e6b66' }} initial={false} animate={{ left: `${v * 100}%` }} transition={{ duration: 0.9, ease: EASE }} />
                </div>
              </div>
            ))}
            <div style={{ display: 'flex', gap: '0.8vh' }}>
              <span className="f-mono" style={{ fontSize: '1.15vh', padding: '0.5vh 1vh', borderRadius: '1vh', background: '#f3f2ee' }}>AUTOPLAY OFF</span>
              <span className="f-mono" style={{ fontSize: '1.15vh', padding: '0.5vh 1vh', borderRadius: '1vh', background: '#f3f2ee' }}>DAILY LIMIT 30 MIN</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
