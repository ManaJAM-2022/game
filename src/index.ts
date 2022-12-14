import Phaser from 'phaser';
import configuration from './config';
import DemoScene from './scenes/DemoScene';
import WelcomeScene from './scenes/WelcomeScene';

const game = new Phaser.Game(
  Object.assign(configuration, { scene: [WelcomeScene, DemoScene] })
);
