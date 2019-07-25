const GameObject = require('./gameobject');

class StaticObject extends GameObject {
    constructor(id, scene, pixelX, pixelY) {
        super(id, scene, pixelX, pixelY);


    }
}

module.exports = StaticObject;
