import { GridEngine, GridEngineConfig, Position } from 'grid-engine';
import Phaser from 'phaser';
import RoomOfficeSpritesheet from '../assets/1_Room_Builder_Office/Room_Builder_Office_16x16.png';
import ModernOfficeSpritesheet from '../assets/3_Modern_Office_Shadowless/Modern_Office_Shadowless_16x16.png';
import CharacterAdamSpritesheet from '../assets/Characters_free/Adam_run_16x16.png';

import officeMapJSON from '../maps/office.json';

import Player from '../characters/Player';
import AudioManager from '../audio/AudioManager';
import InputManager from '../input/InputManager';

const roomTilesetKey: string = 'base_tiles';
const officeTilesetKey: string = 'office_tiles';

// The name of the tileset in Tiled
const roomTilesetName: string = 'Room';
const officeTilesetName: string = 'Office';

const MAP: Record<string, any> = {
  'office-map': officeMapJSON,
};


/**
 * A game / playable scene, this scene would have a player that moves around a map.
 */
export default abstract class GameScene extends Phaser.Scene {
  public static readonly SCALE = 2;
  public readonly TILE_SIZE = GameScene.SCALE * 16;

  protected tilemap: any;
  protected gridEngine: GridEngine| undefined;

  private mapName: string;
  private player: Player | undefined;
  private audioManager: AudioManager | undefined;
  private inputManager: InputManager;

  constructor(sceneKey: string, mapName: string) {
    super(sceneKey);

    this.mapName = mapName;

    this.inputManager = new InputManager(this);
  }

  preload() {
    this.load.image(roomTilesetKey, RoomOfficeSpritesheet);

    this.load.image(officeTilesetKey, ModernOfficeSpritesheet);
    this.load.spritesheet('player', CharacterAdamSpritesheet, {
      frameWidth: 16,
      frameHeight: 32,
    });

    this.load.tilemapTiledJSON(this.mapName, MAP[this.mapName]);

    this.player = new Player(this);
    this.audioManager = new AudioManager(this, this.mapName);
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

    this.setupCamera();

    const gridEngineConfig: GridEngineConfig = {
      characters: [
        this.player!.getCharacterData(),
      ],
    };

    this.gridEngine!.create(this.tilemap, gridEngineConfig);

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

    this.audioManager?.setupMusic();
  }

  public update(_time: number) {
    const moveDirection = this.inputManager.getMoveDirection();
    this.gridEngine?.move('player', moveDirection);

    // TODO:
    // Get action from input manager
    // Call NPC update method with action, player facing position
  }

  protected getInteractable(charId: string) {
    const facingPosition = this.gridEngine!.getFacingPosition(charId);
    const npc = this.gridEngine!.getCharactersAt(
      facingPosition,
      this.gridEngine!.getCharLayer(charId) ?? 'undefined'
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

    this.gridEngine!.addCharacter({
      id: label,
      sprite: npc,
      startPosition,
    });

    return { id: label, sprite: npc };
  }

  private setupCamera(): void {
    this.cameras.main.startFollow(this.player!.getSprite());
    this.cameras.main.setFollowOffset(
      -this.player!.getSprite().width,
      -this.player!.getSprite().height
    );
    this.cameras.main.fadeIn(1000);
  }
}
