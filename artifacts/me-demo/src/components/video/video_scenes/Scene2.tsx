import { useState } from 'react';
import { motion } from 'framer-motion';
import { useSceneTimer } from '@/lib/video';
import { EASE } from '../Phone';

const ROWS = [
  ['Use AI.', 'Don\u2019t be used by it.'],
  ['Trust it.', 'Never blindly.'],
  ['Offload chores.', 'Keep the thinking.'],
];

export function Scene2() {
  const [n, setN] = useState(0);
  useSceneTimer([{ time: 300, callback: () => setN(1) }, { time: 2700, callback: () => setN(2) }, { time: 4600, callback: () => setN(3) }]);
  return (
    <motion.section className="absolute inset-0" style={{ background: '#17191c', color: '#f3f2ee' }}
      initial={{ clipPath: 'inset(0 0 100% 0)' }} animate={{ clipPath: 'inset(0 0 0% 0)' }}
      exit={{ clipPath: 'inset(100% 0 0 0)', transition: { duration: 0.6, ease: EASE } }} transition={{ duration: 0.6, ease: EASE }}>
      <div className="absolute" style={{ left: '8%', right: '8%', top: '20%' }}>
        <div className="f-mono" style={{ fontSize: '2.6vmin', letterSpacing: '0.12em', color: '#7fb5ae' }}>WHAT KIDS NEED TO LEARN</div>
        {ROWS.map(([a, b], k) => (
          <motion.div key={a} style={{ borderTop: '0.15vmin solid rgba(243,242,238,0.18)', marginTop: k ? '0' : '4vmin', padding: '4.5vmin 0' }}
            initial={{ opacity: 0, y: 24 }} animate={n > k ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, ease: EASE }}>
            <div className="f-display" style={{ fontSize: '10vmin', lineHeight: 1 }}>{a}</div>
            <div className="f-display" style={{ fontSize: '10vmin', lineHeight: 1.05, color: 'rgba(243,242,238,0.45)' }}>{b}</div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
