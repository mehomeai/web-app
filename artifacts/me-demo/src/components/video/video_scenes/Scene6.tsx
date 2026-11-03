import { motion } from 'framer-motion';
import { EASE, card } from '../Phone';

const CALLOUTS: [string, string, string][] = [
  ['You own the machine', 'It sits in your home, on your own network.', '0.6'],
  ['Open-source models', 'The LLMs run on its own chip. No AI processing in the cloud.', '3.2'],
  ['Your data, your drive', 'Family data is stored on the computer at home.', '5.3'],
  ['Your rules', 'Parents set what it teaches, what it does, and what needs approval.', '7.5'],
];

export function Scene6() {
  const img = `${import.meta.env.BASE_URL}images/me-home.png`;
  return (
    <motion.section className="absolute inset-0 pointer-events-none" exit={{ opacity: 0, transition: { duration: 0.4 } }}>
      <div className="absolute" style={{ left: '8%', right: '8%', top: '5%' }}>
        <motion.div className="f-mono" style={{ fontSize: '2.6vmin', letterSpacing: '0.12em', color: 'var(--color-accent)' }}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>HOW YOU OWN IT</motion.div>
        <motion.div className="f-display" style={{ fontSize: '10vmin', lineHeight: 1.02, marginTop: '1.5vmin' }}
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.6, ease: EASE }}>
          It lives in your home.
        </motion.div>
      </div>
      <motion.img src={img} alt="" className="absolute" style={{ width: '62vmin', left: '50%', top: '17%', marginLeft: '-31vmin' }}
        initial={{ opacity: 0, scale: 1.15 }} animate={{ opacity: 1, scale: [1.15, 1, 0.94] }} transition={{ scale: { duration: 12, times: [0, 0.08, 1], ease: 'easeOut' }, opacity: { duration: 0.6 } }} />
      <div className="absolute" style={{ left: '8%', right: '8%', top: '50%' }}>
        {CALLOUTS.map(([a, b, d], k) => (
          <motion.div key={a} style={{ ...card, display: 'flex', gap: '3vmin', alignItems: 'flex-start', padding: '2.4vmin 3vmin', marginBottom: '1.6vmin' }}
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Number(d), duration: 0.5, ease: EASE }}>
            <div className="f-mono" style={{ fontSize: '2.6vmin', color: 'var(--color-accent)', paddingTop: '0.4vmin' }}>0{k + 1}</div>
            <div>
              <div style={{ fontSize: '4vmin', fontWeight: 600, letterSpacing: '-0.02em' }}>{a}</div>
              <div style={{ fontSize: '2.9vmin', color: 'var(--color-text-secondary)', marginTop: '0.5vmin', lineHeight: 1.35 }}>{b}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
