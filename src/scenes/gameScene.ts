import Phaser from 'phaser';

const tilesetKey: string = 'base_tiles';

// The name of the tileset in Tiled
const tilesetName: string = 'Room';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
  }

  preload() {
    this.load.image(
      tilesetKey,
      'assets/1_Room_Builder_Office/Room_Builder_Office_16x16.png'
    );

    this.load.tilemapTiledJSON('office-map', 'maps/office.json');
  }

  create() {
    const officeTilemap = this.make.tilemap({ key: 'office-map' });
    officeTilemap.addTilesetImage(tilesetName, tilesetKey);

    for (let i = 0; i < officeTilemap.layers.length; i++) {
      const layer = officeTilemap.createLayer(i, tilesetName, 0, 0);
      layer.setDepth(i);
      layer.scale = 3;
    }

    //this.add.image(0, 0, 'tiles');

    console.log(officeTilemap);
  }
}
