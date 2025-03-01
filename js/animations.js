export const createAnimations = (scene) => {
  scene.anims.create({
    key: 'shoot',
    frames: scene.anims.generateFrameNumbers('shoot', { start: 0, end: 2 }),
    frameRate: 9,
    repeat: 0
  });

  scene.anims.create({
    key: 'shoot-enemy-01',
    frames: scene.anims.generateFrameNumbers('shoot-enemy-01', { start: 0, end: 2 }),
    frameRate: 9,
    repeat: 0
  });

  scene.anims.create({
    key: 'enemy-01-idle',
    frames: scene.anims.generateFrameNumbers('enemy-01', { start: 0, end: 1 }),
    frameRate: 5,
    repeat: -1
  });
};
