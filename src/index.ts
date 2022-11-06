import Phaser from 'phaser';
import configuration from './config';
import GameScene from './scenes/gameScene';

const game = new Phaser.Game(Object.assign(configuration, { scene: [GameScene] }));
