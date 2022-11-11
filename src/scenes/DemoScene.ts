import CharacterAdamSpritesheet from '../assets/Characters_free/Adam_run_16x16.png';
import GameScene from './GameScene';

export default class DemoScene extends GameScene {
  constructor() {
    super('DemoScene', 'office-map');
  }

  preload() {
    super.preload();
    this.load.spritesheet('npc1', CharacterAdamSpritesheet, {
      frameWidth: 16,
      frameHeight: 32,
    });
    this.load.spritesheet('npc2', CharacterAdamSpritesheet, {
      frameWidth: 16,
      frameHeight: 32,
    });
  }

  create() {
    super.create();
    const npc = this.createNPC('npc1', { x: 5, y: 5 });
    this.gridEngine.moveRandomly(npc.id, getRandomInt(1000, 3500));

    const npc2 = this.createNPC('npc2', { x: 10, y: 10 });
    this.gridEngine.follow(npc2.id, 'player', 2, true);
    this.gridEngine.moveRandomly(npc.id, getRandomInt(50, 1500));
  }
}

function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
