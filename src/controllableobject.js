const GameObject = require('./gameobject');

class ControllableObject extends GameObject {
  constructor(id, scene, pixelX, pixelY, key) {
    super(id, scene, pixelX, pixelY, key);

    this.moveDirections = {
      UP: "UP",
      RIGHT: "RIGHT",
      DOWN: "DOWN",
      LEFT: "LEFT"
    };

    let direction = "RIGHT"; // FIX LATER
    this.initialDirection = direction;
    this.currentMoveDirection = this.moveDirections[direction];
    this.updateDirection();
  }

  updateDirection() {
    switch(this.currentMoveDirection) {
      case this.moveDirections.UP:
        this.angle = 0;
        break;
      case this.moveDirections.RIGHT:
        this.angle = 90;
        break;
      case this.moveDirections.DOWN:
        this.angle = 180;
        break;
      case this.moveDirections.LEFT:
        this.angle = 270;
        break;
    }
  }
}

module.exports = ControllableObject;
