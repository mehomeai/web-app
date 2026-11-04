export interface SceneDetails { title: string; filePath: string; }

const f = (n: number) => `src/components/video/video_scenes/Scene${n}.tsx`;
export const SCENE_DETAILS: Record<string, SceneDetails> = {
  piggy: { title: 'Piggy bank → intelligence', filePath: f(1) },
  learn: { title: 'What kids need to learn', filePath: f(2) },
  meet: { title: 'Meet Me: hardware + app', filePath: f(3) },
  ask: { title: 'A private chat that stays home', filePath: f(4) },
  chores: { title: 'A feed you control', filePath: f(5) },
  own: { title: 'How you own it', filePath: f(6) },
  lockup: { title: 'Lockup', filePath: f(7) },
};
