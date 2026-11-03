import { useState } from 'react';
import { motion } from 'framer-motion';
import { useSceneTimer } from '@/lib/video';
import { EASE, MeMark } from '../Phone';

export function Scene7() {
  const [close, setClose] = useState(false);
  useSceneTimer([{ time: 4900, callback: () => setClose(true) }]);
  return (
    <motion.section className="absolute inset-0" style={{ background: '#17191c', color: '#f3f2ee' }}
      initial={{ clipPath: 'circle(0% at 50% 45%)' }} animate={{ clipPath: close ? 'circle(0% at 50% 45%)' : 'circle(130% at 50% 45%)' }}
      exit={{ opacity: 0 }} transition={{ duration: 0.75, ease: EASE }}>
      <div className="absolute inset-x-0 text-center" style={{ top: '30%' }}>
        <motion.div style={{ display: 'flex', justifyContent: 'center' }} initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.25, duration: 0.7, ease: EASE }}>
          <MeMark size="22vmin" color="#f3f2ee" />
        </motion.div>
        <motion.div className="f-display" style={{ fontSize: '30vmin', lineHeight: 1, marginTop: '5vmin' }}
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45, duration: 0.7, ease: EASE }}>Me</motion.div>
        <motion.div style={{ fontSize: '5.4vmin', marginTop: '2vmin', letterSpacing: '-0.02em' }}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1, duration: 0.6 }}>Home-first intelligence.</motion.div>
        <motion.div className="f-mono" style={{ fontSize: '2.6vmin', marginTop: '6vmin', color: 'rgba(243,242,238,0.55)', letterSpacing: '0.08em' }}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2, duration: 0.6 }}>ME HOME AI COMPUTER · ME APP</motion.div>
      </div>
    </motion.section>
  );
}
