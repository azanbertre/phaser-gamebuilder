# Phaser GameBuilder

Phaser **GameBuilder** is a tool to make simples top down games on the Phaser game engine using only data from a **.json** file.

## Installation

Clone the repository and use ```npm install``` to install all of the dependencies. To create a usable **.js** file just use:

```bash
npm run compile
```
The file will be found on the **dist** folder.

## Usage

To check the demo just use ```npm run demo``` or ```npm run demo-reload``` to auto compile project when changes are made. 
Page will be running on **```http://localhost:8080```**.
```javascript
const Builder = new GameBuilder(); // Initialize a new game builder.
const Game = builder.newGame({title: 'Game', parent: 'phaser'}, 'game.json'); // Create an instance of a game.
Game.buildWorld(); // Generate the map defined on the json.
Game.spawnObjects(); // Spawn all of the objects defined on the json.

// This returns the main object of the game [Game] and calls the behavior 'move' on it.
Game.scene.getMainCharacter().call('move');

// Objects have shared behaviors, so if the behavior exists on the behaviors folder it can be called.
Game.scene.getMainCharacter().call('turn')
// Objects can be get by their ID's too.
Game.scene.getObjectById().call('turn')
```


