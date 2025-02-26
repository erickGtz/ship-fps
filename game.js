const config = {
  type: Phaser.AUTO,
  width: 448,
  height: 512,
  backgroundColor: '#34495e',
  parent: 'game',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: true
    }
  },
  scene: {
    preload, // Precarga los recursos del juego
    create, // Crea el juego y ocupa lo cargado
    update // Actualiza el juego
  }
}

new Phaser.Game(config)

function preload() {
  this.load.image('ship', 'assets/nave.png');

  this.load.spritesheet('shoot', 'assets/shoot.png', {
    frameWidth: 32,
    frameHeight: 32
  });

  this.load.spritesheet('shoot-enemy-01', 'assets/shoot_enemy01.png', {
    frameWidth: 32,
    frameHeight: 32
  });

  this.load.spritesheet('enemy-01', 'assets/enemy-01.png', {
    frameWidth: 48,
    frameHeight: 48
  });
}

function create() {

  this.ship = this.physics.add.sprite(224, 450, 'ship').setCollideWorldBounds(true)
    .setOrigin(0, 0)
    .setSize(20, 28);  // Desactivar el rebote de la nave

  this.cursors = this.input.keyboard.createCursorKeys();

  this.keys = this.input.keyboard.addKeys({
    up: Phaser.Input.Keyboard.KeyCodes.W,
    down: Phaser.Input.Keyboard.KeyCodes.S,
    left: Phaser.Input.Keyboard.KeyCodes.A,
    right: Phaser.Input.Keyboard.KeyCodes.D
  });

  this.anims.create({
    key: 'shoot',
    frames: this.anims.generateFrameNumbers('shoot', {
      start: 0,
      end: 2
    }),
    frameRate: 9,
    repeat: 0 // No repetir la animación
  });

  this.anims.create({
    key: 'shoot-enemy-01',
    frames: this.anims.generateFrameNumbers('shoot-enemy-01', {
      start: 0,
      end: 2
    }),
    frameRate: 9,
    repeat: 0 // No repetir la animación
  });

  this.anims.create({
    key: 'ememy-01-idle',
    frames: this.anims.generateFrameNumbers('enemy-01', {
      start: 0,
      end: 1
    }),
    frameRate: 5,
    repeat: -1 // No repetir la animación
  });

  this.enemy_01 = this.physics.add.sprite(224, 100, 'enemy-01').play('ememy-01-idle')
    .setSize(48, 24)
    .setOffset(0, 12);

  // Crear el grupo de física para los disparos
  this.bullets = this.physics.add.group({
    runChildUpdate: true,
    collideWorldBounds: true // Habilita colisión con el mundo
  });


  this.ship.setDepth(3);  // La nave encima

  this.shoot = function () {
    // Crear un disparo en la posición de la nave
    const bullet = this.bullets.create(this.ship.x + 16, this.ship.y - 10, 'shoot');
    bullet.setSize(16, 24);
    bullet.setOffset(8, 0);
    bullet.play('shoot');
    bullet.setVelocityY(-285); // Aplicar la velocidad después de crear el disparo
    bullet.setCollideWorldBounds(true);
    bullet.body.onWorldBounds = true;
    bullet.setDepth(1); // El disparo debajo de la nave
  }

  this.input.on('pointerdown', function (pointer) {
    if (pointer.leftButtonDown()) {
      this.shoot();
    }
  }, this);

  this.physics.world.on('worldbounds', (body) => {
    if (body.gameObject) {
      body.gameObject.destroy();
    }
  });

  this.bullets_enemy = this.physics.add.group({
    runChildUpdate: true,
    collideWorldBounds: true // Habilita colisión con el mundo
  });

  this.shoot_enemy01 = function () {
    // Crear un disparo en la posición de la nave
    const bullet_enemyR = this.bullets_enemy.create(this.enemy_01.x + 16, this.enemy_01.y - 10, 'shoot_enemy01');
    bullet_enemyR.setSize(16, 24);
    bullet_enemyR.setOffset(8, 0);
    bullet_enemyR.flipY = true;
    bullet_enemyR.play('shoot-enemy-01');
    bullet_enemyR.setVelocityY(285); // Aplicar la velocidad después de crear el disparo
    bullet_enemyR.setCollideWorldBounds(true);
    bullet_enemyR.body.onWorldBounds = true;
    bullet_enemyR.setDepth(1); // El disparo debajo de la nave

    const bullet_enemyL = this.bullets_enemy.create(this.enemy_01.x - 16, this.enemy_01.y - 10, 'shoot_enemy01');
    bullet_enemyL.setSize(16, 24);
    bullet_enemyL.setOffset(8, 0);
    bullet_enemyL.flipY = true;
    bullet_enemyL.play('shoot-enemy-01');
    bullet_enemyL.setVelocityY(285); // Aplicar la velocidad después de crear el disparo
    bullet_enemyL.setCollideWorldBounds(true);
    bullet_enemyL.body.onWorldBounds = true;
    bullet_enemyL.setDepth(1); // El disparo debajo de la nave
  }

  this.shooting = false; // Variable para controlar el disparo continuo

  this.input.on('pointerdown', () => {
    if (!this.shooting) { // Solo actualizar si no está disparando ya
      this.lastShotTime = performance.now(); // Establecer el tiempo actual
    }
    this.shooting = true;
  });

  this.input.on('pointerup', () => {
    this.shooting = false;
  });

  // Colisión entre los disparos y el enemigo
  this.physics.add.collider(this.bullets, this.enemy_01, function (bullet, enemy) {
    bullet.destroy(); // Destruir el disparo
    enemy.destroy(); // Destruir el enemigo (o reducir su vida)
  });

  // Colisión entre los disparos del enemigo y el jugador
  this.physics.add.collider(this.bullets_enemy, this.ship, function (bullet_enemy, ship) {
    bullet_enemy.destroy(); // Destruir el disparo
    ship.destroy(); // Destruir el enemigo (o reducir su vida)
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

  if (this.shooting && currentTime > this.lastShotTime + 200) { 
    this.shoot(); 
    this.shoot_enemy01();
    this.lastShotTime = currentTime; // Actualizar el tiempo del último disparo
  }
}

