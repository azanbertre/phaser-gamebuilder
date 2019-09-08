const builder = new GameBuilder();
const game = builder.newGame({title: 'Game', parent: 'phaser'}, 'game.json');
game.buildWorld();
game.spawnObjects();

function move() {
    game.scene.getMainCharacter().call('move');
}
