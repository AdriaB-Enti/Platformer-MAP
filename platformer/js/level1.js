var platformer = platformer || {};

platformer.level1 ={
    init:function(){
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.setGameSize(gameOptions.gameWidth/2,gameOptions.gameHeight/2);   
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;
        
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.game.physics.arcade.gravity.y = gameOptions.heroGravity; this.game.world.setBounds(0,0,gameOptions.level1Width,gameOptions.level1Height);
    },
    preload:function(){
        this.load.image('bg','img/bg_green_tile.png');
        this.load.tilemap('level1','tilemaps/level1.json',null,Phaser.Tilemap.TILED_JSON);
        this.load.image('walls','img/walls.png');
        this.load.image('moss','img/moss.png');
        this.load.spritesheet('hero','img/hero.png',32,32);
        this.load.image('entry','img/spr_door_closed_0.png');
        this.load.spritesheet('jumper','img/jumper.png',32,32);
        this.load.spritesheet('slime','img/slime.png',32,32);
        this.load.spritesheet('energy','img/energy.png',128,28);
        this.load.image('gemUI','img/spr_gui_gem_0.png');
        
        this.game.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');
        
      },
    create:function(){
        this.bg = this.game.add.tileSprite(0,0,gameOptions.level1Width,gameOptions.level1Height,'bg');
        this.map = this.game.add.tilemap('level1'); 
        this.map.addTilesetImage('walls');
        this.map.addTilesetImage('moss');        
        
        this.walls = this.map.createLayer('walls_layer');
        this.map.setCollisionBetween(1,11,true,'walls_layer');
        
        this.map.createLayer('moss_top');
        this.map.createLayer('moss_left');
        this.map.createLayer('moss_right');
        this.map.createLayer('moss_bottom');
        
        /*this.entry = this.game.add.sprite(65,268,'entry');
        this.entry.anchor.setTo(.5);
        this.game.physics.arcade.enable(this.entry);
        this.entry.body.allowGravity = false;
        this.entry.body.immovable = true;*/ 
        this.entry = this.game.add.image(65,268,'entry');
        this.entry.anchor.setTo(.5);
        
        this.hero = this.game.add.sprite(65,100,'hero',0);
        this.hero.anchor.setTo(.5);
        this.hero.animations.add('run',[1,2,3,4],10,true);
        this.game.physics.arcade.enable(this.hero);
        
        this.gemUI = this.game.add.image(390,-10,'gemUI');
        this.gemUI.fixedToCamera = true;
        //this.hero.energy = 6;
        //this.gemUI.contador = 3;
        this.score = 0;
        this.resumeGame();
        
        this.energy = this.game.add.sprite(10,10,'energy',this.hero.energy);
        this.energy.fixedToCamera = true;
        this.hero.hit = function(){
            this.reset(65,100);
            //this.parent.camera.shake(0.05,500);
            this.parent.camera.flash('0xFF0000',500);
            this.energy --;
            platformer.level1.energy.frame = this.energy;
            //this.energy.frame = this.hero.energy;
            platformer.level1.saveGame();
        };
        this.hero.points = function(){
            platformer.level1.gemUI.contador += 5;
            platformer.level1.gemTextUI.setText('x'+platformer.level1.gemUI.contador);
            platformer.level1.saveGame();
        }
        
        this.scoreUI = this.game.add.text(220,18,this.score);
        this.scoreUI.font             = 'Press Start 2P';
        this.scoreUI.fill             = 'white';
        this.scoreUI.fontSize         = 16;
        this.scoreUI.fixedToCamera    = true;
        
        this.gemTextUI = this.game.add.text(440,18,'x'+this.gemUI.contador);
        this.gemTextUI.font             = 'Press Start 2P';
        this.gemTextUI.fill             = 'white';
        this.gemTextUI.fontSize         = 16;
        this.gemTextUI.fixedToCamera    = true;
        
        this.cursors    = this.game.input.keyboard.createCursorKeys();
        this.space      = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        this.escape     = this.game.input.keyboard.addKey(Phaser.Keyboard.ESC);
        
        this.camera.follow(this.hero, Phaser.Camera.FOLLOW_PLATFORMER);
        //(game,x,y,level,speed,direction)
        this.jumper = new platformer.jumper_prefab(this.game,240,304,this,100,1);
        //this.game.add.existing(this.jumper);
        //(game,x,y,level,speed,direction,patrolA,patrolB)
        this.slime = new platformer.slime_prefab(this.game,672,268,this,100,1,645,1024);
        
        
    },
    update:function(){
        //  this.game.physics.arcade.collide(this.hero,this.entry);
        this.game.physics.arcade.collide(this.hero,this.walls);
        
        this.hero.body.velocity.x = 0;
        
        if(this.cursors.left.isDown){
            this.hero.body.velocity.x = -gameOptions.heroSpeed;
            this.hero.animations.play('run');
            this.hero.scale.x = -1;
         } else if (this.cursors.right.isDown){
            this.hero.body.velocity.x = gameOptions.heroSpeed;
            this.hero.animations.play('run');
            this.hero.scale.setTo(1,1);            
        } else{
            this.hero.frame = 0;
        }
                
        if(this.space.isDown 
           && this.hero.body.blocked.down 
           && this.space.downDuration(250)){
            this.hero.body.velocity.y = -gameOptions.heroJump;
        }
        
        if(this.escape.isDown){
            this.resetGame();
            this.saveGame();
            platformer.game.state.start('main');
        }
        
        if(!this.hero.body.blocked.down){
            this.hero.frame=5;
        }
        

    },
    hit:function(){
        this.hero.reset(65,100);
        this.camera.shake(0.05,500);
        this.hero.energy --;
        this.energy.frame = this.hero.energy;
    },
    resumeGame:function(){
        if(!this.supportLocalStorage() || localStorage["save"] != "true"){ 
            this.resetGame();
            return false; 
        }
        this.hero.energy    = parseInt(localStorage["energy"]);     //localStorage només guarda strings
        this.score          = parseInt(localStorage["score"]);      //si no hi ha res guardat, tornarà null
        return true;
    },
    saveGame:function(){
        if(!this.supportLocalStorage()){ return false; }
        localStorage["save"]    = true;                             //el nom de la variable a localStorage el triem nosaltres
        localStorage["energy"]  = this.hero.energy;
        
        actualScore = parseInt(localStorage["score"]);
        if(actualScore < this.score){
            localStorage["score"] = this.gemUI.contador;
        }
        return true;
    },
    supportLocalStorage:function(){                                 //per si fem servir un browser antic que no fa servir local storage
        return ('localStorage' in window) && window['localStorage']!==null;
    },
    resetGame:function(){
        this.hero.energy    = 6;
        this.score          = 0;
        
    }
};

