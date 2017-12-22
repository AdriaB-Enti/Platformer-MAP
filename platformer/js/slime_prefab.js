var platformer = platformer || {};

platformer.slime_prefab = function(game,x,y,_level,_speed,_direction,_patrolA,_patrolB){
    Phaser.Sprite.call(this,game,x,y,'slime');
    game.add.existing(this);
    this.anchor.setTo(.5);
    this.animations.add('walk',[0,1,2,3],10,true);
    this.animations.play('walk');
    game.physics.arcade.enable(this);
    this.level = _level;
    this.speed = _speed;
    this.direction = _direction;
    this.patrolA = _patrolA;
    this.patrolB = _patrolB;
};

platformer.slime_prefab.prototype = Object.create(Phaser.Sprite.prototype);
platformer.slime_prefab.prototype.constructor = platformer.slime_prefab;

platformer.slime_prefab.prototype.update = function(){
    
    this.game.physics.arcade.collide(this,this.level.walls);
     
    if((this.body.position.x < this.patrolA) || (this.body.position.x > this.patrolB)){
        this.direction *=-1; 
        this.scale.x = this.direction;
    }
     this.body.velocity.x = this.speed*this.direction;
    
    this.game.physics.arcade.collide(this,this.level.hero,
    function(enemigo,heroe){
        if(enemigo.body.touching.up && heroe.body.touching.down){
            heroe.body.velocity.y = -gameOptions.heroJump;
            enemigo.kill();
        }else{
            //heroe.reset(65,100);
            //enemigo.level.camera.shake(0.05,500);
            //enemigo.level.hit();
            heroe.hit();
        }
    });
    
};










