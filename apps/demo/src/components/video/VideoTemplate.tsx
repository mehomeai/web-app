import { useEffect, useRef, type ComponentType } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { VideoCanvas, VideoPausedContext, type VideoAspectRatio, useVideoPlayer } from '@/lib/video';
import { Phone } from './Phone';
import { Scene1 } from './video_scenes/Scene1';
import { Scene2 } from './video_scenes/Scene2';
import { Scene3, Scene3Screen } from './video_scenes/Scene3';
import { Scene4, Scene4Screen } from './video_scenes/Scene4';
import { Scene5, Scene5Screen } from './video_scenes/Scene5';
import { Scene6 } from './video_scenes/Scene6';
import { Scene7 } from './video_scenes/Scene7';

export const SCENE_DURATIONS = {
  piggy: 7400,
  learn: 6600,
  meet: 6600,
  ask: 14000,
  chores: 12000,
  own: 12600,
  lockup: 5600,
};

const VIDEO_ASPECT_RATIO: VideoAspectRatio = '9:16';

const SCENES: Record<string, ComponentType> = {
  piggy: Scene1, learn: Scene2, meet: Scene3, ask: Scene4, chores: Scene5, own: Scene6, lockup: Scene7,
};
const SCREENS: Record<string, ComponentType | undefined> = {
  meet: Scene3Screen, ask: Scene4Screen, chores: Scene5Screen,
};

// Persistent phone pose per scene index
const POSES = [
  { x: '0vh', y: '100vh', scale: 0.9, rotate: 0, opacity: 1 },
  { x: '0vh', y: '100vh', scale: 0.9, rotate: 0, opacity: 1 },
  { x: '11vh', y: '10vh', scale: 0.62, rotate: 0, opacity: 1 },
  { x: '0vh', y: '9vh', scale: 0.95, rotate: 0, opacity: 1 },
  { x: '0vh', y: '-5vh', scale: 0.98, rotate: 0, opacity: 1 },
  { x: '0vh', y: '100vh', scale: 0.9, rotate: 0, opacity: 1 },
  { x: '0vh', y: '100vh', scale: 0.9, rotate: 0, opacity: 0 },
];

const SCENE_START_SEC: Record<string, number> = (() => {
  const out: Record<string, number> = {};
  let c = 0;
  for (const [k, ms] of Object.entries(SCENE_DURATIONS)) { out[k] = c / 1000; c += ms; }
  return out;
})();

export default function VideoTemplate({
  durations = SCENE_DURATIONS,
  loop = true,
  paused = false,
  muted = false,
  onSceneChange,
}: {
  durations?: Record<string, number>;
  loop?: boolean;
  paused?: boolean;
  muted?: boolean;
  onSceneChange?: (sceneKey: string) => void;
} = {}) {
  const { currentSceneKey } = useVideoPlayer({ durations, loop, paused });
  useEffect(() => { onSceneChange?.(currentSceneKey); }, [currentSceneKey, onSceneChange]);
  const baseKey = currentSceneKey.replace(/_r[12]$/, '');
  const sceneIndex = Math.max(0, Object.keys(SCENE_DURATIONS).indexOf(baseKey));
  const SceneComponent = SCENES[baseKey];
  const Screen = SCREENS[baseKey];
  const pose = POSES[sceneIndex];

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const lastKey = useRef<string | null>(null);
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = 1;
    if (paused) { audio.pause(); return; }
    if (lastKey.current !== currentSceneKey) {
      lastKey.current = currentSceneKey;
      const t = SCENE_START_SEC[baseKey] ?? 0;
      if (Math.abs(audio.currentTime - t) > 0.18) audio.currentTime = t;
    }
    audio.play().catch(() => {});
  }, [currentSceneKey, baseKey, muted, paused]);

  return (
    <VideoPausedContext.Provider value={paused}>
      <VideoCanvas aspectRatio={VIDEO_ASPECT_RATIO} style={{ backgroundColor: 'var(--color-bg-light)', color: 'var(--color-text-primary)' }}>
        <AnimatePresence mode="sync">
          {SceneComponent && <SceneComponent key={currentSceneKey} />}
        </AnimatePresence>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ perspective: '140vh', zIndex: 2 }}>
          <motion.div initial={false} animate={pose}
            transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}>
            <Phone>
              <AnimatePresence mode="sync">
                {Screen ? <Screen key={currentSceneKey} /> : null}
              </AnimatePresence>
            </Phone>
          </motion.div>
        </div>
        <audio ref={audioRef} src={`${import.meta.env.BASE_URL}audio/composite_audio.mp3`} preload="auto" autoPlay muted={muted} />
      </VideoCanvas>
    </VideoPausedContext.Provider>
  );
}
