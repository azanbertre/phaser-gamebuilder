const Phaser = require('phaser');
/**
 * Create a new GameWorld.
 * @constructor
 */
class World extends Phaser.Tilemaps.Tilemap {

    constructor(scene, mapdata, layerNames) {
        super(scene, mapdata);

        this.scene = scene;
        this.layerNames = layerNames;
        this.worldLayers = [];

        this.tilesetName = 'tiles';

        this.tileset = this.addTilesetImage(this.tilesetName);
        for (var i = 0; i < this.layerNames.length; i++) {
            let name = this.layerNames[i];
            this.worldLayers.push(this.createStaticLayer(name, this.tilesetName));
        }

        this.scaleLayers(this.scene.game.config.width / (this.tileWidth * this.width));
    }

    scaleLayers(scale) {
        for (var i = 0; i < this.worldLayers.length; i++) {
            this.worldLayers[i].setScale(scale);
        }
    }
}

module.exports = World;
