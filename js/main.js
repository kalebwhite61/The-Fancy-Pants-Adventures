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
        game.load.spritesheet("peas","assets/pea.png",71,71);
        game.load.spritesheet("fireball","assets/fireball.png",56,34);
        game.load.image("startBtn","assets/startBtn.png",173,38);
        game.load.image("tree","assets/tree.png",142,156);
        game.load.image("dusty","assets/dusty.png",64,30);
        game.load.image("ground","assets/platform.png",400,32);
        game.load.image("movebar","assets/movebar.png",150,33);
        game.load.image("movebar1","assets/movebar2.png",100,33);
        game.load.image("movebar2","assets/movebar3.png",75,33);
        game.load.image("waterdrop","assets/rain.png",17,17);
        game.load.image("rope","assets/rope.png",10,480);
        game.load.image("s-rope","assets/s-rope.png",10,240);
        //地图资源加载
        game.load.image("tile","assets/map/tileset.png");
        game.load.tilemap("mapone","assets/map/ground.json",null, Phaser.Tilemap.TILED_JSON);
        //骨骼动画
        game.load.image('dragon_image', 'assets/skeleton/dragon_atlas.png');
        game.load.json('dragon_atlas', 'assets/skeleton/dragon_atlas.json');
        game.load.atlas('atlas1', 'assets/skeleton/dragon_atlas.png', 'assets/skeleton/dragon_atlas.json');
        game.load.json('dragon', 'assets/skeleton/dragon_skeleton.json');
    };
    this.create = function() {
      // game.state.start('start');
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
    //锁链对象
    function Chain(angleFlag,angleStep,angleRange){
        this.chainFlag=true;//true与锁链第一次接触
        this.chainPos=true;//true第一次判断玩家人物和锁链位置
        this.curDir=true;
        this.angleFlag=angleFlag==null?true:angleFlag;
        this.angleStep=angleStep?angleStep:0.5;
        this.angleRange=angleRange?angleRange:30;
        this.chainMove=function(){
            //锁链摆动方向
            if(this.angleFlag){
                this.angle+=this.angleStep;
                this.curDir=true;
                if(this.angle>=this.angleRange){
                    this.angleFlag=false;
                    this.curDir=false;
                }
            }else{
                this.angle-=this.angleStep;
                if(this.angle<=-this.angleRange)
                    this.angleFlag=true;
            }
        };
    }
    //锁链工厂
    function createChain(pos,angleFlag,length,angleStep,angleRange){
        var chain=game.add.group();
        this.length=length?length:7;
        Chain.call(chain,angleFlag,angleStep,angleRange);
        chain.enableBody=true;
        chain.position={x:pos*50,y:200};
        for(var i=0;i<this.length;i++){
           var chainPart1=chain.create(0,(i*2+1)*20,"chain",0);
           var chainPart2=chain.create(0,i*40,"chain",1);
           chainPart1.anchor.setTo(0.5,0);
           chainPart1.body.immovable=true;
           chainPart2.anchor.setTo(0.5,0);
           chainPart2.body.immovable=true;
        }
        return chain;
    }
    //玩家精灵扩展属性
    function Character(flag,speed,curDir){
        this.reverseFlag=flag;
        this.speed=speed;
        this.curDir=curDir;
        this.state="";
        this.isClimb=false;
        this.curChain=null;
        this.fireFlag=false;
    };
    //NPC对象
    function NPC(){

    };
    var bottomGroup,topGroup;
    var stoneGroup,evilBoxGroup;
    var player,cursors,map,groundLayer,belt,belt2;
    var obstacleHorizontalMove,obstacleVerticalMove,moveStone;
    var playerSpeed=100;
    var npcSpeed=100;
    var playerJump=-175;
    var gravity=250;
    var playerMove=false;
    var beltStop=true;
    var sPos=104;
    var water;
    var shark;
    var sharkSpeed=100;
    var chain,chain1,chain2,chain3;
    var chainX=50;
    var FLAG=true;
    var moveStoneChild1,moveStoneChild2,moveStoneChild3,moveStoneChild4,moveStoneChild5,moveStoneChild6;
    var pea,bullets,fireTime=1000;
    var dragon;
    this.create = function() {
        //开启物理引擎
        game.physics.startSystem(Phaser.Physics.ARCADE);
        //启动页面背景色
        game.stage.backgroundColor="#ff9";
        //创建显示层级
        bottomGroup=game.add.group();
        topGroup=game.add.group();
        //锁链配置
        chain=createChain(chainX);
        chain1=createChain(chainX+6,false);
        chain2=createChain(chainX+12);
        chain3=createChain(chainX+18,false);
        // chainTest=createChain(chainX-5);
        // chainTest.y=220;

        //玩家物理引擎配置
        player=game.add.sprite((sPos)*50,game.world.height-170,"playerwalk",2);
        bottomGroup.add(player);
        player.alpha=1;
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
        player.animations.add("climbR",[16,15]);

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
        var obstacleGround=obstacleHorizontalMove.create(39*50,game.world.height-100,"movebar");
        obstacleGround.movestyle="horizontal";
        obstacleGround.body.immovable=true;
        for(var i=0;i<obstacleHorizontalMove.length;i++)
            game.add.tween(obstacleHorizontalMove.getChildAt(i)).to({x:42*50},2000,null,true,0,-1,true);
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
        shark.attackFlag=true;
        bottomGroup.add(shark);
        Character.apply(shark,[false,sharkSpeed,"right"]);
        shark.animations.add("rAttack",[0,1]);
        shark.animations.add('lAttack',[3,2]);
        game.physics.arcade.enable(shark);

        water = game.add.tileSprite(48*50,game.world.height-65,23*50, 80, 'waters');
        topGroup.add(water);
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

        //第四梯队，移动块大翻越
        moveStone=game.add.group();
        moveStone.enableBody=true;
        moveStone.position={x:70*50,y:0};
        //移动块类型展示
        moveStoneChild1=moveStone.create(150,500,"movebar");
        moveStoneChild1.movestyle="horizontal";
        moveStoneChild1.body.immovable=true;
        game.add.tween(moveStoneChild1).to({x:250},2000,null,true,0,-1,true);

        moveStoneChild2=moveStone.create(490,460,"movebar1");
        moveStoneChild2.movestyle="vertical";
        moveStoneChild2.body.immovable=true;
        game.add.tween(moveStoneChild2).to({y:350},2000,null,true,0,-1,true);

        moveStoneChild3=moveStone.create(630,330,"movebar2");
        moveStoneChild3.movestyle="vertical";
        moveStoneChild3.body.immovable=true;
        game.add.tween(moveStoneChild3).to({y:450},2000,null,true,0,-1,true);

        moveStoneChild4=moveStone.create(750,300,"movebar1");
        moveStoneChild4.movestyle="horizontal";
        moveStoneChild4.body.immovable=true;
        game.add.tween(moveStoneChild4).to({x:850},2000,null,true,0,-1,true);

        moveStoneChild5=moveStone.create(1070,270,"movebar2");
        moveStoneChild5.movestyle="vertical";
        moveStoneChild5.body.immovable=true;
        game.add.tween(moveStoneChild5).to({y:470},3500,null,true,0,-1,true);

        moveStoneChild6=moveStone.create(1200,500,"movebar");
        moveStoneChild6.movestyle="horizontal";
        moveStoneChild6.body.immovable=true;

        //豌豆射手
        pea=game.add.sprite(91*50+10,205,"peas",0);
        game.physics.arcade.enable(pea);
        pea.body.immovable=true;
        pea.animations.add("peas",[0,1,2,3,4,5,6,7,8,9,10,11,12]);
        pea.play("peas",5,true);
        game.add.tween(pea).to({y:405},3500,null,true,0,-1,true);
        //豌豆火球
        bullets=game.add.group();
        bullets.enableBody = true;
        bullets.createMultiple(30,"fireball",0);
        bullets.setAll('outOfBoundsKill', true);
        bullets.setAll('checkWorldBounds', true);

        //第五梯队小龙骨骼动画
        dragon=addDragonBones();

        dragon.scale.x=0.5;
        dragon.scale.y=0.5;
        // game.time.events.loop(20, update, this);
        dragon.x=(sPos+7)*50;
        dragon.y=game.world.height-55;
        game.physics.arcade.enable(dragon);
        dragon.enableBody=true;
        game.add.tween(dragon).to({x:107*50},3500,null,true,0,-1,true);

        //键盘监听事件
        cursors=game.input.keyboard.createCursorKeys();
        initAnimation.onComplete.add(function () {
            player.frame=0;
            playerMove=true;
        },this);
    };
    this.update =function () {
        dragonBones.animation.WorldClock.clock.advanceTime(0.02);

        //火球发射
        if(((player.x>73*50+2&&player.x<73*50+10)||(player.x>96*50+2&&player.x<96*50+10))&&pea.alive)
            player.fireFlag=true;
        if(player.fireFlag)
            fire();

        if(player.x>47*50)
            playerSpeed=150;
        if(player.previousPosition.x>48*50&&player.previousPosition.x<71*50&&player.previousPosition.y>505)
        {
            gameOver();
        }
        //鲨鱼游泳
        Swim();
        //鲨鱼袭击
        Attack();
        //信息调试
        if(game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)){
            pea.revive();
            console.log("Hello");
            // console.log(player.y);
            // if(FLAG){
            //     FLAG=false;
            //     // console.log("Move up ...");
            //     // Attack();
            //     // console.log(shark);
            //     console.log("Attack...");
            //     console.log(player.previousPosition.x);
            // }
        }
        //链条信息打印，重置可裁剪参数
        if(game.input.keyboard.isDown(Phaser.Keyboard.T)){
            // if(!FLAG)
            //     console.log(chainTest);
            // FLAG=true;
            // console.log("chain pos :",chain.getChildAt(13).position);
            // console.log("chain info :",chain);
            // console.log("left:",chain.left,"right:",chain.right,"bottom",chain.bottom);
            if(FLAG){
                // console.log("Info:",chain.getChildAt(13));
                // console.log("Info:",chain.getChildAt(13).previ);
                FLAG=false;
            }
        }
        if(game.input.keyboard.isDown(Phaser.Keyboard.R)){
            if(!FLAG){
            }
           // console.log(chainTest.getChildAt(11));
            FLAG=true;
        }
        //隐藏链条
        if(game.input.keyboard.isDown(Phaser.Keyboard.H)){
            if(FLAG) {
                Attack(chain);
                FLAG=false;
                console.log("hide...");
            }
        }
        //显示链条
        if(game.input.keyboard.isDown(Phaser.Keyboard.S)){
            // chainTest.getChildAt(12).alpha=1;
            // chainTest.getChildAt(13).alpha=1;
            if(!FLAG){

                console.log("show...");
                FLAG=true;
            }
        }
        //玩家爬锁位置刷新
        if(player.isClimb){
            if(player.curChain.chainFlag){
                player.curChain.chainPos=!player.curDir;
                player.x=player.curChain.chainPos?player.x-player.curChain.x:player.x-player.curChain.x-player.width;
                player.y=player.y-player.curChain.y;
                player.parent=player.curChain;
                player.curChain.chainFlag=false;
            }
            player.x=player.curChain.chainPos?-13.5:13.5;
            player.y=player.y>0?player.y:0;
        }
        game.physics.arcade.collide(player,evilBoxGroup,reverseOperation);
        game.physics.arcade.collide(player,stoneGroup);
        game.physics.arcade.collide(player,groundLayer,null);
        game.physics.arcade.collide(player,obstacleHorizontalMove,syncMove);
        game.physics.arcade.collide(player,obstacleVerticalMove,syncMove);
        game.physics.arcade.collide(player,moveStoneChild1,syncMove);
        game.physics.arcade.collide(player,moveStoneChild2,syncMove);
        game.physics.arcade.collide(player,moveStoneChild3,syncMove);
        game.physics.arcade.collide(player,moveStoneChild4,syncMove);
        game.physics.arcade.collide(player,moveStoneChild5,syncMove);
        game.physics.arcade.collide(player,moveStoneChild6);
        game.physics.arcade.overlap(player,chain,climbChain);
        game.physics.arcade.overlap(player,chain1,climbChain);
        game.physics.arcade.overlap(player,chain2,climbChain);
        game.physics.arcade.overlap(player,chain3,climbChain);
        game.physics.arcade.overlap(player,bullets,fireAttack);
        game.physics.arcade.collide(player,pea,peaAttack);
        game.physics.arcade.collide(player,dragon);
        //链条碰撞测试
        // game.physics.arcade.collide(player,chainTest);

        var beltAction=game.physics.arcade.collide(player,belt);
        var beltLeftAction=game.physics.arcade.collide(player,belt2);
        //玩家恢复正常操作
        if((player.x<=20*50||player.x+player.width>=45*50)&&player.body.onFloor())
            resetConfig();
        playerSpeed=player.reverseFlag?-Math.abs(playerSpeed):Math.abs(playerSpeed);
        //锁链摆动
        chain.chainMove();
        chain1.chainMove();
        chain2.chainMove();
        chain3.chainMove();
        //玩家移动控制
        if(cursors.left.isDown){
            player.curDir=true;
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
            if(player.isClimb){
               // player.x=player.x<-13.5?-13.5:player.x;
               // console.log(player.x);
            }
        }else if(cursors.right.isDown){
            player.curDir=false;
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
            if(player.isClimb){
                //player.x=player.x>13.5?13.5:player.x;
              //  console.log(player.x);
            }
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
            if(player.isClimb) {
                var moveStyle=player.curChain.chainPos?"climb":"climbR";
                player.animations.play(moveStyle, 6, true);
                player.body.velocity.y = -playerSpeed;
                //跳跃离开锁链
                if (cursors.left.isDown || cursors.right.isDown)
                    leaveChain();
            }
            if(player.body.touching.down||player.body.onFloor())
                player.body.velocity.y=playerJump;
        }else if(cursors.down.isDown) {
            if(player.x>73*50&&player.x<96*50)
                player.body.velocity.y+=20;
            if(player.isClimb) {
                var moveStyle=player.curChain.chainPos?"climb":"climbR";
                player.body.velocity.y=-playerJump;
                player.animations.play(moveStyle,6,true);
                if(player.previousPosition.y>=player.curChain.getChildAt(player.curChain.hash.length-1).previousPosition.y+40)
                    leaveChain();
            }
        }else {
            if(player.isClimb){
                player.animations.stop("climb");
                player.body.gravity.y=0;
                player.body.velocity.y=0;
                player.frame=player.curChain.chainPos?13:16;
            }
        };
        if(player.body.touching.down||player.body.onFloor()){
            beltStop=false;
        }
    };
    //测试信息渲染
    this.render=function () {
        // game.debug.spriteBounds(player);
       // game.debug.spriteInfo(chainTest, 32, 32,"black");
      //  chainChildren.x=player.x;
    };
    //游戏结束
    function gameOver(){
        var reviveX=player.previousPosition.x;
        if(reviveX<18*50){
            player.x=350;
            player.y=250;
        }else if(reviveX<=45*50){
            player.x=18*50+25;
            player.y=10*50;
        }else if(reviveX>48*50&&reviveX<71*50){
            player.x=47*50;
            player.y=500;
            chainReset(chain);
            chainReset(chain1);
            chainReset(chain2);
            chainReset(chain3);
        }else if(reviveX>73*50&&reviveX<96*50){
            player.x=72*50;
            player.y=500;
            player.fireFlag=false;
            bullets.forEachAlive(function(child){
                child.kill();
            });
            pea.revive();
        };
        eleFactory();
        resetConfig();
    };
    //爬锁链
    function climbChain(obj1,obj2){
        obj1.isClimb=true;
        obj1.curChain=obj2.parent;
    };
    //离开锁链
    function leaveChain(){
        resetConfig();
        if(!player.curChain.chainFlag){
            player.parent=game.world;
            player.x=player.previousPosition.x;
            player.y=player.previousPosition.y;
            player.curChain.chainFlag=true;
            player.curChain=null;
        }
    }
    //滑块同步移动
    function syncMove(obj1,obj2) {
        if(obj2.movestyle=="vertical"){
            obj1.body.velocity.y=50;
        }
        obj1.x+=obj2.deltaX;
        obj1.y+=obj2.deltaY;
    };
    //玩家操作置反
    function reverseOperation(obj){
        if(obj.previousPosition.y-obj.body.y<-1)
            obj.reverseFlag=!obj.reverseFlag;
    };
    //玩家死亡复活后重置属性恢复场景
    function resetConfig(){
        player.reverseFlag=false;
        player.body.gravity.y=gravity;
        player.isClimb=false;
        player.parent=game.world;
    };
    //产生可下落stone
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
    //鲨鱼撕咬前半程
    function Attack(){
        // if(shark.attackFlag&&player.curChain){
        //     if(shark.y-player.previousPosition.y<=250){
        //         shark.attackFlag=true;
        //     }else{
        //         shark.attackFlag=false;
        //     }
        // }
        if(player.previousPosition.x>48*50&&(shark.y-player.previousPosition.y<=250)&&(shark.curDir=="left"&&((shark.x-player.previousPosition.x<=50)&&(shark.x-player.previousPosition.x>=0))||shark.curDir=="right"&&((player.previousPosition.x-shark.x<=50)&&(player.previousPosition.x-shark.x>=0)))&&shark.attackFlag){
            shark.state="up";
            shark.speed=0;
            var ackDistance=shark.curDir=="right"?shark.x+2*50:shark.x-2*50;
            var ackAngle=shark.curDir=="right"?-5:5;
            var ackDir=shark.curDir=="right"?"rAttack":"lAttack";
            var sharkAttack=game.add.tween(shark).to({x:ackDistance,y:game.world.height-230,angle:ackAngle},1000,Phaser.Easing.Elastic.In,true,0);
            sharkAttack.onComplete.add(attackDown);
            shark.animations.play(ackDir,8,true);
            game.time.events.add(350,sharkJump,this);
            game.time.events.add(900,waterDrop,this);
            shark.attackFlag=false;
        }
    };
    //鲨鱼撕咬后半程
    function attackDown(){
        console.log("player curChain:",player.curChain);
        //console.log(player.curChain);
        if(player.curChain!=null)
            chainCrack(player.curChain);
        else
            console.log("chain is false");
        // if(player.curChain!={})
        //     chainCrack(player.curChain);
       // chainCrack(player.curChain);
        shark.state="down";
        var ackDistance=shark.curDir=="right"?shark.x+2*50:shark.x-2*50;
        var ackAngle=0;
        var sharkAttackDown=game.add.tween(shark).to({x:ackDistance,y:game.world.height-70,angle:ackAngle},1000,Phaser.Easing.Elastic.Out,true,0);
        sharkAttackDown.onComplete.add(reSwim,this);
        game.time.events.add(300,waterDrop,this);
        shark.frame=shark.curDir=="left"?3:0;
        if(shark.y-player.previousPosition.y<30)
            gameOver();
    };
    //鲨鱼跳跃状态
    function sharkJump(){
        shark.animations.stop();
        shark.frame=shark.curDir=="left"?2:1;
    };
    //鲨鱼恢复游泳
    function reSwim(){
        shark.speed=sharkSpeed;
        shark.attackFlag=true;
    };
    //鲨鱼游泳
    function Swim(){
        if(shark.x>=68*50) {
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
    //水花效果
    function waterDrop(){
        var waterDropX;
        if(shark.state=="up")
            waterDropX=shark.curDir=="right"?shark.centerX+60:shark.centerX-100;
        else
            waterDropX=shark.centerX;
        var emitter = game.add.emitter(waterDropX,game.world.height-45);
        emitter.makeParticles('waterdrop');
        emitter.minParticleScale = 0.1;
        emitter.maxParticleScale = 0.8;
        emitter.setAlpha(0, 1,1200);
        emitter.minParticleSpeed.setTo(-95, -10);
        emitter.maxParticleSpeed.setTo(95, -70);
        emitter.start(true, 500, 80,80);
    };
    //链条下落水花
    function chainDropWater(waterDropX){
        console.log("waterDropX",waterDropX);
        var emitter = game.add.emitter(waterDropX,game.world.height-45);
        emitter.makeParticles('waterdrop');
        emitter.minParticleScale = 0.1;
        emitter.maxParticleScale = 0.8;
        emitter.setAlpha(0, 1,1000);
        emitter.minParticleSpeed.setTo(-55, -10);
        emitter.maxParticleSpeed.setTo(55, -60);
        emitter.start(true, 400, 50,50);
    };
    //链条下落效果
    function chainDown(pos){
        var chainDownPart=game.add.group();
        bottomGroup.add(chainDownPart);
        chainDownPart.enableBody=true;
        chainDownPart.position={x:pos.x,y:pos.y};
        var partDownPartOne=chainDownPart.create(0,20,"chain",0);
        var partDownPartTwo=chainDownPart.create(0,0,"chain",1);
        partDownPartOne.anchor.setTo(0.5,0);
        partDownPartOne.body.gravity.y=300;
        partDownPartTwo.anchor.setTo(0.5,0);
        partDownPartTwo.body.gravity.y=300;
        console.log("chainDown...");
    };
    //链条被咬掉的效果
    function chainCrack(chain){
        console.log("chainCrack is done ...");
        var pos={x:0,y:0};
        pos.x=chain.getChildAt(chain.hash.length-1).previousPosition.x;
        setTimeout(function(){
            chainDropWater(pos.x);
        },300*(16-chain.hash.length)/2);
        pos.y=chain.bottom-46-40*((14-chain.hash.length)/2);
        chainDown(pos);
        for (var i = chain.hash.length-2; i <=chain.hash.length; i++) {
            chain.getChildAt(i).alpha = 0;
            chain.removeFromHash(chain.getChildAt(i));
        }
    };
    //链条恢复
    function chainReset(chain) {
        for(var i=0;i<14;i++){
            if(chain.getChildAt(i).alpha==0){
                chain.getChildAt(i).alpha=1;
                chain.addToHash(chain.getChildAt(i));
            }
        }
    };
    function fire(){
        var bullet = bullets.getFirstExists(false);
        var timeSpan=6000*Math.random();
        if(bullet&&(game.time.now>fireTime)) {
            fireTime=game.time.now+timeSpan;
            bullet.reset(pea.position.x-40, pea.position.y);
            bullet.scale.setTo(0.8,0.8);
            bullet.body.velocity.x = -250;
            bullet.animations.add("fireball");
            bullet.play("fireball",6,true);
        }
    };
    function fireAttack(){
        gameOver();
    }
    function peaAttack(obj1,obj2){
        if(obj1.x>obj2.x&&obj1.x<obj2.x+obj2.width){
            obj2.kill();
            bullets.forEachAlive(function(child){
                child.kill();
            });
            obj1.fireFlag=false;
        }
    }
    function addDragonBones(){

        //give dragonBones a reference to the game object
        dragonBones.game = game;

        // hardcoded ids for the dragonBones elements to target
        var armatureName = "Dragon";//PigDragonBones";
        var skeletonId = "Dragon";//piggy";
        var animationId = "walk";//run";
        // fetch the skeletonData from cache
        var skeletonJSON = game.cache.getJSON('dragon');
        // fetch the atlas data from cache
        var atlasJson = game.cache.getJSON('dragon_atlas');
        // make an array listing the names of which images to use from the atlas
        //var partsList = ["arm_front", "head_ninja", "body", "fore_leg", "rear_leg", "rear arm"];
        var partsList = [
            "armL.png",
            "armR.png",
            "armUpperL.png",
            "armUpperR.png",
            "beardL.png",
            "beardR.png",
            "body.png",
            "clothes1.png",
            "eyeL.png",
            "eyeR.png",
            "hair.png",
            "handL.png",
            "handR.png",
            "head.png",
            "legL.png",
            "legR.png",
            "tail.png",
            "tailTip.png"
        ];
        // fetch the atlas image
        var texture = game.cache.getImage("dragon_image");
        // and the atlas id
        var atlasId = 'atlas1';
        // pass the variables all through to a utility method to generate the dragonBones armature

        var config = {
            armatureName: armatureName,
            skeletonId: skeletonId,
            animationId: animationId,
            atlasId: atlasId,
            partsList: partsList
        };

        var armature = dragonBones.makeArmaturePhaser(config, skeletonJSON, atlasJson, texture);


        //var armature = dragonBones.makePhaserArmature(armatureName, skeletonId, animationId, skeletonData, atlasJson, texture, partsList, atlasId);
        // get the root display object from the armature
        var bonesBase = armature.getDisplay();
        // position it
        bonesBase.x = 300;
        bonesBase.y = 500;
        // add it to the display list
        game.world.add(bonesBase);
        return bonesBase;
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
            var tweenIn=game.add.tween(tween).to({y:10}, 4000, Phaser.Easing.Exponential.Out,false);
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
            //console.log(game.time.totalElapsedSeconds().toFixed(3)-oldtime);
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
            playerRun=game.add.tween(player).to({x:700},3050,Phaser.Easing.Exponential.Out,true);
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
        var dustyOn=game.add.tween(dusty).to({alpha:1},300,Phaser.Easing.Exponential.Out,false);
        dustyOn.chain(game.add.tween(dusty).to({alpha:0},300,Phaser.Easing.Exponential.In,false));
        dustyOn.start();
    };
    //标题浮动
    this.titleFloat=function(){
        game.add.tween(title).to({y: 20}, 700, null, true, 0, Number.MAX_VALUE, true);
        bounceFlag++;
    };
    this.nextStage=function () {
        game.state.start("test");
    }
};

//主场景
game.States.main = function() {
    var player,cursors,map,groundLayer,belt,belt2,rope,trap;
    var obstacleHorizontalMove,obstacleVerticalMove;
    var playerSpeed=100;
    var playerJump=-200;
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
        obstacleVerticalMove=game.add.group();
        obstacleVerticalMove.enableBody=true;
        var obstacleGround1=obstacleVerticalMove.create(550,game.world.height-108,"ground");
        obstacleGround1.movestyle="vertical";//扩展对象属性，添加移动方式为垂直运动
        obstacleGround1.movespeed=70;//扩展对象属性，添加移动速度
        obstacleGround1.body.immovable=true;
        for(var i=0;i<obstacleVerticalMove.length;i++)
            game.add.tween(obstacleVerticalMove.getChildAt(i)).to({y:400},2000,null,true,0,-1,true);

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
            player.stick=false;
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
            player.stick=false;
        }else{
            player.animations.stop();
            if(playerMove)
                player.frame=0;
            player.body.velocity.x=0;
            if(beltAction)
                player.body.velocity.x+=playerSpeed/2;
            if(beltLeftAction)
                player.body.velocity.x-=playerSpeed/2;
            player.stick=true;
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
        // if(obj2.movestyle=="vertical")
        //     obj1.body.velocity.y=7;
        obj1.x+=obj2.x-obj2.previousPosition.x;
    };
    //玩家与绳子的碰撞检测
    function tiltCollide(object,tilt){
        var offsetX=Math.abs(object.x-tilt.x);
        var offsetY=Math.abs(object.y-tilt.y);
        if(offsetX<30&&offsetY<30&&object.stick) {
            player.x = tilt.x-16;
            player.y = tilt.y;
            player.body.gravity.y=0;
        }else{
            player.body.gravity.y=gravity;
        }

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