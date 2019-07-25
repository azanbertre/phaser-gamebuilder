/**
 * Behavior movement for any object.
 */
var move = function () {
  console.log(this)
  if (this.behaviors.movement)
    this.anims.play(this.animations[this.behaviors.movement]);
  switch (this.currentMoveDirection) {
    case this.moveDirections.UP:
      this.y -= this.offset * 2;
      break;
    case this.moveDirections.RIGHT:
      this.x += this.offset * 2;
      break;
    case this.moveDirections.DOWN:
      this.y += this.offset * 2;
      break;
    case this.moveDirections.LEFT:
      this.x -= this.offset * 2;
      break;
  }
}

module.exports = move;
