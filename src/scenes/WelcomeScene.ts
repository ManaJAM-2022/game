import Phaser from 'phaser';

export default class WelcomeScene extends Phaser.Scene {
  constructor() {
    super('WelcomeScene');
  }

  create() {
    
    const screenCenterX =
      this.cameras.main.worldView.x + this.cameras.main.width / 2;
    const screenCenterY =
      this.cameras.main.worldView.y + this.cameras.main.height / 2;

    const logo = this.add
      .text(screenCenterX, 70, 'Diary of an intern')
      .setOrigin(0.5);
    this.add.text(screenCenterX, 400, 'Click to continue').setOrigin(0.5);

    this.tweens.add({
      targets: logo,
      y: screenCenterY,
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
