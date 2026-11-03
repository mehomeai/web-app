import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useSceneTimer } from '@/lib/video';
import { EASE, MeMark } from '../Phone';

const COINS = [1300, 1800, 2300];

export function Scene1() {
  const [phase, setPhase] = useState(0);
  useSceneTimer([{ time: 3500, callback: () => setPhase(1) }]);
  const img = `${import.meta.env.BASE_URL}images/piggy.png`;
  return (
    <motion.section className="absolute inset-0 overflow-hidden" exit={{ opacity: 0, transition: { duration: 0.4 } }}>
      <AnimatePresence>
        {phase === 0 ? (
          <motion.div key="a" className="absolute" style={{ left: '8%', right: '8%', top: '10%' }}
            exit={{ opacity: 0, y: '-3vh', transition: { duration: 0.35 } }}>
            <motion.div className="f-mono" style={{ fontSize: '2.6vmin', color: 'var(--color-text-secondary)', letterSpacing: '0.12em' }}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>YESTERDAY</motion.div>
            <motion.div className="f-display" style={{ fontSize: '9.5vmin', lineHeight: 1.04, marginTop: '2.5vmin' }}
              initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.6, ease: EASE }}>
              We invested in a child's future with a piggy bank.
            </motion.div>
          </motion.div>
        ) : (
          <motion.div key="b" className="absolute" style={{ left: '8%', right: '8%', top: '10%' }}>
            <motion.div className="f-mono" style={{ fontSize: '2.6vmin', color: 'var(--color-accent)', letterSpacing: '0.12em' }}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}>TODAY</motion.div>
            <motion.div className="f-display" style={{ fontSize: '9.5vmin', lineHeight: 1.04, marginTop: '2.5vmin' }}
              initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.6, ease: EASE }}>
              Now we invest in their <span style={{ color: 'var(--color-accent)' }}>intelligence.</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.img src={img} alt="" className="absolute" style={{ width: '92vmin', left: '50%', top: '62%', marginLeft: '-46vmin', marginTop: '-40vmin' }}
        initial={{ scale: 0.85, opacity: 0 }}
        animate={phase === 0 ? { scale: 1, opacity: 1 } : { scale: 0.7, opacity: 0, filter: 'blur(6px)' }}
        transition={{ duration: phase === 0 ? 0.9 : 0.6, ease: EASE }} />
      {COINS.map((t) => (
        <motion.div key={t} className="absolute" style={{ left: '50%', top: '42%', width: '8vmin', height: '8vmin', marginLeft: '-4vmin', borderRadius: '50%', background: 'linear-gradient(140deg,#e9d7ae,#b98a3e)' }}
          initial={{ y: '-28vh', opacity: 0 }} animate={{ y: ['-28vh', '7vh', '9vh'], opacity: [0, 1, 0], scaleX: [1, 1, 0.2] }}
          transition={{ delay: t / 1000, duration: 0.55, times: [0, 0.8, 1], ease: 'easeIn' }} />
      ))}
      <motion.div className="absolute" style={{ left: '50%', top: '62%', marginLeft: '-14vmin', marginTop: '-14vmin' }}
        initial={{ scale: 0, opacity: 0 }} animate={phase === 1 ? { scale: 1, opacity: 1 } : {}} transition={{ delay: 0.4, duration: 0.7, ease: EASE }}>
        <MeMark size="28vmin" />
      </motion.div>
    </motion.section>
  );
}
