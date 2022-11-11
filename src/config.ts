import { GridEngine } from 'grid-engine';
import Phaser from 'phaser';

const configuration: Phaser.Types.Core.GameConfig = {
  parent: 'game',
  type: Phaser.AUTO,
  title: 'Diary of an intern',
  width: window.innerWidth,
  height: window.innerHeight,
  pixelArt: true,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false,
    },
  },
  plugins: {
    scene: [
      {
        key: 'gridEngine',
        plugin: GridEngine,
        mapping: 'gridEngine',
      },
    ],
  },
};

export default configuration;
