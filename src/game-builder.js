/**
* @fileoverview Phaser Auto GameBuilder
* @author azanbertre@gmail.com (Pedro Borges)
*/
'use strict';

const World = require('./world');
const Phaser = require('phaser');

var Game = require('./game');

var getBaseUrl = function() {
    var re = new RegExp(/^.*\//);
    return re.exec(window.location.href);
}
var root = getBaseUrl();

/**
 * @constructor
 */
var GameInstance = function(instanceData) {
    this.title = instanceData.title;
    this.instance = new Phaser.Game(instanceData.config);

    var gameData = instanceData.data || ('game.json');
    if(typeof gameData == "string") {
        GameBuilder.prototype.loadJson(root + gameData, (data) => {
            this.data = data;
            this.instance.scene.add(this.title, Game, true, {data : data});
        });
    } else if (typeof gameData == "object") {
        this.data = gameData;
        this.instance.scene.add(this.title, Game, true, {data : gameData});
    } else {
        throw "Data or data path is invalid.";
    }

    var getSceneAsync = setInterval(() => {
        this.scene = this.instance.scene.scenes.find((elem) => {
            if(elem.scene.key === this.title) {
                return elem;
            }
        });
        if(this.scene) {
            this.scene.scene.restart();
            clearInterval(getSceneAsync);
        }
    }, 100);
}

GameInstance.prototype.refresh = function(data) {
    this.scene = null;
    this.instance.scene.remove(this.title);
    if(data) {
        var gameData = data || ('game.json');
        if(typeof gameData == "string") {
            GameBuilder.prototype.loadJson(root + gameData, (data) => {
                this.data = data;
                this.instance.scene.add(this.title, Game, true, {data : data});
            });
        } else if (typeof gameData == "object") {
            this.data = gameData;
            this.instance.scene.add(this.title, Game, true, {data : gameData});
        } else {
            throw "Data or data path is invalid.";
        }
    } else {
        this.instance.scene.add(this.title, Game, true, {data : this.data});
    }

    var getSceneAsync = setInterval(() => {
        this.scene = this.instance.scene.scenes.find((elem) => {
            if(elem.scene.key === this.title) {
                return elem;
            }
        });
        if(this.scene) {
            this.scene.scene.restart();

            this.buildWorld();
            this.spawnObjects();

            clearInterval(getSceneAsync);
        }
    }, 100);
}

// GameInstance.prototype.resize = function(width, height) {
//     this.waitForScene(() => {
//         this.scene.game.scale.resize(width, height);
//         this.scene.world.scaleLayers(width / (this.scene.world.tileWidth * this.scene.world.width));
//         for (var i = 0; i < this.scene.objects.length; i++) {
//             var obj = this.scene.objects[i];
//             obj.resize(width / (this.scene.world.tileWidth * this.scene.world.width));
//         }
//     });
// }

// /**
//  * Load a GameData json and parse it.
//  * @param {string, Object} gameData Can be a Object with the data or a path string to the JSON file.
//  * @return {Object} GameData json parsed.
//  */
// GameInstance.prototype.replaceGameData = function(gameData) {
//     if(this.data) {
//         var dataPath = (root + path) || (root + 'game.json');
//         GameBuilder.prototype.loadJson(dataPath, (data) => {
//             game = data;
//         });
//         this.data = game;
//         clearInterval(getGameAsync);
//     } else {
//         console.log("Can't replace non-existent data.");
//     }
// }

/**
 * Parse World data to work with Phaser.
 * @param {Object} wData External JSON containing world data.
 */
GameInstance.prototype.buildWorld = function(wData) {
    this.waitForScene(() => {
        if(this.data) {
            var worldData = wData || this.data.world;
            var layers = [];

            var matrix = function(list, collumns) {
                var m = [];
                var i, k = 0;
                for(i = 0, k = -1; i < list.length; i++) {
                    if(i % collumns === 0) {
                        k++;
                        m[k] = [];
                    }
                    m[k].push(list[i]);
                }
                return m;
            }

            for (let i = 0; i < worldData.layers.length; i++) {
                let layer = worldData.layers[i];
                let layerData = new Phaser.Tilemaps.LayerData();

                let tiles = [];
                let layerGrid = matrix(layer.data, layer.width);

                for(let i = 0; i < layer.height; i++) {
                    for(let j = 0; j < layer.width; j++) {
                        tiles.push(new Phaser.Tilemaps.Tile(layerData,
                            layerGrid[i][j], j, i, worldData.tileWidth,
                            worldData.tileHeight, worldData.tileWidth,
                            worldData.tileHeight));
                    }
                }

                layerData.alpha = layer.hasOwnProperty("opacity") ? layer.opacity : 1;
                layerData.data = matrix(tiles, layer.width);
                layerData.height = layer.height;
                layerData.width = layer.width;
                layerData.tileWidth = worldData.tileWidth;
                layerData.tileHeight = worldData.tileHeight;
                layerData.name = layer.name;
                layerData.visible = layer.hasOwnProperty("visible") ? layer.visible : true;
                layerData.x = layer.hasOwnProperty("x") ? layer.x : 0;
                layerData.y = layer.hasOwnProperty("y") ? layer.y : 0;

                layers.push(layerData);
            }

            var mapConfig = {
                'height': worldData.height,
                'width': worldData.width,
                'tileWidth': worldData.tileWidth,
                'tileHeight': worldData.tileHeight,
                'layers': layers
            }

            var mapData = new Phaser.Tilemaps.MapData(mapConfig);
            var layerNames = Array.from(worldData.layers, (val) => val.name);
            var world = null;

            world = new World(this.scene, mapData, layerNames);
            this.scene.world = world;
            this.scene.populate();
            console.log("Populated");
            //this.resize(800, 800);
            console.log("Build World");
        } else {
            throw "Can't build world, check world data.";
        }
    });
}

GameInstance.prototype.spawnObjects = function() {
    this.waitForScene(() => {
        for (var i = 0; i < this.scene.objects.length; i++) {
            var obj = this.scene.objects[i];
            obj.spawn();
        }
        console.log("Spawned Objects");
    });
}

GameInstance.prototype.waitForScene = function(callback) {
    var wait = setInterval(() => {
        console.log("Waiting...");
        if(this.scene && this.scene.ready) {
            console.log("Scene is Ready!");
            clearInterval(wait);
            callback();
        }
    }, 100);
}

/**
 * Create a new auto GameBuilder for phaser.
 * @constructor
 */
var GameBuilder = function() {
    this.gameInstances = [];
}

/**
 * Load any json file by it's path.
 * @param {string} path Path to the json file.
 * @callback callback(JSON) Function callback with JSON object.
 */
GameBuilder.prototype.loadJson = function(path, callback) {
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', path, false);
    xobj.onreadystatechange = function() {
        if(xobj.readyState == 4 && xobj.status == "200") {
            callback(JSON.parse(xobj.responseText));
        }
    };
    xobj.send(null);
}

/**
 * Create a Phaser game instance and start the GAME scene.
 * @param {Object} cfg Phaser configuration object.
 * @param {string, Object} gameData Can be a Object with the data or a path string to the JSON file.
 * @return {GameInstance}
 */
GameBuilder.prototype.newGame = function(cfg, gameData) {
    // Default config
    var config = {
        title: "Game",
        width: 600,
        height: 600,
        pixelArt: true,
        parent: "phaser",
        backgroundColor: "#18216D"
    };

    if(cfg && typeof cfg == "object") {
        for(var key in cfg) {
            config[key] = cfg[key];
        }
    }

    var title = config.title;
    // Test if title exists
    for (var i = this.gameInstances.length-1; i >= 0; i--) {
        var instance = this.gameInstances[i];
        var realTitle = instance.title.substring(0, instance.title.lastIndexOf('-'));
        var titleIndex = instance.title.slice(instance.title.lastIndexOf("-")+1);
        if(realTitle === title && !isNaN(titleIndex)) {
            title = title + "-" + (parseInt(titleIndex)+1);
            console.log("Title already exists, make a new one:", title);
            break;
        }
        else if(instance.title === title){
            title = title+"-1";
            console.log("Title already exists, make a new one:", title);
            break;
        }
    }

    config.title = title;
    var instanceData = {"title": title, "config": config, "data": gameData};
    var gameInstance = new GameInstance(instanceData);
    this.gameInstances.push(gameInstance);
    return gameInstance;
}

/**
 * @return {GameInstance[]}
 */
GameBuilder.prototype.getInstances = function() {
    return this.gameInstances;
}

/**
 * @param {string} title
 */
GameBuilder.prototype.getInstanceByTitle = function(title) {
    for (var i = 0; i < this.gameInstances.length; i++) {
        var gameInstance = this.gameInstances[i];
        if(gameInstance.title === title) {
            return gameInstance;
        }
    }
    return;
}

// // TODO rework
// GameBuilder.prototype.waitForScene = function(callback) {
//     var wait = setInterval(() => {
//         if(this.GAME && this.GAME.preloaded) {
//             console.log('preloaded');
//             clearInterval(wait);
//             callback();
//         }
//     }, 100);
// }
//
// // TODO rework
// GameBuilder.prototype.waitForReady = function(callback) {
//     var wait = setInterval(() => {
//         if(this.GAME && this.GAME.ready) {
//             clearInterval(wait);
//             callback();
//         }
//     }, 100);
// }

// /**
//  * Make everything for you in one function.
//  * @param {string} pathToGameData Path to the gameData JSON.
//  */
// GameBuilder.prototype.createGame = function(pathToGameData) {
//     if(pathToGameData) {
//         var GAMEMAKER = this;
//         GAMEMAKER.loadGameData(pathToGameData);
//         GAMEMAKER.setupGame();
//         GAMEMAKER.buildWorld();
//         GAMEMAKER.spawnObjects();
//     } else {
//         throw "Can't find data path.";
//     }
// }

module.exports = GameBuilder;
