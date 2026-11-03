import { motion } from 'framer-motion';
import { EASE, MeMark, card } from '../Phone';

export function Scene3() {
  const img = `${import.meta.env.BASE_URL}images/me-home.png`;
  return (
    <motion.section className="absolute inset-0 pointer-events-none" exit={{ opacity: 0, transition: { duration: 0.4 } }}>
      <div className="absolute" style={{ left: '8%', right: '8%', top: '6%' }}>
        <motion.div style={{ display: 'flex', alignItems: 'center', gap: '3vmin' }}
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: EASE }}>
          <MeMark size="9vmin" />
          <div className="f-display" style={{ fontSize: '13vmin', lineHeight: 1 }}>Meet Me.</div>
        </motion.div>
        <motion.div style={{ fontSize: '4.4vmin', marginTop: '3vmin', color: 'var(--color-text-secondary)', lineHeight: 1.3 }}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9, duration: 0.5 }}>
          Not another chatbot. <span style={{ color: 'var(--color-text-primary)' }}>A home AI computer + the app that connects your family to it.</span>
        </motion.div>
      </div>
      <motion.img src={img} alt="" className="absolute" style={{ width: '66vmin', left: '-4vmin', top: '42%' }}
        initial={{ opacity: 0, scale: 0.85, x: '-6vmin' }} animate={{ opacity: 1, scale: 1, x: 0 }} transition={{ delay: 0.2, duration: 0.9, ease: EASE }} />
      <motion.div className="absolute" style={{ ...card, left: '8%', top: '80%', padding: '2vmin 3vmin' }}
        initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.6, duration: 0.5, ease: EASE }}>
        <div className="f-mono" style={{ fontSize: '2.3vmin', color: 'var(--color-accent)' }}>01 · HARDWARE</div>
        <div style={{ fontSize: '3.8vmin', fontWeight: 600, marginTop: '0.6vmin' }}>Me Home</div>
        <div style={{ fontSize: '2.8vmin', color: 'var(--color-text-secondary)' }}>AI computer, in your house</div>
      </motion.div>
      <motion.div className="absolute" style={{ ...card, right: '6%', top: '85%', padding: '2vmin 3vmin' }}
        initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.3, duration: 0.5, ease: EASE }}>
        <div className="f-mono" style={{ fontSize: '2.3vmin', color: 'var(--color-accent)' }}>02 · APP</div>
        <div style={{ fontSize: '3.8vmin', fontWeight: 600, marginTop: '0.6vmin' }}>Me</div>
        <div style={{ fontSize: '2.8vmin', color: 'var(--color-text-secondary)' }}>on every family phone</div>
      </motion.div>
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <motion.path d="M 42 62 C 50 62, 52 58, 60 58" fill="none" stroke="#1e6b66" strokeDasharray="1 0.8" style={{ strokeWidth: '0.4vmin' }} vectorEffect="non-scaling-stroke"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 1.2, duration: 0.8, ease: EASE }} />
      </svg>
    </motion.section>
  );
}

export function Scene3Screen() {
  return (
    <motion.div className="absolute inset-0" style={{ padding: '7vh 2.4vh 0' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.25 } }}>
      <MeMark size="6vh" />
      <div className="f-display" style={{ fontSize: '3.4vh', marginTop: '2vh', lineHeight: 1.1 }}>Good evening,<br />the Okafor family.</div>
      <motion.div style={{ ...card, marginTop: '3vh', padding: '1.6vh', display: 'flex', alignItems: 'center', gap: '1.2vh' }}
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.4, duration: 0.4 }}>
        <motion.div style={{ width: '1vh', height: '1vh', borderRadius: '50%', background: '#1e6b66' }} animate={{ opacity: [1, 0.3, 1] }} transition={{ repeat: Infinity, duration: 1.2 }} />
        <div>
          <div style={{ fontSize: '1.7vh', fontWeight: 600 }}>Connected to Me Home</div>
          <div className="f-mono" style={{ fontSize: '1.15vh', color: '#6b6f76', marginTop: '0.3vh' }}>living room · local network</div>
        </div>
      </motion.div>
      {['Maya · age 9', 'Theo · age 12', 'Parents · admin'].map((t, k) => (
        <motion.div key={t} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '0.1vh solid #e6e4de', padding: '1.5vh 0', fontSize: '1.6vh' }}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 + k * 0.35 }}>
          <span>{t}</span><span className="f-mono" style={{ fontSize: '1.2vh', color: '#6b6f76' }}>{k === 2 ? 'supervising' : 'learning mode'}</span>
        </motion.div>
      ))}
    </motion.div>
  );
}
