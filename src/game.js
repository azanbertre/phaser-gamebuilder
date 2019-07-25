const ControllableObject = require("./controllableobject");

class Game extends Phaser.Scene {
  constructor(config) {
    super(config);

    this.objects = [];
    this.ready = false;
  }

  preload() {
    if (this.data) {
      this.load.image('tiles', this.data.world.tileset);

      /**
       * Load sprites for animated objects or images for static objects.
       */
      for (var i = 0; i < this.data.objects.length; i++) {
        var obj = this.data.objects[i];
        if (!obj.hasOwnProperty('graphics')) return;

        if (obj.graphics.hasOwnProperty('animation')) {
          this.load.spritesheet(obj.graphics.sprite.name,
            obj.graphics.sprite.src, {
              frameWidth: obj.graphics.sprite.width,
              frameHeight: obj.graphics.sprite.height
            });
        } else {
          this.load.image(obj.graphics.sprite.name, obj.graphics.sprite.src);
        }
      }
    }
  }

  // resizeApp()
  // {
  // 	// Width-height-ratio of game resolution
  // 	let game_ratio = this.game.config.width / this.game.config.height;
  //
  // 	// Make div full height of browser and keep the ratio of game resolution
  // 	let div = document.getElementById(this.game.config.parent);
  // 	//div.style.width = (window.innerHeight * game_ratio) + 'px';
  // 	//div.style.height = window.innerHeight + 'px';
  //
  // 	// Check if device DPI messes up the width-height-ratio
  // 	let canvas = document.getElementsByTagName('canvas')[0];
  //
  // 	let dpi_w = (parseInt(div.style.width) / canvas.width);
  // 	let dpi_h = (parseInt(div.style.height) / canvas.height);
  //
  // 	let height = parseInt(div.style.height) * (dpi_w / dpi_h);
  // 	let width = height * 0.6;
  //     console.log(width, height);
  // 	canvas.style.width = width + 'px';
  // 	canvas.style.height = height + 'px';
  // }

  create() {
    this.ready = true;
    //this.resizeApp();
  }

  populate() {
    if (this.world) {

      for (var i = 0; i < this.data.objects.length; i++) {
        var obj = this.data.objects[i];
        var objPos = this.world.getTileAt(obj.position.x, obj.position.y, true,
          this.world.worldLayers.find((ln) => {
            if (ln.width === this.world.widthInPixels &&
              ln.height === this.world.heightInPixels) {
              return ln;
            }
          }));
        var hasGraphics = obj.hasOwnProperty('graphics');

        var object;
        if (obj.type === "controllable") {
          object = new ControllableObject(obj.id, this, objPos.pixelX,
            objPos.pixelY, obj.graphics.sprite.name);
        } else if (obj.type === "static") {
          //object = new StaticObject();//...................
        }

        if (hasGraphics && obj.graphics.hasOwnProperty('animation')) {
          for (var i = 0; i < obj.graphics.animation.length; i++) {
            var anim = obj.graphics.animation[i];
            this.anims.create({
              key: anim.name,
              frames: this.anims.generateFrameNumbers(obj.graphics.sprite.name,
                {start: anim.firstKey, end: anim.lastKey}),
              frameRate: anim.frameRate,
              repeat: anim.repeat ? -1 : 0
            });
            object.animations[anim.animKey] = anim.name;
          }
        }

        if (obj.hasOwnProperty('behaviors')) {
          for (var i = 0; i < obj.behaviors.length; i++) {
            var behavior = obj.behaviors[i];
            object.behaviors[behavior.type] = behavior.animKey;

            if (behavior.type === "movement") {
              if (behavior.hasOwnProperty('directions')) {
                object.allowedMoveDirections = behavior.directions;
              }
            }
          }
        }
        this.objects.push(object);
      }

      this.ready = true;
    }
  }

  getMainCharacter() {
    return this.getObjectById(0)
  }

  getObjectById(id) {
    for (var i = 0; i < this.objects.length; i++) {
      if (this.objects[i].id === id) {
        return this.objects[i];
      }
    }
    return false;
  }

  reset() {
    for (var i = 0; i < this.objects.length; i++) {
      this.objects[i].reset();
    }
  }

  init(data) {
    this.data = data.data;
  }
}

module.exports = Game;
