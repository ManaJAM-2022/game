import { Direction, GridEngine, GridEngineConfig } from 'grid-engine';
import Phaser from 'phaser';

const tilesetKey: string = 'base_tiles';

// The name of the tileset in Tiled
const tilesetName: string = 'Room';

export default class GameScene extends Phaser.Scene {
  private static readonly SCALE = 2;
  static readonly TILE_SIZE = this.SCALE * 16;
  private gridEngine?: GridEngine;

  constructor() {
    super('GameScene');
  }

  preload() {
    this.load.image(
      tilesetKey,
      'assets/1_Room_Builder_Office/Room_Builder_Office_16x16.png'
    );

    this.load.tilemapTiledJSON('office-map', 'maps/office.json');

    this.load.spritesheet(
      'player',
      'assets/Characters_free/Adam_run_16x16.png',
      {
        frameWidth: 16,
        frameHeight: 32,
      }
    );

    this.load.audio('route1', ['audio/route1.mp3']);
  }

  create() {
    // Map
    const officeTilemap = this.make.tilemap({ key: 'office-map' });
    officeTilemap.addTilesetImage(tilesetName, tilesetKey);

    for (let i = 0; i < officeTilemap.layers.length; i++) {
      const layer = officeTilemap.createLayer(i, tilesetName, 0, 0);
      layer.setDepth(i);
      layer.scale = GameScene.SCALE;
    }

    // Player
    const playerSprite = this.add.sprite(0, 0, 'player');
    playerSprite.setDepth(5);
    playerSprite.scale = GameScene.SCALE;
    this.cameras.main.startFollow(playerSprite);
    this.cameras.main.roundPixels = true;

    const gridEngineConfig: GridEngineConfig = {
      characters: [
        {
          id: 'player',
          sprite: playerSprite,
          walkingAnimationMapping: {
            right: { leftFoot: 1, standing: 2, rightFoot: 3 },
            up: { leftFoot: 6, standing: 7, rightFoot: 10 },
            left: { leftFoot: 13, standing: 14, rightFoot: 15 },
            down: { leftFoot: 19, standing: 20, rightFoot: 22 },
          },
          startPosition: { x: 8, y: 8 },
        },
      ],
    };

    this.gridEngine?.create(officeTilemap, gridEngineConfig);

    const music = this.sound.add('route1', { loop: true });
    music.play();
  }

  public update(_time: number) {
    const cursors = this.input.keyboard.createCursorKeys();
    if (cursors.left.isDown) {
      this.gridEngine?.move('player', Direction.LEFT);
    } else if (cursors.right.isDown) {
      this.gridEngine?.move('player', Direction.RIGHT);
    } else if (cursors.up.isDown) {
      this.gridEngine?.move('player', Direction.UP);
    } else if (cursors.down.isDown) {
      this.gridEngine?.move('player', Direction.DOWN);
    }
  }
}
