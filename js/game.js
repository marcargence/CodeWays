import 'pixi'
import 'p2'
import Phaser from 'phaser'

import loading from './loading'
import level1 from './level1'
import config from './config'

class Game extends Phaser.Game {
    
  constructor () {
    /*const docElement = document.documentElement
    const width = docElement.clientWidth > config.gameWidth ? config.gameWidth : docElement.clientWidth
    const height = docElement.clientHeight > config.gameHeight ? config.gameHeight : docElement.clientHeight*/

    super(800, 600, Phaser.CANVAS, 'content', null)

    if(localStorage.getItem("save")){
        config.starsArray = JSON.parse(localStorage.getItem("save"));
        while(config.starsArray[config.level-1]>0){
            config.level++;
        }
    }

    this.state.add("Loading", loading)
    this.state.add("level1", level1)
    //game.state.add("menu", menu)
    //game.state.add("LevelSelect", levelSelect)
    //config.level = 1;
    /*for(var i=1;i<=config.starsArray.length;i++){
        this.state.add("level"+i, eval("level"+i));
    }*/

    this.state.start("Loading")
  }
}

window.game = new Game()
