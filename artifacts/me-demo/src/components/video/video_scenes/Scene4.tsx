import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useSceneTimer } from '@/lib/video';
import { EASE, MeMark } from '../Phone';

export function Scene4() {
  const [h, setH] = useState(0);
  const [room, setRoom] = useState(false);
  useSceneTimer([{ time: 7400, callback: () => setH(1) }, { time: 9000, callback: () => setRoom(true) }]);
  const img = `${import.meta.env.BASE_URL}images/me-home-room.jpg`;
  return (
    <motion.section className="absolute inset-0 pointer-events-none" exit={{ opacity: 0, transition: { duration: 0.35 } }}>
      <div className="absolute" style={{ left: '8%', right: '8%', top: '5%', height: '16%' }}>
        <AnimatePresence>
          {h === 0 ? (
            <motion.div key="a" className="absolute inset-0 f-display" style={{ fontSize: '9vmin', lineHeight: 1.04 }}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: '-2vh', transition: { duration: 0.3 } }} transition={{ duration: 0.6, ease: EASE }}>
              Ask the hard<br /><span style={{ color: 'var(--color-text-secondary)' }}>questions.</span>
            </motion.div>
          ) : (
            <motion.div key="b" className="absolute inset-0 f-display" style={{ fontSize: '9vmin', lineHeight: 1.04 }}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: EASE }}>
              Processed<br /><span style={{ color: 'var(--color-accent)' }}>at home.</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {room && (
        <motion.div className="absolute inset-0" style={{ zIndex: 3, overflow: 'hidden' }}
          initial={{ clipPath: 'circle(6% at 50% 56%)' }} animate={{ clipPath: 'circle(120% at 50% 56%)' }} transition={{ duration: 0.9, ease: EASE }}>
          <motion.img src={img} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
            initial={{ scale: 1.12 }} animate={{ scale: 1 }} transition={{ duration: 5, ease: 'easeOut' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(243,242,238,0.92) 0%, rgba(243,242,238,0.55) 26%, rgba(243,242,238,0) 42%)' }} />
          <div style={{ position: 'absolute', left: '50%', top: '75%', width: 0, height: 0 }}>
            {[0, 1, 2].map((k) => (
              <motion.div key={k} style={{ position: 'absolute', left: '-4vmin', top: '-4vmin', width: '8vmin', height: '8vmin', borderRadius: '50%', border: '0.4vmin solid #1e6b66' }}
                initial={{ scale: 0.3, opacity: 0 }} animate={{ scale: [0.3, 2.4], opacity: [0.9, 0] }} transition={{ duration: 1.8, delay: 0.9 + k * 0.6, repeat: Infinity, repeatDelay: 0, ease: 'easeOut' }} />
            ))}
          </div>
          <div style={{ position: 'absolute', left: '8%', right: '8%', top: '5%' }}>
            <motion.div className="f-mono" style={{ fontSize: '2.4vmin', letterSpacing: '0.12em', color: 'var(--color-accent)' }}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>ME HOME · IN THE LIVING ROOM</motion.div>
            <motion.div className="f-display" style={{ fontSize: '9vmin', lineHeight: 1.04, marginTop: '1.2vmin' }}
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.6, ease: EASE }}>
              Your chat is<br /><span style={{ color: 'var(--color-accent)' }}>saved right here.</span>
            </motion.div>
          </div>
        </motion.div>
      )}
    </motion.section>
  );
}

function Typing() {
  return (
    <div style={{ display: 'flex', gap: '0.5vh', padding: '1.3vh 1.5vh', background: '#fff', border: '0.1vh solid #e6e4de', borderRadius: '2vh 2vh 2vh 0.5vh', width: 'fit-content' }}>
      {[0, 1, 2].map((k) => (
        <motion.span key={k} style={{ width: '0.8vh', height: '0.8vh', borderRadius: '50%', background: '#9a9da3' }}
          animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 0.9, repeat: Infinity, delay: k * 0.15 }} />
      ))}
    </div>
  );
}

export function Scene4Screen() {
  const [s, setS] = useState(0);
  useSceneTimer([800, 2200, 3200, 5600, 6600, 7400].map((t, k) => ({ time: t, callback: () => setS(k + 1) })));
  const me = { background: '#ffffff', border: '0.1vh solid #e6e4de', borderRadius: '2vh 2vh 2vh 0.5vh', padding: '1.2vh 1.5vh', fontSize: '1.6vh', lineHeight: 1.4, maxWidth: '27vh' } as const;
  const you = { background: '#17191c', color: '#f3f2ee', borderRadius: '2vh 2vh 0.5vh 2vh', padding: '1.2vh 1.5vh', fontSize: '1.6vh', lineHeight: 1.35, marginLeft: 'auto', width: 'fit-content', maxWidth: '25vh' } as const;
  const pop = { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.4, ease: EASE } };
  return (
    <motion.div className="absolute inset-0" style={{ padding: '5vh 2vh 0', display: 'flex', flexDirection: 'column', gap: '1.2vh' }}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.25 } }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.1vh', paddingBottom: '1.2vh', borderBottom: '0.1vh solid #e6e4de' }}>
        <MeMark size="3.4vh" />
        <div><div style={{ fontSize: '1.9vh', fontWeight: 600 }}>Me</div><div className="f-mono" style={{ fontSize: '1.1vh', color: '#1e6b66' }}>private chat · on Me Home</div></div>
      </div>
      {s >= 1 && <motion.div {...pop} style={you}>I'm two months behind on rent. I'm embarrassed to tell my family.</motion.div>}
      {s === 2 && <motion.div {...pop}><Typing /></motion.div>}
      {s >= 3 && <motion.div {...pop} style={me}>That's more common than it feels. Want to make a plan, and think about how to tell them?</motion.div>}
      {s >= 4 && <motion.div {...pop} style={you}>Where does this chat go?</motion.div>}
      {s === 5 && <motion.div {...pop}><Typing /></motion.div>}
      {s >= 6 && <motion.div {...pop} style={me}>It's processed on Me Home and saved on its drive. It isn't sent to the cloud.</motion.div>}
      <motion.div className="f-mono" style={{ position: 'absolute', left: '2vh', right: '2vh', bottom: '3.2vh', fontSize: '1.1vh', color: '#6b6f76', display: 'flex', justifyContent: 'space-between', borderTop: '0.1vh solid #e6e4de', paddingTop: '1.2vh' }}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}>
        <span>Fictional example</span><span style={{ color: '#1e6b66' }}>Processed on Me Home</span>
      </motion.div>
    </motion.div>
  );
}
