var GoodFighter;
var hero_x;
var enemies;
var bullets;
var bg;
var count;
var hero;
var counter=0;
var interval=60;
var lives=3;
var wave="standard";
var score=0;
var barrierLeft;
var barrierRight;
var deathBarrier;
var topBarrier;
var bossRight;
var bossLeft;
var GoodFighterImage;
var bulletImage;
var enemyImage;
var boss=false;
var bossHealth=50;
var bossWhale;
var bossWhaleImg;


function setup() {
  // Creating images
  createCanvas(windowWidth,windowHeight);
  enemyImage = loadImage('Images/Enemy2.gif');
  bulletImage = loadImage('Images/bullet.png');
  GoodFighterImage = loadImage('Images/GoodFighter.png');
  bossWhaleImg = loadImage('Images/Whale.png');

  hero_x=windowWidth/2;

  frameRate(60);

  //Creating sprites
  GoodFighter = createSprite(hero_x,windowHeight-80,128,128);
  GoodFighter.addImage(GoodFighterImage);

  barrierLeft = createSprite(0,0,1,windowHeight*2);
  barrierRight = createSprite(windowWidth,0,1,windowHeight*2);

  barrierRight.shapeColor = color(30,64,120);
  barrierLeft.shapeColor = color(30,64,120);

  deathBarrier = createSprite(0,windowHeight,windowWidth*2,1);
  deathBarrier.shapeColor = color(0);

  topBarrier = createSprite(0,0,windowWidth*2,1);
  topBarrier.shapeColor = color(30,64,120);

  bossLeft = createSprite(0,0,1,windowHeight);
  bossRight = createSprite(windowWidth,0,1,windowHeight);

  bossRight.shapeColor = color(30,64,120);
  bossLeft.shapeColor = color(30,64,120);


  enemies = new Group();
  bullets = new Group();
}


function draw(){

  background(41,62,96);
  fill(239,245,255);
  stroke(255,255,255);
  textSize(25);
  text('Statistics\n',15,35);
  textSize(18);
  text('Score: '+score+'\nWave: '+wave+'\nLives: '+lives,15,60);
  if(boss==true){
    text('----------\nBoss Health: '+bossHealth,15,125);
  }  
  if(score<(-99)){
    console.log('test');
    easterEgg();
  }

  if(lives==0){
    gameOver();
  }

  //Setting up wall barriers so users character doesn't go off screen
  if(GoodFighter.collide(barrierRight)){
    GoodFighter.velocity.x=0;
  }
  if(GoodFighter.collide(barrierLeft)){
    GoodFighter.velocity.x=0;
  }
  //Movement barriers for bossWhale
  if(boss==true && (bossWhale.collide(bossRight) || bossWhale.collide(bossLeft))){
    bossWhale.velocity.x *= -1;
  }
  //Movement
  if(keyDown('a')){
    GoodFighter.velocity.x = -8;
  }
  if(keyWentUp('a')){
    GoodFighter.velocity.x=0;
  }
  if(keyDown('d')){
    GoodFighter.velocity.x = 8;
  }
  if(keyWentUp('d')){
    GoodFighter.velocity.x=0;
  }
  //Shooting
  if(keyWentDown(' ')){
    shoot(count);
  }
  if(keyDown(' ')){
    shoot(count+1); //Adding one to not shoot two sprites on first click
    count++; //Iterating count to constantly shoot
  }
  if(keyWentUp(' ')){
    count=0; //Makes sure to have same time delay when shooting on every press of key
  }
  //Spawning enemy
  if(counter%interval==0){
    enemy = newEnemy();
  }
  if(score>200){
    bossFight();
  }
  //If enemy collides with GoodFighter than delete enemy
  GoodFighter.overlap(enemies,playerHit);
  deathBarrier.overlap(enemies,hitBottom);
  topBarrier.overlap(bullets,hitTop);
  bullets.overlap(enemies,shotHit);
  if(boss==true){
    bossWhale.overlap(bullets,bossHit);
    bossWhale.overlap(GoodFighter,playerKilled);

  }

  counter++;

  drawSprites();
}
//function that generates bullets
function shoot(n){
  //Using if statement to regulate speed of shooting when key is held down
  if(n%15==0){
    var bullet = createSprite(GoodFighter.position.x,GoodFighter.position.y-64,20,20);
    bullet.addImage(bulletImage);
    bullet.velocity.y = -10;
    bullets.add(bullet);
  }
}
function hitTop(t,b){
  b.remove();
}
//Function that spawns in enemies
function newEnemy(){
  var min = 100;
  var max = windowWidth-100;
  var pos = Math.random() * (max-min) + min;
  var enemy = createSprite(pos,0,95,95);
  enemy.addImage(enemyImage);
  enemy.velocity.y=6;
  enemies.add(enemy);
}

function shotHit(b,e){
  score+=25;
  e.remove();
  b.remove();
}

function playerHit(g,e){
  lives--;
  e.remove();
}
function hitBottom(d,e){
  score-=10;
  e.remove();
}

function gameOver(){
  textSize(80);
  stroke(0);
  fill(0);
  if(bossHealth > 0){
    text("GAME OVER",windowWidth/3,windowHeight/2);
  }
  else{
    text("YOU WIN!!",windowWidth/3,windowHeight/2);
  }

  enemies.removeSprites();
  bullets.removeSprites();
  powerUp.remove();
  noLoop();
}

function bossFight(){
  wave="BOSS!!";
  enemies.removeSprites();
  if(boss==false){
    boss=true;
    bossWhale = createSprite(windowWidth/2,150,400,273);
    bossWhale.addImage(bossWhaleImg);
    bossWhale.velocity.x = 3;
    bossWhale.velocity.y = 0.5;
  }
}

function easterEgg(){
  GoodFighter.velocity.y = -3;
  wave="EggEaster";
  score=-420;
  lives=69;
  bullets.removeSprites();
  enemies.removeSprites();
  textSize(80);
  stroke(255);
  fill(255);
  text('MERRY CHRISTMAS',windowWidth/3.75,windowHeight/2);
}

function bossHit(boss,bullet){
  bullet.remove();
  bossHealth--;
  if(bossHealth == 0){
      boss.remove();
      gameOver();
    }
}
function playerKilled(boss,player){
  player.remove();
  gameOver();
}
