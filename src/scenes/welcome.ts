import Phaser from 'phaser';

export default class WelcomeScene extends Phaser.Scene {
  constructor() {
    super('WelcomeScene');
  }

  create() {
    const logo = this.add.text(350, 70, 'Welcome');

    this.tweens.add({
      targets: logo,
      y: 350,
      duration: 1500,
      ease: 'Sine.inOut',
      yoyo: true,
      repeat: -1,
    });
  }
}
