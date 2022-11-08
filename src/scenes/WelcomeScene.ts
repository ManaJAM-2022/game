import Phaser from 'phaser';

export default class WelcomeScene extends Phaser.Scene {
  constructor() {
    super('WelcomeScene');
  }

  create() {
    const logo = this.add.text(325, 70, 'Welcome');
    const helpText = this.add.text(275, 400, 'Click to continue');

    this.tweens.add({
      targets: logo,
      y: 325,
      duration: 1500,
      ease: 'Sine.inOut',
      yoyo: true,
      repeat: -1,
    });
  }

  update() {
    // on click go to GameScene
    if (this.input.activePointer.isDown) {
      this.scene.start('DemoScene');
    }
  }
}
