import Phaser from 'phaser'
import config from './config'

export default class extends Phaser.State {
  init () {
    this.tigerball;
    this.action;
    this.actionstone;
    this.startx;
    this.starty;
    this.distance;
    this.time;
    this.JASON_prefix;
    this.start;
    this.piecestart;
    this.dropdesviation;
    this.piecesgroup;
    this.scalepieces;
    this.defaultWalkValue;
    this.goaldistance;
    this.piecestartx;
    this.piecestarty;
    this.piecesx;
    this.piecesy;
    this.spr_bg2;
    this.refresh;
    this.piece;
    this.piecequantity;
    this.WaitTimer;
    this.nextInstruction;
    this.Waiting;
    this.ground;
    this.stone;
    this.startcrunch;
    this.dead;
    this.menu;
    this.nextlevel;
    this.style;
    this.result;
    this.musicsound;
    this.shootsound;
    this.jumpsound;
    this.hurtsound;
    this.levelcomplete;
    this.trestarts;
  }
    
  preload () {}

  create () {
       this.startx = 50;
        this.starty = 270;
        this.distance = 100; //walk
        this.time = 1000; //px for unit to walk
         this.JASON_prefix = 'ikNode_13';
        this.dropdesviation = 30; //distanca or presicion to drop de this.pieces at the queue
        this.scalepieces = 0.5;
        this.defaultWalkValue = 6;
        this.goaldistance = 180;
       this.piecestartx = 50;
       this.piecestarty = 430;
        this.piecesx = 55;
        this.piecesy = 530;
        this.piece = new Array();
        this.piecequantity = [1,1,0,0,0,0];
        this.WaitTimer = 0;
        this.Waiting = false;
        this.dead = false;
        this.style = {
			font: "bold 46px verdana",
			fill: "#ffffff",
            strokeThickness: 2
		};
        
       this.game.physics.startSystem(Phaser.Physics.ARCADE);

        //music
        this.shootsound = this.add.audio('shoot');
        this.shootsound.mute = !config.music;
        this.jumpsound = this.add.audio('jump');
        this.jumpsound.mute = !config.music;
        this.hurtsound = this.add.audio('hurt');
        this.hurtsound.mute = !config.music;
        
        //game.stage.backthis.groundColor = '#000000';

       this.game.add.image(0, 0, 'background');
       this.game.physics.arcade.gravity.y = 100;
        //this.ground =this.game.add.sprite(0, 369, 'this.ground');
        this.ground =this.game.add.sprite(0, 369, 'ground');

        //this.ground.anchor.setTo(0,0);
       this.game.physics.arcade.enable(this.ground);
        this.ground.body.immovable = true;
        this.ground.body.moves = false;
        //this.ground.enableBody = true;
        this.ground.body.width =this.game.world.width;

        this.stone =this.game.add.sprite(400, 195, 'stone');
        this.stone.animations.add('rollstone', [0,1,2,3,4,5,6,7], 15, true);
        this.stone.anchor.setTo(0.5, 0.5);
       this.game.physics.arcade.enable(this.stone);
        this.stone.enableBody = true;
        //this.stone.body.bounce.y = 0.2;
        this.stone.body.moves = false;
        this.stone.checkWorldBounds = true;
        this.resetRock = this.resetRock.bind(this);
        this.stone.events.onOutOfBounds.add(this.resetRock, this);
        this.setstonePosition();
        
        var goal =this.game.add.image (game.world.width-this.goaldistance+50, this.starty-60, 'goal');
        
        //game.world.height
       this.tigerball =this.game.add.sprite(this.startx, this.starty, 'tigerball');
       this.tigerball.anchor.setTo(0.5, 0.5);
       this.game.physics.arcade.enable(this.tigerball);
       this.tigerball.body.collideWorldBounds = true;
       this.tigerball.body.bounce.y = 0.2;
       this.tigerball.enableBody = true;
        //tigerball.body.moves = false;
       this.tigerball.animations.add('quiet', [ this.JASON_prefix+'0000'], 1, false);
       this.start = this.tigerball.animations.add('start', Phaser.Animation.generateFrameNames( this.JASON_prefix, 0, 2, '', 4), 24, false);
       this.tigerball.animations.add('walk', Phaser.Animation.generateFrameNames( this.JASON_prefix, 3, 19, '', 4), 24, true);
       this.tigerball.animations.add('stop', Phaser.Animation.generateFrameNames( this.JASON_prefix, 20, 23, '', 4), 24, false);
       this.tigerball.animations.add('jump', Phaser.Animation.generateFrameNames( this.JASON_prefix, 24, 37, '', 4), 24, false);
        this.startcrunch =this.tigerball.animations.add('startcrunch', Phaser.Animation.generateFrameNames( this.JASON_prefix, 38, 39, '', 4), 24, false);
       this.tigerball.animations.add('crunch', Phaser.Animation.generateFrameNames( this.JASON_prefix, 40, 47, '', 4), 24, true);
       this.tigerball.animations.add('stopcrunch', Phaser.Animation.generateFrameNames( this.JASON_prefix, 49, 50, '', 4), 24, false);
       this.tigerball.animations.add('dead', [ this.JASON_prefix+'0051'], 1, false);
      //this.walkanimation = this.walkanimation.bind(this);
        this.start.onComplete.add(this.walkanimation,this);
        this.startcrunch.onComplete.add(this.crunchanimation,this);
       this.tigerball.animations.play('quiet');

        this.drawComander();

        //this.pieces
        this.piecesgroup =this.game.add.group();
       this.piecestart =this.game.add.image(this.piecestartx,this.piecestarty, 'piecestart');
        //this.piecestart.anchor.setTo(0.5, 1);
       this.game.physics.arcade.enable(this.piecestart);
        this.placepieces(false);

        this.Waiting = false;

        //buttons
        this.nextInstruction = 0;
        var button =this.game.add.button(game.world.width - 140, 455, 'play', this.playCode, this, 2, 1, 0);
        this.shadow();
        this.nextlevel =this.game.add.button(game.world.width - 190, 30, 'nextlevel', this.gotonextlevel, this, 2, 1, 0);
        this.nextlevel.kill();
        this.refresh =this.game.add.button(game.world.width - 130, 30, 'refresh', this.restart, this, 2, 1, 0);
        this.menu =this.game.add.button(game.world.width - 70, 30, 'menubutton', this.menu, this, 2, 1, 0);
        //game.camera.follow(this.tigerball);
        this.levelcomplete =this.game.add.text(165,240,"LEVEL COMPLETE",this.style);
        this.levelcomplete.kill();
        this.trestarts =this.game.add.image(250, 110, "3starts");
        this.trestarts.kill();
  }
update (){
       this.game.physics.arcade.collide(this.ground,this.tigerball);
        //game.physics.arcade.collide(this.stone,this.tigerball);
       this.game.physics.arcade.overlap(this.stone,this.tigerball, this.gameover, null, this);
        //this.game.physics.arcade.collide(this.floor, this.YOURSPRITENAME);
        if(!this.dead){
            if(this.tigerball.x >this.game.world.width-this.goaldistance){
                this.levelCompleteF();
            }
            if(this.Waiting &&this.game.time.now > this.WaitTimer){
               this.tigerball.body.velocity.x = 0;
                this.Waiting = false;
                this.playCode();
            }
        }    
    }
  render () {
        if(config.debug){
           this.game.debug.text(this.result, 10, 20);
        }
  }

    resetRock (r) {
        this.result = this.stone.y;
        if(this.stone.y > (this.game.height+110) && !this.dead) {
            this.setstonePosition();
            this.moveRock();
        }
    }
    placepieces (restart){
        var x = 0;
        for(var i=0;i<config.piecetype.length;i++){
            for (var j=0; j < this.piecequantity[i]; j++){
                if(!restart){
                    this.piece[x] =this.game.add.image( this.piecesx+(x*70), this.piecesy, 'pieces',i);
                }else{
                    this.piece[x].x =this.piecesx+(x*70);
                    this.piece[x].y = this.piecesy;
                    this.piece[x].events.onInputDown.removeAll();
                   this.game.add.existing(this.piece[x]);
                }
                this.piece[x].CustomValue = this.defaultWalkValue;
                //this.piece.anchor.x = 0.5;
                this.piece[x].scale.x = this.scalepieces;
                this.piece[x].scale.y = this.scalepieces;
               this.game.physics.arcade.enable(this.piece[x]);
                this.piece[x].inputEnabled = true;
                this.piece[x].input.enableDrag();
                this.piece[x].originalPosition = this.piece[x].position.clone();
                this.piece[x].events.onDragStop.add(this.stopDrag, this);
                //custom variable
                this.piece[x].customID =config.piecetype[i];
                if(!restart){
                    this.piece[x].customText =this.game.add.bitmapText(this.piece[x].x+30+(x*70), this.piece[x].y+20, 'eightbitwonder', "", 24);
                    this.piece[x].customText.scale.x=0.8;
                    this.piece[x].customText.scale.y=0.8;
                }else{
                    this.piece[x].customText.x = this.piece[x].x+30;
                    this.piece[x].customText.y = this.piece[x].y+20;
                    this.piece[x].customText.text = "";
                }
                x++;
            }
        }
    }
    walkanimation () {    
       this.tigerball.animations.play('walk');
    }
    crunchanimation () {    
       this.tigerball.animations.play('crunch');
    }
    startWalk (){
       this.tigerball.animations.play('start'); 
    }   
    stopWalk (){
       this.tigerball.animations.play('stop'); 
    }
    startCrouch (){
       this.tigerball.animations.play('startcrunch'); 
    }
    stopCrouch (){
       this.tigerball.animations.play('stopcrunch'); 
    }
    restart (){
        //text = "this.refreshing";
        if(this.action != undefined){
           this.action.stop();
        }
        if(this.actionstone != undefined){
           this.actionstone.stop();
        }
       this.tigerball.animations.stop();
       this.tigerball.animations.play('quiet');
        this.dead = false;
       this.tigerball.x =this.startx;
       this.tigerball.y = this.starty;
        this.spr_bg2.alpha = 0;  
        this.nextInstruction = 0;
        this.setstonePosition();
        this.nextlevel.kill();
        this.levelcomplete.kill();
        this.trestarts.kill();
        this.placepieces(true);
    }
    setstonePosition (){
        this.stone.scale.x = 0.1;
        this.stone.scale.y = 0.1;
        this.stone.alpha = 0;
        this.stone.x = 400;
        this.stone.y = 185;
    }
    stopDrag (currentSprite, endSprite){
        var piecestartDrag;
        if(this.piecesgroup.length>0){
           this.piecestartDrag = this.piecesgroup.children[this.piecesgroup.length-1];
        }else{
           this.piecestartDrag =this.piecestart;
        }
        if(currentSprite.x >this.piecestartDrag.x+this.piecestartDrag.width-this.dropdesviation-20 && currentSprite.x <this.piecestartDrag.x+this.piecestartDrag.width+this.dropdesviation-20 && currentSprite.y >this.piecestartDrag.y-this.dropdesviation && currentSprite.y <this.piecestartDrag.y+this.dropdesviation){
        //if(this.game.physics.arcade.overlap(currentSprite,this.piecestartDrag)){
            currentSprite.input.draggable = false;
            currentSprite.events.onInputDown.add(this.onTouchpiece, this);
            currentSprite.scale.x = 1;
            currentSprite.scale.y = 1;
            currentSprite.x =this.piecestartDrag.x + 89; 
            currentSprite.y =this.piecestartDrag.y; 
            currentSprite.anchor.setTo(this.piecestartDrag.anchor.x,this.piecestartDrag.anchor.y); 
            this.piecesgroup.add(currentSprite);
            currentSprite.customText.x = currentSprite.x+50;
            currentSprite.customText.y =currentSprite.y+55;
            currentSprite.customText.text = currentSprite.CustomValue;
        }else{
            currentSprite.position.copyFrom(currentSprite.originalPosition);
            //this.piecesgroup.remove(currentSprite);
        }
    }
    moveRock (){
        this.stone.alpha = 1;
       this.actionstone =this.game.add.tween(this.stone).to({y:900}, 9000, Phaser.Easing.Quadratic.InOut, true, 0);
       this.game.add.tween(this.stone.scale).to({x:1, y:1}, 4000, Phaser.Easing.Quadratic.InOut, true, 0);
        this.stone.animations.play('rollstone');
    }
    playCode (){
        if(!this.dead){
            if(this.nextInstruction==0 && this.piecesgroup.length > 0){
                this.moveRock();
            }

            while(!this.Waiting && this.nextInstruction < this.piecesgroup.length){
                var item = this.piecesgroup.children[this.nextInstruction];
                switch(item.customID){
                    case config.piecetype[0]:
                        this.walk(item.CustomValue);
                        break;
                    case config.piecetype[1]:
                        this.wait(item.CustomValue);
                        break;
                    case config.piecetype[2]:
                        this.jump(item.CustomValue);
                        break;
                    case config.piecetype[3]:
                        this.crouch(item.CustomValue);
                        break;
                    case config.piecetype[4]:
                        this.loop(item.CustomValue);
                        break;
                    case config.piecetype[5]:
                        this.endloop(i);
                        break;                
                }
                this.nextInstruction++;
            }
        }
    }
    onTouchpiece (currentSprite){
        var distance = prompt("Enter value [1-9]", currentSprite.CustomValue);
        currentSprite.CustomValue = parseInt(distance);
        if (!Number.isInteger(currentSprite.CustomValue) || currentSprite.CustomValue > 9){
            currentSprite.CustomValue = this.defaultWalkValue;
        }
        currentSprite.customText.text = currentSprite.CustomValue;
    }
    shadow (){
        this.spr_bg2 = this.game.add.graphics(0, 0);   
        this.spr_bg2.alpha = 0;  
        this.spr_bg2.beginFill('#ffffff', 1);   
        this.spr_bg2.drawRect(0, 0, this.game.width, this.game.height);        
        this.spr_bg2.endFill(); 
    }
    drawComander (){
        var spr_bg = this.game.add.graphics(0, 400);        
        spr_bg.beginFill('#ffffff', 1);   
        spr_bg.alpha = 0.5;  
        spr_bg.drawRect(0, 0, this.game.width, 200);        
        spr_bg.endFill(); 
    }
    walk (times){
        this.Waiting = true; 
        this.WaitTimer =this.game.time.now + ((this.time)*times);    
       this.action =this.game.add.tween(this.tigerball).to({x:this.tigerball.x + (this.distance*times)}, this.time*times, Phaser.Easing.Quadratic.InOut, true, 0);
       this.action.onStart.add(this.startWalk,this);
       this.action.onComplete.add(this.stopWalk,this);
    }
    wait (times){
        this.Waiting = true; 
        this.WaitTimer =this.game.time.now + (this.time*times);
    }
    jump (times){
        this.jumpsound.play();
        this.Waiting = true; 
        //player.body.onFloor() &&this.game.time.now > jumpTimer)
       this.tigerball.body.velocity.y = -30*(times);
       this.tigerball.body.velocity.x = 10*(times);
        this.WaitTimer =this.game.time.now + (600*times);
       this.tigerball.animations.play('jump');
    }
    crouch (times){
        //this.Waiting = true; 
        //this.WaitTimer =this.game.time.now + (this.time*times);    
       this.action =this.game.add.tween(this.tigerball).to({x:this.tigerball.x + (this.distance*times)}, this.time*times, Phaser.Easing.Quadratic.InOut, true, 0);
       this.action.onStart.add(this.startCrouch,this);
       this.action.onComplete.add(this.stopCrouch,this);
    }
    loop (times){
        //anthing    
    }
    endloop (position){
        var begin = position;
        var foundloop = false;
        while(begin > 0 && !foundloop){
            if (this.piecesgroup.children[begin].customID == 'loop' && this.piecesgroup.children[begin].CustomValue > 0){
                foundloop = true;
            }else{
                begin--;        
            }
        }
        if(foundloop){
            this.piecesgroup.children[begin].CustomValue--;
            this.nextInstruction = begin;
            this.playCode();
        }
    }
    gameover (){
        //this.result =tigerball.y +" "+ this.stone.y;
        if(this.tigerball.x < this.stone.x+100 &&this.tigerball.x > this.stone.x-100 &&this.tigerball.y < this.stone.y+80 &&this.tigerball.y > this.stone.y-80){
            this.hurtsound.play();
            this.dead = true;
           this.tigerball.animations.play('dead');    
           this.action.stop();
            this.Waiting = false;
            this.spr_bg2.alpha = 0.5;
            //game.world.bringToTop(this.refresh);
            //game.world.bringToTop(this.menu);
            //tigerball.kill();
        }
    }
    levelCompleteF (){
        this.spr_bg2.alpha = 0.5;
        //game.world.bringToTop(this.refresh);
        this.nextlevel.revive();
        this.levelcomplete.revive();
        this.trestarts.revive();
        
        //put this.starts to gloval
       config.starsArray[config.level-1] = 3;
		// if we completed a level and next level is locked - and exists - then unlock it
		if(config.starsArray[config.level]==4 &&config.level<config.starsArray.length){
			config.starsArray[config.level] = 0;	
            config.level++;
		}
        this.savegame();
    }
    savegame (){
        localStorage.clear();
        localStorage.setItem("save", JSON.stringify(config.starsArray));
    }
    menu (){
       this.game.state.start("LevelSelect");
    }
    gotonextlevel (){
		// back to level selection
		game.state.start("LevelSelect");
    }
}
  
