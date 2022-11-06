import { Direction } from '../mechanics/Direction';
import GameScene from '../scenes/GameScene';

export class Player {
  constructor(
    private sprite: Phaser.GameObjects.Sprite,
    private tilePos: Phaser.Math.Vector2
  ) {
    const offsetX = GameScene.TILE_SIZE / 2;
    const offsetY = GameScene.TILE_SIZE;

    this.sprite.setOrigin(0.5, 1);
    this.sprite.setPosition(
      tilePos.x * GameScene.TILE_SIZE + offsetX,
      tilePos.y * GameScene.TILE_SIZE + offsetY
    );

    this.sprite.setFrame(3);
  }

  getPosition(): Phaser.Math.Vector2 {
    return this.sprite.getBottomCenter();
  }

  setPosition(position: Phaser.Math.Vector2): void {
    this.sprite.setPosition(position.x, position.y);
  }

  startAnimation(direction: Direction) {
    this.sprite.anims.play(direction);
  }

  stopAnimation(direction: Direction) {
    // This logic is supposed to reset the animation to the standing position
    // BUG: standing position for up/down animations is not in this row of the sprite
    const animationManager = this.sprite.anims.animationManager;
    const standingFrame = animationManager.get(direction).frames[1].frame.name;
    this.sprite.anims.stop();
    this.sprite.setFrame(standingFrame);
  }

  getTilePosition(): Phaser.Math.Vector2 {
    return this.tilePos.clone();
  }

  setTilePosition(tilePosition: Phaser.Math.Vector2): void {
    this.tilePos = tilePosition.clone();
  }
}
