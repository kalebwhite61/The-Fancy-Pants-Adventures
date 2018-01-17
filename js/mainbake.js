game.stage.backgroundColor = '#000000';

emitter = game.add.emitter(game.world.centerX,game.world.height);
emitter.makeParticles('corona');
emitter.setAlpha(0.3, 1);
emitter.setScale(0.5, 1);
emitter.minParticleSpeed.setTo(-100, -300);
emitter.maxParticleSpeed.setTo(100, -400);
emitter.minParticleScale = 0.5;
emitter.maxParticleScale = 2;
emitter.gravity = 500;

//	false means don't explode all the sprites at once, but instead release at a rate of one particle per 100ms
//	The 5000 value is the lifespan of each particle before it's killed
emitter.start(true, 5000, null,50);
