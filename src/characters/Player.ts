import CharacterAdamSpritesheet from '../assets/Characters_free/Adam_run_16x16.png';
import { CharacterData} from 'grid-engine';

export default class Player {
  private scene: Phaser.Scene;
  private sprite: Phaser.GameObjects.Sprite;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    
    this.scene.load.spritesheet('player', CharacterAdamSpritesheet, {
      frameWidth: 16,
      frameHeight: 32,
    });

    this.sprite = this.scene.add.sprite(0, 0, 'player');
  }

  public getSprite(): Phaser.GameObjects.Sprite {
    return this.sprite
  }

  public getCharacterData(): CharacterData {
    return {
      id: 'player',
      sprite: this.sprite,
      walkingAnimationMapping: {
        right: { leftFoot: 1, standing: 2, rightFoot: 3 },
        up: { leftFoot: 6, standing: 7, rightFoot: 10 },
        left: { leftFoot: 13, standing: 14, rightFoot: 15 },
        down: { leftFoot: 19, standing: 20, rightFoot: 22 },
      },
      startPosition: { x: 8, y: 8 },
      labels: ['hero'],
    };
  }
}