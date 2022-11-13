import { Direction, GridEngine, GridEngineConfig } from 'grid-engine';
import Phaser from 'phaser';
import RoomOfficeSpritesheet from '../assets/1_Room_Builder_Office/Room_Builder_Office_16x16.png';
import ModernOfficeSpritesheet from '../assets/3_Modern_Office_Shadowless/Modern_Office_Shadowless_16x16.png';
import CharacterAdamSpritesheet from '../assets/Characters_free/Adam_run_16x16.png';
import route1MP3 from '../audio/route1.mp3';
import officeMapJSON from '../maps/office.json';

const roomTilesetKey: string = 'base_tiles';
const officeTilesetKey: string = 'office_tiles';

// The name of the tileset in Tiled
const roomTilesetName: string = 'Room';
const officeTilesetName: string = 'Office';

const MAP: Record<string, any> = {
  'office-map': officeMapJSON,
};

const MUSIC: Record<string, string[]> = {
  'office-map': [route1MP3],
};

/**
 * A game / playable scene, this scene would have a player that moves around a map.
 */
export default abstract class GameScene extends Phaser.Scene {
  public static readonly SCALE = 2;
  public readonly TILE_SIZE = GameScene.SCALE * 16;

  protected tilemap: any;
  protected gridEngine: GridEngine;

  private mapName: string;

  constructor(sceneKey: string, mapName: string) {
    super(sceneKey);
    this.mapName = mapName;
  }

  preload() {
    this.load.image(roomTilesetKey, RoomOfficeSpritesheet);

    this.load.image(officeTilesetKey, ModernOfficeSpritesheet);
    this.load.spritesheet('player', CharacterAdamSpritesheet, {
      frameWidth: 16,
      frameHeight: 32,
    });

    this.load.tilemapTiledJSON(this.mapName, MAP[this.mapName]);
    this.load.audio(`${this.mapName}_Ambience`, MUSIC[this.mapName]);

    // Load plugins
  }

  create() {
    // Map
    this.tilemap = this.make.tilemap({ key: this.mapName });
    this.tilemap.addTilesetImage(roomTilesetName, roomTilesetKey);
    this.tilemap.addTilesetImage(officeTilesetName, officeTilesetKey);

    for (let i = 0; i < this.tilemap.layers.length; i++) {
      const layer = this.tilemap.createLayer(
        i,
        [roomTilesetName, officeTilesetName],
        0,
        0
      );
      layer.setDepth(i);
      layer.scale = GameScene.SCALE;
    }

    // Player
    const playerSprite = this.add.sprite(0, 0, 'player');
    // playerSprite.setDepth(5);
    playerSprite.scale = GameScene.SCALE;
    this.cameras.main.startFollow(playerSprite);
    this.cameras.main.setFollowOffset(
      -playerSprite.width,
      -playerSprite.height
    );

    const gridEngineConfig: GridEngineConfig = {
      characters: [
        {
          id: 'player',
          sprite: playerSprite,
          walkingAnimationMapping: {
            right: { leftFoot: 1, standing: 2, rightFoot: 3 },
            up: { leftFoot: 6, standing: 7, rightFoot: 10 },
            left: { leftFoot: 13, standing: 14, rightFoot: 15 },
            down: { leftFoot: 19, standing: 20, rightFoot: 22 },
          },
          startPosition: { x: 8, y: 8 },
          labels: ['hero'],
        },
      ],
    };

    this.gridEngine.create(this.tilemap, gridEngineConfig);

    const music = this.sound.add(`${this.mapName}_Ambience`, {
      loop: true,
      volume: 0.1,
    });
    music.play();

    const spaceBar = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );

    spaceBar.on('down', () => {
      const interactable = this.getInteractable('player')!;
      if (interactable) {
        if (typeof interactable === 'string') {
          alert(`${interactable}: Hi... keeping busy?`);
        }
        console.log({ interactable });
      }
    });
    
    this.cameras.main.fadeIn(1000);
  }

  public update(_time: number) {
    const moveDirection = this.getMoveDirection();
    this.gridEngine?.move('player', moveDirection);
  }

  protected getInteractable(charId: string) {
    const facingPosition = this.gridEngine?.getFacingPosition(charId);
    const npc = this.gridEngine.getCharactersAt(
      facingPosition,
      this.gridEngine.getCharLayer(charId) ?? 'undefined'
    );
    if (npc.length > 0) {
      if (npc[0] === charId) {
        return npc[1];
      }
      return npc[0];
    }
    const facingTile = this.tilemap.getTileAt(
      facingPosition.x,
      facingPosition.y,
      true,
      2
    );
    if (facingTile && facingTile.properties['interactable']) {
      return facingTile;
    }
    return null;
  }

  protected createNPC(
    label: string,
    startPosition: Position
  ): { id: string; sprite: Phaser.GameObjects.Sprite } {
    const npc = this.add.sprite(0, 0, label);
    npc.scale = GameScene.SCALE;

    this.gridEngine.addCharacter({
      id: label,
      sprite: npc,
      startPosition,
    });

    return { id: label, sprite: npc };
  }

  private getMoveDirection() {
    const cursors = this.input.keyboard.createCursorKeys();
    const wasd: Record<any, { isDown: boolean }> = this.input.keyboard.addKeys({
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
