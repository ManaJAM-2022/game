import { GridEngine } from 'grid-engine';
import Phaser from 'phaser';

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;

const configuration: Phaser.Types.Core.GameConfig = {
  title: 'Diary of an intern',
  type: Phaser.AUTO,
  parent: 'game',
  scale: {
    width: CANVAS_WIDTH,
    height: CANVAS_HEIGHT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
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
