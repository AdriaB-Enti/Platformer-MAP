var platformer = platformer || {};

var gameOptions ={
    gameWidth:960,
    gameHeight:540,
    level1Width:1280,
    level1Height:800,
    heroGravity:1000,
    heroSpeed:200,
    heroJump:450    
};

platformer.game = new Phaser.Game(gameOptions.gameWidth,gameOptions.gameHeight,Phaser.AUTO,null,this,false,false);

WebFontConfig = {
    active:function(){game.time.events.add(Phaser.Timer.SECOND,createText,this);},
    google:{
        families:['Press Start 2P']
    }
};

platformer.game.state.add('main',platformer.level1);
platformer.game.state.start('main');




