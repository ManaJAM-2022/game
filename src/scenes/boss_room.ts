import Phaser from 'phaser';

export default class BossRoom extends Phaser.Scene {
  constructor() {
    super('BossRoom');
  }

  preload() {
    this.load.image('tiles', 'src/assets/6_Office_Designs/Office_Design_1.gif');
    this.load.tilemapTiledJSON('boss_room', 'src/assets/boss_room.json');
  }

  create() {
    const map = this.make.tilemap({ key: 'boss_room' });
    const tileset = map.addTilesetImage(
      'Office_Design_1',
      'tiles',
      32,
      32,
      0,
      0
    );
    const layer1 = map.createStaticLayer('Tile Layer 1', tileset, 0, 0);
  }
}
