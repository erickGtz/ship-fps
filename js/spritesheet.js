export const loadSpritesheets = (scene) => {
  scene.load.image('ship', 'assets/nave.png');

  scene.load.spritesheet('shoot', 'assets/shoot.png', {
    frameWidth: 32,
    frameHeight: 32
  });

  scene.load.spritesheet('shoot-enemy-01', 'assets/shoot_enemy01.png', {
    frameWidth: 32,
    frameHeight: 32
  });

  scene.load.spritesheet('enemy-01', 'assets/enemy-01.png', {
    frameWidth: 48,
    frameHeight: 48
  });
};
