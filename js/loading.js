import Phaser from 'phaser'
import config from './config'

export default class extends Phaser.State {
  init () {}

  preload () {
    //this.scale.pageAlignHorizontally = true;
      
    this.load.audio('gameaudio', '../assets/POL-chubby-cat-short.mp3');
    this.load.audio('shoot', '../assets/Shoot.mp3');
    this.load.audio('jump', '../assets/Jump.mp3');
    this.load.audio('hurt', '../assets/Hurt.mp3');

    this.load.spritesheet("levels", "../assets/levels.png", config.thumbWidth, config.thumbHeight);
    this.load.spritesheet("level_arrows", "../assets/level_arrows.png", 48, 48);

    this.load.image('background', '../assets/meadowUp.jpg');
    this.load.image('ground', '../assets/meadowDown.jpg');
    this.load.atlas('tigerball', '../assets/gumcode.png', '../assets/gumcode.json');
    this.load.image('piecestart', '../assets/start.png');
    this.load.spritesheet('pieces', '../assets/pieces.png', 112, 80);
    this.load.spritesheet('refresh', '../assets/refresh.png', 50, 50);
    this.load.spritesheet('play', '../assets/play.png', 84, 84);
    this.load.image('goal', '../assets/goal.png');
    //this.load.bitmapFont('eightbitwonder', '../assets/eightbitwonder.png', '../assets/eightbitwonder.fnt');
    this.load.bitmapFont('eightbitwonder', '../assets/font.png', '../assets/font.fnt');
    //this.load.image('stone', '../assets/roundstone.png');
    this.load.spritesheet('stone', '../assets/roundstone2.png',200,220);
    this.load.spritesheet('nextlevel', '../assets/nextbutton.png', 50, 50);
    this.load.spritesheet('menubutton', '../assets/menu.png', 50, 50);
    this.load.image('3starts', '../assets/3starts.png'); 
    this.load.image('canon', '../assets/canon.png'); 
    this.load.image('canonball', '../assets/canonball.png'); 
    this.load.spritesheet('beartrap', '../assets/bearstrap.png',88,67);
    this.load.spritesheet('soundbutton', '../assets/sound.png', 50, 50);
    this.load.spritesheet('playgame', '../assets/playgamebutton.png', 209, 107);
    this.load.image('title','../assets/title.png');
  }

  create () {
    this.state.start('level1')
  }
}  