const config = {
  type: Phaser.AUTO,
  width: 400,
  height: 650,
  backgroundColor: '#000',
  parent: 'game',
  scene: {
    preload, // Precarga los recursos del juego
    create, // Crea el juego y ocupa lo cargado
    update // Actualiza el juego
  }
}

new Phaser.Game(config)

function preload() {

}

function create() {

}

function update() {

}