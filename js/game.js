import { createAnimations } from "./animations.js";
import { loadSpritesheets } from "./spritesheet.js";

export const config = {
  type: Phaser.AUTO,
  width: 448,
  height: 512,
  backgroundColor: "#34495e",
  parent: "game",
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
      debug: true,
    },
  },
  scene: { preload, create, update },
};

new Phaser.Game(config);

function preload() {
  loadSpritesheets(this);
}

function create() {
  this.ship = this.physics.add
    .sprite(224, 450, "ship")
    .setCollideWorldBounds(true)
    .setOrigin(0, 0)
    .setSize(20, 28);

  this.cursors = this.input.keyboard.createCursorKeys();
  this.keys = this.input.keyboard.addKeys({
    up: Phaser.Input.Keyboard.KeyCodes.W,
    down: Phaser.Input.Keyboard.KeyCodes.S,
    left: Phaser.Input.Keyboard.KeyCodes.A,
    right: Phaser.Input.Keyboard.KeyCodes.D,
  });

  createAnimations(this);

  this.enemy_01 = this.physics.add
    .sprite(224, 100, "enemy-01")
    .play("enemy-01-idle")
    .setSize(48, 24)
    .setOffset(0, 12)
    .setCollideWorldBounds(true);

  this.bullets = this.physics.add.group({ runChildUpdate: true, collideWorldBounds: true });
  this.bullets_enemy = this.physics.add.group({ runChildUpdate: true, collideWorldBounds: true });

  this.physics.world.on("worldbounds", (body) => {
    if (body.gameObject){
      body.gameObject.destroy();
    } 
  });

  this.shoot = () => {
    const bullet = this.bullets.create(this.ship.x + 16, this.ship.y - 10, "shoot").setCollideWorldBounds(true);
    bullet.setSize(16, 24).setOffset(8, 0).play("shoot").setVelocityY(-285);
    bullet.body.onWorldBounds = true;
    bullet.setDepth(1);
  };

  this.shoot_enemy01 = () => {
    const createEnemyBullet = (offsetX) => {
      const bullet = this.bullets_enemy.create(this.enemy_01.x + offsetX, this.enemy_01.y - 10, "shoot_enemy-01").setCollideWorldBounds(true);
      bullet.setSize(16, 24).setOffset(8, 0).flipY = true;
      bullet.body.onWorldBounds = true;
      bullet.play("shoot-enemy-01").setVelocityY(285).setDepth(1);
    };

    createEnemyBullet(16);
    createEnemyBullet(-16);
  };

  this.input.on("pointerdown", () => {
    this.shoot(); 
    this.lastShotTime = performance.now(); 
    this.shooting = true;
  });

  this.input.on("pointerup", () => {
    this.shooting = false;
  });

  

  this.moveEnemy = () => {
    if (!this.enemy_01) return;
    let randomX = Phaser.Math.Between(-20, 50);
    let randomY = Phaser.Math.Between(-20, 50);
    this.enemy_01.setVelocity(randomX, randomY);
    this.time.delayedCall(800, () => {
      if (this.enemy_01) this.enemy_01.setVelocity(0, 0);
    });
  };

  this.time.addEvent({
    delay: 1500,
    callback: this.moveEnemy,
    callbackScope: this,
    loop: true,
  });

  this.physics.add.collider(this.bullets, this.enemy_01, (bullet, enemy) => {
    bullet.destroy();
    enemy.destroy();
    this.enemy_01 = null;
  });

  this.physics.add.collider(this.bullets_enemy, this.ship, (bullet_enemy, ship) => {
    bullet_enemy.destroy();
    ship.destroy();
  });
}

var speed = 2;

function update() {
  let currentTime = performance.now();

  if (this.cursors.left.isDown || this.keys.left.isDown) {
    this.ship.x = Math.max(0, this.ship.x - speed);
  } else if (this.cursors.right.isDown || this.keys.right.isDown) {
    this.ship.x = Math.min(this.sys.game.config.width - this.ship.width, this.ship.x + speed);
  }

  if (this.cursors.up.isDown || this.keys.up.isDown) {
    this.ship.y = Math.max(0, this.ship.y - speed);
  } else if (this.cursors.down.isDown || this.keys.down.isDown) {
    this.ship.y = Math.min(this.sys.game.config.height - this.ship.height, this.ship.y + speed);
  }

  if (this.enemy_01) {
    this.enemy_01.x = Math.round(this.enemy_01.x);
    this.enemy_01.y = Math.round(this.enemy_01.y);
  }

  if (this.shooting && currentTime > this.lastShotTime + 150) {
    this.shoot();
    this.lastShotTime = currentTime;
  }
}