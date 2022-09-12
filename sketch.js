var canvas;
var backgroundImage;
var bgImg;
var database;
var form, player;
var playerCount;
var gameState
var carro1
var carro2
var imgcarro1
var imgcarro2
var carros=[]
var allPlayers
var pista

function preload() {
  backgroundImage = loadImage("./assets/planodefundo.png");
  imgcarro1=loadImage("./assets/car1.png");
  imgcarro2=loadImage("./assets/car2.png");
  pista=loadImage("./assets/PISTA.png");
}

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  database = firebase.database();
  game = new Game();
  game.getState()
  game.start();

}

function draw() {
  background(backgroundImage);
  if(playerCount===2){
  game.update()
  }
  if(gameState===1){
  game.play()
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
