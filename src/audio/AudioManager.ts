import { Scene } from 'phaser';
import route1MP3 from '../audio/route1.mp3';
import GameScene from '../scenes/GameScene';

const MUSIC: Record<string, string[]> = {
  'office-map': [route1MP3],
};

export default class AudioManager {
  private scene: GameScene;
  private mapName: string;

  constructor(gameScene: GameScene, mapName: string) {
    this.scene = gameScene;
    this.mapName = mapName;

    this.scene.load.audio(`${mapName}_Ambience`, MUSIC[mapName]);
  }

  public setupMusic(): void {
    const music = this.scene.sound.add(`${this.mapName}_Ambience`, {
      loop: true,
      volume: 0.1,
    });
    music.play();
  }
}