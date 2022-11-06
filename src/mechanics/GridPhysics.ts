import { Player } from '../characters/Player';
import GameScene from '../scenes/GameScene';
import { Direction } from './Direction';

export class GridPhysics {
  private readonly speedPixelsPerSecond: number = GameScene.TILE_SIZE * 4;

  private movementDirection: Direction = Direction.NONE;
  private lastMovementIntent = Direction.NONE;

  private movementDirectionVectors: {
    [key in Direction]?: Phaser.Math.Vector2;
  } = {
    [Direction.UP]: Phaser.Math.Vector2.UP,
    [Direction.DOWN]: Phaser.Math.Vector2.DOWN,
    [Direction.LEFT]: Phaser.Math.Vector2.LEFT,
    [Direction.RIGHT]: Phaser.Math.Vector2.RIGHT,
  };

  private tileSizePixelsWalked: number = 0;

  constructor(
    private player: Player,
    private tileMap: Phaser.Tilemaps.Tilemap
  ) {}

  update(delta: number): void {
    if (this.isMoving()) {
      this.updatePlayerPosition(delta);
    }

    this.lastMovementIntent = Direction.NONE;
  }

  movePlayer(direction: Direction): void {
    this.lastMovementIntent = direction;
    if (this.isMoving()) return;
    if (this.isBlockingDirection(direction)) {
      this.player.stopAnimation(direction);
    } else {
      this.startMoving(direction);
    }
  }

  private isMoving(): boolean {
    return this.movementDirection != Direction.NONE;
  }

  private startMoving(direction: Direction): void {
    this.player.startAnimation(direction);

    this.movementDirection = direction;

    this.updatePlayerTilePosition();
  }

  private stopMoving(): void {
    this.player.stopAnimation(this.movementDirection);

    this.movementDirection = Direction.NONE;
  }

  private updatePlayerPosition(delta: number) {
    const pixelsToWalkThisUpdate = this.getPixelsToWalkThisUpdate(delta);

    if (!this.willCrossTileBorderThisUpdate(pixelsToWalkThisUpdate)) {
      this.movePlayerSprite(pixelsToWalkThisUpdate);
    } else if (this.shouldContinueMoving()) {
      this.movePlayerSprite(pixelsToWalkThisUpdate);
      this.updatePlayerTilePosition();
    } else {
      this.movePlayerSprite(GameScene.TILE_SIZE - this.tileSizePixelsWalked);
      this.stopMoving();
    }
  }

  private movePlayerSprite(pixelsToMove: number) {
    const directionVec =
      this.movementDirectionVectors[this.movementDirection].clone();
    const movementDistance = directionVec.multiply(
      new Phaser.Math.Vector2(pixelsToMove)
    );
    const newPlayerPos = this.player.getPosition().add(movementDistance);
    this.player.setPosition(newPlayerPos);

    this.tileSizePixelsWalked += pixelsToMove;
    this.tileSizePixelsWalked %= GameScene.TILE_SIZE;
  }

  private willCrossTileBorderThisUpdate(
    pixelsToWalkThisUpdate: number
  ): boolean {
    return (
      this.tileSizePixelsWalked + pixelsToWalkThisUpdate >= GameScene.TILE_SIZE
    );
  }

  private shouldContinueMoving(): boolean {
    return (
      this.movementDirection == this.lastMovementIntent &&
      !this.isBlockingDirection(this.lastMovementIntent)
    );
  }

  private getPixelsToWalkThisUpdate(delta: number): number {
    const deltaInSeconds = delta / 1000;
    return this.speedPixelsPerSecond * deltaInSeconds;
  }

  private updatePlayerTilePosition() {
    this.player.setTilePosition(
      this.player
        .getTilePosition()
        .add(this.movementDirectionVectors[this.movementDirection])
    );
  }

  private isBlockingDirection(direction: Direction): boolean {
    return this.hasBlockingTile(this.tilePosInDirection(direction));
  }

  private tilePosInDirection(direction: Direction): Phaser.Math.Vector2 {
    return this.player
      .getTilePosition()
      .add(this.movementDirectionVectors[direction]);
  }

  private hasBlockingTile(pos: Phaser.Math.Vector2): boolean {
    if (this.hasNoTile(pos)) return true;
    return this.tileMap.layers.some((layer) => {
      const tile = this.tileMap.getTileAt(pos.x, pos.y, false, layer.name);
      return tile && tile.properties.collides;
    });
  }

  private hasNoTile(pos: Phaser.Math.Vector2): boolean {
    return !this.tileMap.layers.some((layer) =>
      this.tileMap.hasTileAt(pos.x, pos.y, layer.name)
    );
  }
}
