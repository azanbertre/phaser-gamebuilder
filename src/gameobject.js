/**
 * Create a new GameObject.
 * @constructor
 */
class GameObject extends Phaser.GameObjects.Sprite {
  constructor(id, scene, pixelX, pixelY, key) {
    super(scene, pixelX, pixelY, key);

    this.id = id;
    this.scene = scene;

    this.tileSize = this.scene.world.tileWidth;
    this.worldSize = this.scene.world.width;

    this.scale = this.scene.game.config.width / (this.tileSize * this.worldSize);
    this.offset = (this.tileSize / 2) * this.scale;

    this.animations = {};
    this.behaviors = {};

    this.runList = [];
    this.runCooldown = 500;
    this.currentToRun = null;
    this.nextToRun = null;
    this.running = false;
    this.finishedRun = false;
    this.pid = 0;

    this.x = ((this.x) * this.scale) + this.offset;
    this.y = ((this.y) * this.scale) + this.offset;
    this.initialX = this.x;
    this.initialY = this.y;
    this.setScale(this.scale);
  }

  spawn() {
    this.scene.add.existing(this);
  }

  // resize(scale) {
  //     this.scale = scale;
  //     this.setScale(scale);
  //     this.x = ((this.x) * this.scale) + this.offset;
  //     this.y = ((this.y) * this.scale) + this.offset;
  // }

  /**
   * Add function to a list to be executed later in order.
   * @param {string} functionName Name of the function.
   * @param {any} params Params of the function.
   */
  addToRun(functionName, params = null) {
    this.runList.push({functionName: functionName, params: params});
  }

  /**
   * Call a function from the behavior library
   */
  call(functionName, params = null) {
    let behavior = require('./behaviors/' + functionName);
    behavior.call(this, params);
  }

  /**
   * Run the code in the runList order in milliseconds intervals defined by runCooldown.
   */
  run() {
    this.running = true;
    this.finishedRun = false;

    if (!this.currentToRun) {
      this.currentToRun = this.runList[0];
    }

    var next = function () {
      this.nextToRun = this.getNext();
      this[this.currentToRun.functionName](this.currentToRun.param);
      if (this.nextToRun) {
        this.currentToRun = this.nextToRun;
        this.pid = setTimeout(next, this.runCooldown);
      } else {
        setTimeout(function () {
          this.running = false;
          this.finishedRun = true;
        }.bind(this), this.runCooldown);
      }
    }.bind(this);
    setTimeout(next, this.runCooldown);
  }

  /**
   * Get the next function in the runList in order.
   */
  getNext() {
    return this.runList[this.runList.indexOf(this.currentToRun) + 1] || false;
  }

  /**
   * Reset the GameObject values to the initial values.
   */
  reset() {
    this.x = this.initialX;
    this.y = this.initialY;

    this.runList = [];
    this.running = false;
    this.finishedRun = false;
    this.currentToRun = null;
    this.nextToRun = null;
  }

  /**
   * See if the GameObject is located in the given pixel position.
   * @param {number} pixelX Pixel position in the X axis.
   * @param {number} pixelY Pixel position in the Y axis.
   * @return {boolean} True if is located, if else, false.
   */
  isAt(pixelX, pixelY) {
    if (pixelX === this.x && pixelY === this.y) {
      return true;
    }
    return false;
  }

  /**
   * Get the tile position of the object in the world.
   * @param {string} layerName The layer where tha GameObject can walk.
   * @return {dictionary} Coordinates of the object in the world grid.
   */
  getWorldPos(layerName) {
    var name = layerName || 'Ground';
    var layer = this.scene.world.getLayer(name)
    var position = -1;
    layer.tilemapLayer.forEachTile(function (tile) {
      let tileX = ((tile.pixelX * this.scale) + this.offset);
      let tileY = ((tile.pixelY * this.scale) + this.offset);
      if (this.isAt(tileX, tileY)) {
        position = {x: tile.x, y: tile.y};
      }
    }.bind(this));
    return position;
  }

  /**
   * Get the pixel position of the GameObject.
   * @return {dictionary} Coordinates of the object in pixels.
   */
  getPixelPos() {
    return {x: this.x, y: this.y};
  }
}

module.exports = GameObject;
