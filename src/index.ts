import Phaser from 'phaser';
import config from './config';
import WelcomeScene from './scenes/welcome';

new Phaser.Game(
  Object.assign(config, {
    scene: [WelcomeScene],
  })
);
