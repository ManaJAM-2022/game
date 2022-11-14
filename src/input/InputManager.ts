import { Direction } from 'grid-engine';

export default class InputManager {
  private scene: Phaser.Scene;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  public getMoveDirection() {
    const cursors = this.scene.input.keyboard.createCursorKeys();
    const wasd: Record<any, { isDown: boolean }> = this.scene.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
    }) as any;

    const up = cursors.up.isDown || wasd.up.isDown;
    const down = cursors.down.isDown || wasd.down.isDown;
    const left = cursors.left.isDown || wasd.left.isDown;
    const right = cursors.right.isDown || wasd.right.isDown;

    if (up && !down && !left && !right) {
      return Direction.UP;
    }
    if (!up && down && !left && !right) {
      return Direction.DOWN;
    }
    if (!up && !down && left && !right) {
      return Direction.LEFT;
    }
    if (!up && !down && !left && right) {
      return Direction.RIGHT;
    }

    return Direction.NONE;
  }
}