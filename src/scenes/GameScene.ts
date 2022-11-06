import Phaser from 'phaser';

import { Player } from '../characters/Player';
import { Direction } from '../mechanics/Direction';
import { GridControls } from '../mechanics/GridControls';
import { GridPhysics } from '../mechanics/GridPhysics';

const tilesetKey: string = 'base_tiles';

// The name of the tileset in Tiled
const tilesetName: string = 'Room';

export default class GameScene extends Phaser.Scene {
  private static readonly SCALE = 2;
  static readonly TILE_SIZE = this.SCALE * 16;

  private gridControls?: GridControls;
  private gridPhysics?: GridPhysics;

  constructor() {
    super('GameScene');
  }

  preload() {
    this.load.image(
      tilesetKey,
      'assets/1_Room_Builder_Office/Room_Builder_Office_16x16.png'
    );

    this.load.tilemapTiledJSON('office-map', 'maps/office.json');

    this.load.spritesheet('player', 'assets/Characters_free/Adam_16x16.png', {
      frameWidth: 16,
      frameHeight: 32,
    });
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

    const player = new Player(playerSprite, new Phaser.Math.Vector2(5, 5));

    // Movement
    this.gridPhysics = new GridPhysics(player, officeTilemap);
    this.gridControls = new GridControls(this.input, this.gridPhysics);

    // Character animations
    this.createPlayerAnimation(Direction.RIGHT, 2 * 24, 2 * 24 + 5);
    this.createPlayerAnimation(Direction.UP, 2 * 24 + 6, 2 * 24 + 11);
    this.createPlayerAnimation(Direction.LEFT, 2 * 24 + 12, 2 * 24 + 17);
    this.createPlayerAnimation(Direction.DOWN, 2 * 24 + 18, 2 * 24 + 23);
  }

  public update(_time: number, delta: number) {
    this.gridControls?.update();
    this.gridPhysics?.update(delta);
  }

  private createPlayerAnimation(
    name: string,
    startFrame: number,
    endFrame: number
  ) {
    this.anims.create({
      key: name,
      frames: this.anims.generateFrameNumbers('player', {
        start: startFrame,
        end: endFrame,
      }),
      frameRate: 10,
      repeat: -1,
      yoyo: true,
    });
  }
}
