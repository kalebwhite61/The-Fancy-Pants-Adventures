var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'game');

game.States = {};

//进度加载
game.States.boot = function() {
    this.preload = function() {
        if(typeof(GAME) !== "undefined") {
            this.load.baseURL = GAME + "/";
        }
        if(!game.device.desktop){
            this.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
            this.scale.forcePortrait = true;
            this.scale.refresh();
        }
        game.load.image('loading', 'assets/preloader.gif');
    };
    //场景跳转
    this.create = function() {
        game.state.start('preload');
    };
};
//资源载入
game.States.preload = function() {
    this.preload = function() {
        game.load.spritesheet("theme","assets/character.png",63,100);
        game.load.spritesheet("playerwalk","assets/walkset.png",31.666,48);
        game.load.spritesheet("belt","assets/belt.png",263,32);
        game.load.spritesheet("s-belt","assets/s-belt.png",119.5,32);
        game.load.spritesheet("belt_reverse","assets/belt.png",263,32);
        game.load.spritesheet("stone","assets/map/tileset.png",50,50);
        game.load.spritesheet('waters', 'assets/waters.png', 32, 400, 32);
        game.load.spritesheet('shark','assets/shark.png',150,92);
        game.load.spritesheet('chain','assets/chain.png',16,26);
        game.load.image("startBtn","assets/startBtn.png",173,38);
        game.load.image("tree","assets/tree.png",142,156);
        game.load.image("dusty","assets/dusty.png",64,30);
        game.load.image("ground","assets/platform.png",400,32);
        game.load.image("movebar","assets/movebar.png",150,33);
        game.load.image("waterdrop","assets/rain.png",17,17);
        game.load.image("rope","assets/rope.png",10,480);
        game.load.image("s-rope","assets/s-rope.png",10,240);
        //地图资源加载
        game.load.image("tile","assets/map/tileset.png");
        game.load.tilemap("mapone","assets/map/ground.json",null, Phaser.Tilemap.TILED_JSON);
    };
    this.create = function() {
        //game.state.start('start');
        // game.state.start('main');
        game.state.start('test');
    };
};
//P2引擎测试页面
game.States.P2World=function(){
    var player,cursors,hill2;
    var obstacle;
    var p2Hill;
    this.create = function() {
        //开启P2JS物理引擎
        game.physics.startSystem(Phaser.Physics.P2JS);
        //启动页面背景色
        game.stage.backgroundColor="#ff9";
        player=game.add.sprite(50,game.world.height-150,"playerwalk",2);
        //玩家物理引擎配置
        game.physics.p2.enable(player);
        player.animations.add("leftMove",[8,9,10,11,12]);
        player.animations.add("rightMove",[3,4,5,6,7]);
        player.body.fixedRotation=true;
        //键盘监听事件
        cursors=game.input.keyboard.createCursorKeys();
        p2Hill=game.add.sprite(400,game.world.height-165,"ground");
        game.physics.p2.enable(p2Hill);
        p2Hill.body.angle=-50;
        // p2Hill.body.motionState=Phaser.Physics.P2.Body.DYNAMIC;
        p2Hill.body.motionState=Phaser.Physics.P2.Body.STATIC;
        // p2Hill.body.motionState=Phaser.Physics.P2.Body.KINEMATIC;
        //player.body.setSize(100,100);
        p2Hill.body.kinematic=true;

        player.body.angle=-50;

    };
    this.update =function () {
        player.body.setZeroVelocity();
        if (cursors.left.isDown)
        {
            player.body.moveLeft(200);
            player.play("leftMove",15,true);
        }
        else if (cursors.right.isDown)
        {
            player.body.moveRight(200);
            player.play("rightMove",15,true);
        }else{
            player.frame=0;
        }
        if (cursors.up.isDown)
        {
            player.body.moveUp(400);
        }
        else if (cursors.down.isDown)
        {
            player.body.moveDown(400);
        }
    };
};
//Arcade功能测试页面
game.States.test=function(){
    //石头对象
    function Stone(moveStyle,moveFlag){
        this.moveStyle= moveStyle;
        this.moveFlag= moveFlag;
    };
    //对象扩展属性
    function Character(flag,speed,curDir){
        this.reverseFlag=flag;
        this.speed=speed;
        this.curDir=curDir;
        this.state="";
        this.isClimb=false;
    };
    //NPC对象
    function NPC(){

    };
    var stoneGroup,evilBoxGroup;
    var player,cursors,map,groundLayer,belt,belt2,rope;
    var obstacleHorizontalMove,obstacleVerticalMove;
    var playerSpeed=100;
    var npcSpeed=100;
    var playerJump=-175;
    var gravity=250;
    var playerMove=false;
    var beltStop=true;
    var ropeDir=true;
    var angleStep=0.5;
    var sPos=45;
    var water;
    var shark;
    var sharkSpeed=100;
    var chain,baseHeight,baseWidth;
    var chainFlag=true;

    this.create = function() {
        //开启物理引擎
        game.physics.startSystem(Phaser.Physics.ARCADE);
        //启动页面背景色
        game.stage.backgroundColor="#ff9";

        //锁链
        chain=game.add.group();
        chain.enableBody=true;
        //chain.anchor.setTo(0.5,0);
        chain.position={x:48*50,y:200};
        for(var i=0;i<7;i++){
            chain.create(0,(i*2+1)*20,"chain",0).anchor.setTo(0.5,0);
            chain.create(0,i*40,"chain",1).anchor.setTo(0.5,0);
        }
        baseWidth=chain.width;
        baseHeight=chain.height;

        var chain1=game.add.group();
        chain1.enableBody=true;
        //chain.anchor.setTo(0.5,0);
        chain1.position={x:53*50,y:200};
        for(var i=0;i<7;i++){
            chain1.create(0,(i*2+1)*20,"chain",0).anchor.setTo(0.5,0);
            chain1.create(0,i*40,"chain",1).anchor.setTo(0.5,0);
        }

        //玩家物理引擎配置
        player=game.add.sprite(sPos*50,game.world.height-170,"playerwalk",2);
        // player.alpha=0;
        Character.call(player,false);      //扩展玩家属性
        game.physics.arcade.enable(player);
        player.body.collideWorldBounds=true;
        player.body.gravity.y=gravity;
        player.anchor.setTo(0.5,0);
        //摄像机跟随
        game.camera.follow(player);
        //玩家动画效果
        var initAnimation=game.add.tween(player).to({x:(sPos+1)*50,y:game.world.height-player.height-50},1000,null,true);
        player.animations.add("leftMove",[8,9,10,11,12]);
        player.animations.add("rightMove",[3,4,5,6,7]);
        player.animations.add("climb",[13,14]);

        //地图资源加载
        map = game.add.tilemap('mapone');
        map.addTilesetImage('groundSet', 'tile');
        groundLayer = map.createLayer('gameGround');
        //根据地图大小，重新设置游戏世界大小
        groundLayer.resizeWorld();
        // 设置tile碰撞
        map.setCollisionBetween(1, 9);
        //尖刺回调函数
        map.setTileIndexCallback(8,gameOver,this);
        //可下落砖块初始化，包括第一梯队障碍（进击的石头）和后续梯队同类型障碍
        eleFactory();
        //水平移动障碍物集包括后障碍阶梯续会出现的
        obstacleHorizontalMove=game.add.group();
        obstacleHorizontalMove.enableBody=true;
        var obstacleGround=obstacleHorizontalMove.create(40*50,game.world.height-100,"movebar");
        obstacleGround.movestyle="horizontal";
        obstacleGround.body.immovable=true;
        for(var i=0;i<obstacleHorizontalMove.length;i++)
            game.add.tween(obstacleHorizontalMove.getChildAt(i)).to({x:43*50},2000,null,true,0,-1,true);

        //第二梯队障碍，传送带与反操作evil
        belt=game.add.sprite(21*50,10*50,"s-belt",0);                            //第一传送带
        belt.animations.add("belt_move");
        belt.animations.play("belt_move",32,true);
        game.physics.arcade.enable(belt);
        belt.body.immovable=true;
        belt2=game.add.sprite(27*50,10*50,"s-belt",0);                          //第二传送带
        belt2.animations.add("belt_move_left").reverse();
        belt2.animations.play("belt_move_left",32,true);
        game.physics.arcade.enable(belt2);
        belt2.body.immovable=true;
        evilBoxGroup=game.add.group();                                          //反操作砖块组
        evilBoxGroup.enableBody=true;
        evilBoxGroup.create(25*50,9*50,"stone",5).body.immovable=true;
        evilBoxGroup.create(32*50,8*50,"stone",5).body.immovable=true;
        evilBoxGroup.create(35*50,8*50,"stone",5).body.immovable=true;

        //第三梯队障碍,大海与鲨鱼
        shark=game.add.sprite(48*50,game.world.height-70,'shark',0);               //鲨鱼引入
        Character.apply(shark,[false,sharkSpeed,"right"]);
        shark.animations.add("rAttack",[0,1]);
        shark.animations.add('lAttack',[3,2]);
        game.physics.arcade.enable(shark);

        water = game.add.tileSprite(48*50,game.world.height-65,23*50, 80, 'waters');
        water.animations.add('waves0', [0, 1, 2, 3, 2, 1]);
        water.animations.add('waves1', [4, 5, 6, 7, 6, 5]);
        water.animations.add('waves2', [8, 9, 10, 11, 10, 9]);
        water.animations.add('waves3', [12, 13, 14, 15, 14, 13]);
        water.animations.add('waves4', [16, 17, 18, 19, 18, 17]);
        water.animations.add('waves5', [20, 21, 22, 23, 22, 21]);
        water.animations.add('waves6', [24, 25, 26, 27, 26, 25]);
        water.animations.add('waves7', [28, 29, 30, 31, 30, 29]);
        var n = 7;                                                               //设置海水颜色
        water.animations.play('waves' + n, 8, true);
        //摆动的绳子
        rope=game.add.sprite(52*50,200,"s-rope");
        rope.anchor.setTo(0.5,0);
        rope.alpha=0;

        //  t_rope=game.add.sprite(51*50,200,"s-rope").anchor.setTo(0.5,0);
        //t_rope=game.add.image(51*50,200,"s-rope").anchor.setTo(0.5,0);

        //键盘监听事件
        cursors=game.input.keyboard.createCursorKeys();
        initAnimation.onComplete.add(function () {
            player.frame=0;
            playerMove=true;
        },this);
    };
    this.update =function () {
        //鲨鱼游泳
        Swim();
        //信息调试
        if(game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)){
            Attack();
        }
        if(game.input.keyboard.isDown(Phaser.Keyboard.T)){
            if(chainFlag&&!chain.contains(player)){
                player.y=0;
                chain.add(player);
                chainFlag=false;
            }
        }
        if(game.input.keyboard.isDown(Phaser.Keyboard.C)){
            // if(chain.contains(player)){
            //     player.parent=game.world;
            //     player.x=0;
            //     player.y=player.previousPosition.y;
            // }
            player.x=-13.5;
        }
        game.physics.arcade.collide(player,evilBoxGroup,reverseOperation);
        game.physics.arcade.collide(player,stoneGroup);
        game.physics.arcade.collide(player,groundLayer,null);
        game.physics.arcade.collide(player,obstacleHorizontalMove,syncMove);
        game.physics.arcade.collide(player,obstacleVerticalMove,syncMove);
        player.isClimb=game.physics.arcade.overlap(player,chain,climbChain);
        var beltAction=game.physics.arcade.collide(player,belt);
        var beltLeftAction=game.physics.arcade.collide(player,belt2);
        //玩家恢复正常操作
        if((player.x<=20*50||player.x+player.width>=45*50)&&player.body.onFloor())
            resetConfig();
        // //绳子摆动方向
        if(ropeDir){
            chain.angle+=angleStep;
            //chain1.angle+=angleStep;
            rope.angle+=angleStep;
            if(rope.angle==30)
                ropeDir=false;
        }else{
            chain.angle-=angleStep;
            // chain1.angle+=angleStep;
            rope.angle-=angleStep;
            if(rope.angle==-30)
                ropeDir=true;
        }

        playerSpeed=player.reverseFlag?-Math.abs(playerSpeed):Math.abs(playerSpeed);
        if(player.isClimb){
            player.x=-13.5;
        }
        if(cursors.left.isDown){
            if(player.body.touching.down||player.body.onFloor()){
                var move=player.reverseFlag?"rightMove":"leftMove";
                player.animations.play(move,10,true);
            }
            else
                player.frame=player.reverseFlag?2:1;
            player.body.velocity.x=-playerSpeed;
            if(beltAction)
                player.body.velocity.x+=npcSpeed/2;
            if(beltLeftAction)
                player.body.velocity.x-=npcSpeed/2;

        }else if(cursors.right.isDown){
            if(player.body.touching.down||player.body.onFloor()){
                var move=player.reverseFlag?"leftMove":"rightMove";
                player.animations.play(move,10,true);
            }
            else
                player.frame=player.reverseFlag?1:2;
            player.body.velocity.x=playerSpeed;
            if(beltAction)
                player.body.velocity.x+=npcSpeed/2;
            if(beltLeftAction)
                player.body.velocity.x-=npcSpeed/2;
        }else{
            if(!player.isClimb){
                player.animations.stop();
                if(playerMove)
                    player.frame=0;
            }
            player.body.velocity.x=0;
            if(beltAction)
                player.body.velocity.x+=npcSpeed/2;
            if(beltLeftAction)
                player.body.velocity.x-=npcSpeed/2;
        };
        if(cursors.up.isDown){
            if(player.isClimb){
                player.animations.play("climb",6,true);
                player.body.velocity.y=-playerSpeed;
                //跳跃离开锁链
                if(cursors.left.isDown||cursors.right.isDown){
                    resetConfig();
                    player.body.velocity.y=playerJump;
                    player.parent=game.world;
                    player.x=player.previousPosition.x;
                    player.y=player.previousPosition.y;
                    player.isClimb=false;
                }
            }
            if(player.body.touching.down||player.body.onFloor())
                player.body.velocity.y=playerJump;
        }else if(cursors.down.isDown) {
            if(player.isClimb) {
                player.body.velocity.y=-playerJump;
                player.animations.play("climb",6,true);
            }
        }else {
            if(player.isClimb){
                player.animations.stop("climb");
                player.body.gravity.y=0;
                player.body.velocity.y=0;
                player.frame=13;
            }else{
                resetConfig();
            }
        };
        if(player.body.touching.down||player.body.onFloor()){
            beltStop=false;
        }
    };
    this.render=function () {
        game.debug.spriteBounds(player);
        game.debug.spriteInfo(player, 32, 32,"black");
    };
    function gameOver(){
        var reviveX=player.x;
        if(reviveX<18*50){
            player.x=350;
            player.y=250;
        }else if(reviveX<44*50){
            player.x=18*50+25;
            player.y=10*50;
        };
        eleFactory();
        resetConfig();
    };
    function climbChain(){
        player.isClimb=true;
        //人物添加到组,即爬锁
        if(chainFlag&&!chain.contains(player)){
            player.x=0;
            player.y=0;
            chain.add(player);
            chainFlag=false;
        }

    };
    function syncMove(obj1,obj2) {
        if(obj2.movestyle=="vertical")
            obj1.body.velocity.y=obj2.movespeed;
        obj1.x+=obj2.x-obj2.previousPosition.x;
    };
    function Test(chainPart){

    };
    function reverseOperation(obj){
        if(obj.previousPosition.y-obj.body.y<-1)
            obj.reverseFlag=!obj.reverseFlag;
    };
    //玩家死亡复活后重置属性恢复场景
    function resetConfig(){
        player.reverseFlag=false;
        player.body.gravity.y=gravity;
        player.isClimb=false;
        chainFlag=true;
    };
    function eleFactory(){
        if(stoneGroup!=undefined)
            stoneGroup.destroy();
        stoneGroup=game.add.group();
        stoneGroup.enableBody=true;
        for(var i =0;i<3;i++) {
            stoneGroup.create((8 + i*2) * 50, (10-i)* 50, "stone", 6);
        }
        stoneGroup.create(31*50,9*50,"stone",6);
        stoneGroup.create(33*50,7*50,"stone",6);
        stoneGroup.create(34*50,7*50,"stone",6);
        stoneGroup.create(36*50,9*50,"stone",6);
    };
    function Attack(){
        shark.state="up";
        shark.speed=0;
        var ackDistance=shark.curDir=="right"?shark.x+2*50:shark.x-2*50;
        var ackAngle=shark.curDir=="right"?-5:5;
        var ackDir=shark.curDir=="right"?"rAttack":"lAttack";
        var sharkAttack=game.add.tween(shark).to({x:ackDistance,y:game.world.height-230,angle:ackAngle},1000,Phaser.Easing.Elastic.In,true,0);
        sharkAttack.onComplete.add(attackDown,this);
        shark.animations.play(ackDir,8,true);
        game.time.events.add(350,sharkJump,this);
        game.time.events.add(900,waterDrop,this);
    };
    function attackDown(){
        shark.state="down";
        var ackDistance=shark.curDir=="right"?shark.x+2*50:shark.x-2*50;
        var ackAngle=0;
        var sharkAttackDown=game.add.tween(shark).to({x:ackDistance,y:game.world.height-70,angle:ackAngle},1000,Phaser.Easing.Elastic.Out,true,0);
        sharkAttackDown.onComplete.add(reSwim,this);
        game.time.events.add(300,waterDrop,this);
        shark.frame=shark.curDir=="left"?3:0;
    };
    function sharkJump(){
        shark.animations.stop();
        shark.frame=shark.curDir=="left"?2:1;
    };
    function reSwim(){
        shark.speed=sharkSpeed;
    };
    function Swim(){
        if(shark.x>=57*50) {
            shark.curDir="left";
            shark.frame = 3;
        }
        else if(shark.x<=48*50) {
            shark.curDir="right";
            shark.frame = 0;
        }
        if(shark.curDir=="left"){
            shark.body.velocity.x=-shark.speed;
        }else{
            shark.body.velocity.x=shark.speed;
        }
    };
    function waterDrop(){
        var waterDropX;
        if(shark.state=="up")
            waterDropX=shark.curDir=="right"?shark.centerX+60:shark.centerX-100;
        else
            waterDropX=shark.centerX;
        var emitter = game.add.emitter(waterDropX,game.world.height-45);
        emitter.makeParticles('waterdrop');
        //emitter.angularDrag=100;
        emitter.minParticleScale = 0.1;
        emitter.maxParticleScale = 0.8;
        emitter.setAlpha(0, 1,1200);
        emitter.minParticleSpeed.setTo(-95, -10);
        emitter.maxParticleSpeed.setTo(95, -70);
        emitter.start(true, 500, 80,80);
    }
}
//开始页面
game.States.start = function() {
    var player,playerWalk,playerRun,title,startBtn,dusty;
    var bounceFlag=0;
    var moveFloat=false;
    var thisCreate=this;
    var leftFlag=true;
    this.create = function() {
        //开启物理引擎
        game.physics.startSystem(Phaser.Physics.ARCADE);
        //启动页面背景色
        game.stage.backgroundColor="#ff9";
        //组添加标题字母
        title=game.add.group();
        //使能组物理引擎
        title.enableBody=true;
        //标题动画包含进入和下落
        for(var i=0;i<8;i++){
            var tween=title.create(63*i,-100,'theme',i);
            //设置组元素固定定位
            tween.body.immovable=true;
            //设置组元素碰撞边界
            tween.body.setSize(63,30,0,12);
            var tweenIn=game.add.tween(tween).to({y:10}, 4000, Phaser.Easing.Elastic.Out,false);
            var tweenDown=game.add.tween(tween).to({y:200}, 2000, Phaser.Easing.Bounce.Out,false,i*100);
            //chain链式启动下落动画
            tweenIn.chain(tweenDown);
            tweenIn.start();
        }
        //组标题整体居中
        title.x=game.world.centerX-252;
        //玩家精灵添加
        player=game.add.sprite(-100,240,"playerwalk",0);
        //使能玩家精灵物理引擎
        game.physics.arcade.enable(player);
        //玩家移动动画
        player.animations.add("startMove",[3,4,5,6,7]);
        player.animations.play("startMove",10,true);
        playerWalk=game.add.tween(player).to({x:132},3000,null,true);
        playerWalk.onComplete.add(this.wait,this);
        //开始按钮设置
        startBtn=game.add.button(game.world.centerX,game.world.centerY,"startBtn",this.nextStage,this);
        startBtn.anchor.setTo(0.5,-2);
        startBtn.alpha=0;
        //背景树添加
        var tree1=game.add.sprite(71,-78,"tree");
        tree1.angle=180;
        tree1.anchor.setTo(0.5,0.5);
        game.add.tween(tree1).to({y:78},2000,null,true);
        var tree2=game.add.sprite(game.world.width-142,game.world.height,"tree");
        game.add.tween(tree2).to({y:game.world.height-156},2000,null,true);
        //起跳灰尘效果
        dusty=game.add.sprite(720,288,"dusty");
        dusty.alpha=0;
        dusty.anchor.setTo(0.5,0.5);
    };
    this.update=function () {
        game.physics.arcade.collide(player,title,this.titleFloat,null,this);
        if(bounceFlag==2){
            player.body.velocity=0;
            moveFloat=true;
            //按钮动画启动
            game.add.tween(startBtn).to({alpha:1},1000,null,true);
            if(leftFlag){
                player.animations.add("startBack",[8,9,10,11,12]);
                player.animations.play("startBack",10,true);
            };
            leftFlag=false;
        };
        if(moveFloat){
            player.y=title.getChildAt(0).y+title.y-38;
        }
    };
    //player waits
    this.wait=function () {
        player.animations.stop("startMove");
        player.frame=0;
        this.run();
    };
    //player runs
    this.run=function(){
        setTimeout(function () {
            player.animations.add("startRun",[3,4,5,6,7]);
            player.animations.play("startRun",10,true);
            playerRun=game.add.tween(player).to({x:700},3100,Phaser.Easing.Elastic.Out,true);
            playerRun.onComplete.add(thisCreate.back,this);
        },1300);
    };
    this.back=function () {
        player.animations.stop("startRun");
        player.frame=1;
        player.body.velocity.y=-147;
        player.body.velocity.x=-77.5;
        player.body.bounce.y=0.4;
        player.body.gravity.y=80;
        player.body.collideWorldBounds=true;
        //起跳灰尘效果播放
        var dustyOn=game.add.tween(dusty).to({alpha:1},300,Phaser.Easing.Elastic.Out,false);
        dustyOn.chain(game.add.tween(dusty).to({alpha:0},300,Phaser.Easing.Elastic.In,false));
        dustyOn.start();
    };
    //标题浮动
    this.titleFloat=function(){
        game.add.tween(title).to({y: 20}, 700, null, true, 0, Number.MAX_VALUE, true);
        bounceFlag++;
    };
    this.nextStage=function () {
        game.state.start("main");
    }
};

//主场景
game.States.main = function() {
    var player,cursors,map,groundLayer,belt,belt2,rope,trap;
    var obstacleHorizontalMove,obstacleVerticalMove;
    var playerSpeed=100;
    var playerJump=-175;
    var gravity=250;
    var playerMove=false;
    var beltStop=true;
    var ropeDir=true;
    var angleStep=0.5;
    this.create = function() {
        //开启物理引擎
        game.physics.startSystem(Phaser.Physics.ARCADE);
        //地图资源加载
        map = game.add.tilemap('mapone');
        map.addTilesetImage('groundSet', 'tile');
        groundLayer = map.createLayer('gameGround');
        //根据地图大小，重新设置游戏世界大小
        groundLayer.resizeWorld();
        // 设置tile碰撞
        map.setCollisionBetween(0, 8);
        // map.setCollisionBetween(20, 25);
        // map.setCollisionBetween(27, 29);
        // map.setCollision(40);

        //启动页面背景色
        game.stage.backgroundColor="#ff9";
        player=game.add.sprite(0,game.world.height-170,"playerwalk",2);
        // //水平移动障碍物集
        // obstacleHorizontalMove=game.add.group();
        // obstacleHorizontalMove.enableBody=true;
        // var obstacleGround=obstacleHorizontalMove.create(32,game.world.height-64,"ground");
        // obstacleGround.movestyle="horizontal";
        // obstacleGround.body.immovable=true;
        // for(var i=0;i<obstacleHorizontalMove.length;i++)
        //     game.add.tween(obstacleHorizontalMove.getChildAt(i)).to({x:150},2000,null,true,0,-1,true);
        // //垂直移动障碍物集
        // obstacleVerticalMove=game.add.group();
        // obstacleVerticalMove.enableBody=true;
        // var obstacleGround1=obstacleVerticalMove.create(550,game.world.height-108,"ground");
        // obstacleGround1.movestyle="vertical";//扩展对象属性，添加移动方式为垂直运动
        // obstacleGround1.movespeed=70;//扩展对象属性，添加移动速度
        // obstacleGround1.body.immovable=true;
        // for(var i=0;i<obstacleVerticalMove.length;i++)
        //     game.add.tween(obstacleVerticalMove.getChildAt(i)).to({y:400},2000,null,true,0,-1,true);
        //
        //传送带动画
        belt=game.add.sprite(game.world.width/2-200,game.world.height-64,"belt",0);
        belt.animations.add("belt_move");
        belt.animations.play("belt_move",32,true);
        game.physics.arcade.enable(belt);
        belt.body.immovable=true;

        belt2=game.add.sprite(game.world.width/2+100,game.world.height-96,"belt",0);
        belt2.animations.add("belt_move_left").reverse();
        belt2.animations.play("belt_move_left",32,true);
        game.physics.arcade.enable(belt2);
        belt2.body.immovable=true;
        //
        // //摆动的绳子
        // rope=game.add.sprite(150,game.world.centerY-50,"ground");
        // rope.scale.x=0.5;
        // rope.scale.y=0.1;
        // rope.anchor.setTo(0,0.5);
        // rope.angle=30;
        //
        // //陷阱放置
        // trap=game.add.sprite(200,game.world.height-98,"trap");
        // trap.scale.setTo(0.7,0.7);
        // game.physics.arcade.enable(trap);
        // trap.body.immovable=true;

        //玩家物理引擎配置
        game.physics.arcade.enable(player);
        player.body.collideWorldBounds=true;
        player.body.gravity.y=gravity;
        //摄像机跟随
        game.camera.follow(player);
        //玩家动画效果
        var initAnimation=game.add.tween(player).to({x:50,y:game.world.height-player.height-50},1000,null,true);
        player.animations.add("leftMove",[8,9,10,11,12]);
        player.animations.add("rightMove",[3,4,5,6,7]);
        //键盘监听事件
        cursors=game.input.keyboard.createCursorKeys();
        initAnimation.onComplete.add(function () {
            player.frame=0;
            playerMove=true;
        },this);
    };
    this.update =function () {
        game.physics.arcade.collide(player,groundLayer,null);
        game.physics.arcade.collide(player,obstacleHorizontalMove,this.syncMove);
        game.physics.arcade.collide(player,obstacleVerticalMove,this.syncMove);
        game.physics.arcade.collide(player,trap,this.gameOver);
        var beltAction=game.physics.arcade.collide(player,belt);
        var beltLeftAction=game.physics.arcade.collide(player,belt2);
        //绳子摆动方向
        // if(ropeDir){
        //     rope.angle+=angleStep;
        //     if(rope.angle==150)
        //         ropeDir=false;
        // }else{
        //     rope.angle-=angleStep;
        //     if(rope.angle==30)
        //         ropeDir=true;
        // }
        if(cursors.left.isDown){
            if(player.body.touching.down||player.body.onFloor())
                player.animations.play("leftMove",10,true);
            else
                player.frame=1;
            player.body.velocity.x=-playerSpeed;
            if(beltAction)
                player.body.velocity.x+=playerSpeed/2;
            if(beltLeftAction)
                player.body.velocity.x-=playerSpeed/2;
        }else if(cursors.right.isDown){
            if(player.body.touching.down||player.body.onFloor())
                player.animations.play("rightMove",10,true);
            else
                player.frame=2;
            player.body.velocity.x=playerSpeed;
            if(beltAction)
                player.body.velocity.x+=playerSpeed/2;
            if(beltLeftAction)
                player.body.velocity.x-=playerSpeed/2;
        }else{
            player.animations.stop();
            if(playerMove)
                player.frame=0;
            player.body.velocity.x=0;
            if(beltAction)
                player.body.velocity.x+=playerSpeed/2;
            if(beltLeftAction)
                player.body.velocity.x-=playerSpeed/2;
        };
        if(cursors.up.isDown&&(player.body.touching.down||player.body.onFloor())){
            player.body.velocity.y=playerJump;
        };
        if(player.body.touching.down||player.body.onFloor()){
            beltStop=false;
        }
        // //玩家和绳子的碰撞检测
        // if(rope.angle>90)
        //     tiltCollide(player,rope.getBounds().bottomLeft);
        // else
        //     tiltCollide(player,rope.getBounds().bottomRight);
    };
    this.syncMove=function (obj1,obj2) {
        if(obj2.movestyle=="vertical")
            obj1.body.velocity.y=obj2.movespeed;
        obj1.x+=obj2.x-obj2.previousPosition.x;
    };
    this.gameOver=function(){
        // player.kill();
        console.log("Game Over ...");
    }
};

//添加场景
game.state.add('boot', game.States.boot);
game.state.add('preload', game.States.preload);
game.state.add('start', game.States.start);
game.state.add('main', game.States.main);
// game.state.add('over', game.States.over);

//测试场景
game.state.add('test',game.States.test);

//启动boot场景
game.state.start('boot');