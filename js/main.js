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
    this.create = function() {
        game.state.start('preload');
    };
};

game.States.preload = function() {
    this.preload = function() {

    };
    this.create = function() {

    };
};

//主场景
game.States.main = function() {
    this.create = function() {

    };
};


game.States.start = function() {
    this.create = function() {

    };
};



//添加场景
game.state.add('boot', game.States.boot);
game.state.add('preload', game.States.preload);
// game.state.add('main', game.States.main);
// game.state.add('start', game.States.start);
// game.state.add('over', game.States.over);

//启动boot场景
game.state.start('boot');