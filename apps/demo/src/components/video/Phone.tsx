import type { CSSProperties, ReactNode } from 'react';

export function Phone({ children }: { children: ReactNode }) {
  return (
    <div style={{ width: '35vh', height: '72vh', borderRadius: '5.4vh', padding: '0.9vh', background: '#17191c', boxShadow: '0 3vh 6vh -2vh rgba(23,25,28,0.28), 0 0 0 0.15vh #3a3d42', position: 'relative' }}>
      <div style={{ width: '100%', height: '100%', borderRadius: '4.6vh', overflow: 'hidden', position: 'relative', background: '#fbfaf7', color: '#17191c', fontFamily: 'var(--font-body)' }}>
        <div style={{ position: 'absolute', top: '1.1vh', left: '50%', transform: 'translateX(-50%)', width: '9vh', height: '2.6vh', borderRadius: '2vh', background: '#17191c', zIndex: 5 }} />
        <div style={{ position: 'absolute', top: '1.5vh', left: '2.8vh', right: '2.8vh', display: 'flex', justifyContent: 'space-between', fontSize: '1.3vh', fontWeight: 600, zIndex: 4 }}>
          <span>9:41</span>
          <span className="f-mono" style={{ fontSize: '1.05vh', color: '#1e6b66', display: 'flex', alignItems: 'center', gap: '0.5vh' }}>
            <span style={{ width: '0.7vh', height: '0.7vh', borderRadius: '50%', background: '#1e6b66' }} />HOME
          </span>
        </div>
        {children}
      </div>
    </div>
  );
}

/** The Me mark: a thin ring with a solid core. */
export function MeMark({ size, color = '#17191c', style }: { size: string; color?: string; style?: CSSProperties }) {
  return (
    <div style={{ width: size, height: size, borderRadius: '50%', border: `calc(${size} * 0.09) solid ${color}`, display: 'grid', placeItems: 'center', boxSizing: 'border-box', ...style }}>
      <div style={{ width: '34%', height: '34%', borderRadius: '50%', background: '#1e6b66' }} />
    </div>
  );
}

export const EASE = [0.22, 1, 0.36, 1] as const;
export const card: CSSProperties = { background: '#ffffff', borderRadius: '1.6vh', border: '0.1vh solid #e6e4de' };
