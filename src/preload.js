var fs = require('fs');
var obj;

fs.readFile('file', 'utf8', function(err, data) {
    if(err) throw err;
    obj = JSON.parse(data);
})

var Preload = function() {
    Phaser.scene.call(this, {key: 'Preload'});
}

Preload.prototype.preload() {

    this.scene.start('Game');
}
