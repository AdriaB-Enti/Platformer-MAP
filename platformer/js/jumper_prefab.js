var platformer = platformer || {};

platformer.jumper_prefab = function(game,x,y,_level,_speed,_direction){
    Phaser.Sprite.call(this,game,x,y,'jumper');
    game.add.existing(this);
    this.anchor.setTo(.5);
    this.animations.add('walk',[0,1,2,3],10,true);
    this.animations.play('walk');
    game.physics.arcade.enable(this);
    this.level = _level;
    this.speed = _speed;
    this.direction = _direction;
};

platformer.jumper_prefab.prototype = Object.create(Phaser.Sprite.prototype);
platformer.jumper_prefab.prototype.constructor = platformer.jumper_prefab;

platformer.jumper_prefab.prototype.update = function(){
    this.game.physics.arcade.collide(this,this.level.walls);
     
    if(this.body.blocked.right || this.body.blocked.left){
        this.direction *=-1; 
        this.scale.x = this.direction;
    }
     this.body.velocity.x = this.speed*this.direction;
    
    this.game.physics.arcade.collide(this,this.level.hero,
    function(enemigo,heroe){
        if(enemigo.body.touching.up && heroe.body.touching.down){
            heroe.body.velocity.y = -gameOptions.heroJump;
            enemigo.kill();
            heroe.points();
        }else{
            //enemigo.level.hit();
            heroe.hit();
            /*
            heroe.reset(65,100);
            enemigo.level.camera.shake(0.05,500);
            heroe.energy --;
            enemigo.level.energy.frame = heroe.energy;*/
        }
    });
};










