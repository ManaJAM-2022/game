import Phaser from 'phaser';
import config from './config';
import BossRoom from './scenes/boss_room';

new Phaser.Game(
  Object.assign(config, {
    scene: [BossRoom],
  })
);
