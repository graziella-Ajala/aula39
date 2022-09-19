class Game {
  constructor() {
    this.resetTitle = createElement("h2");
    this.resetButton = createButton("");
    this.playerMoving=false
    this.leadeboardTitle = createElement("h2");

    this.leader1 = createElement("h2");
    this.leader2 = createElement("h2");
  }

  start() {
    form = new Form();
    form.display();
    player = new Player();
    playerCount=player.getCount()
    carro1 = createSprite(width/2-100,height-100);
    carro1.addImage("carro1",imgcarro1);
    carro1.scale=0.05;
    carro2 =createSprite(width/2+100,height-100);
    carro2.addImage("carro2",imgcarro2);
    carro2.scale=0.05;
    carros=[carro1,carro2]
    combustivelgrupo=new Group()
    moedagrupo=new Group()
    obstaculogrupo=new Group()
    this.addSprites(combustivelgrupo,10,combustivel,0.02)
    this.addSprites(moedagrupo,15,moeda,0.09)
    var obstaclesPositions = [
      { x: width / 2 + 250, y: height - 800, image: obstaculo2 },
      { x: width / 2 - 150, y: height - 1300, image: obstaculo1 },
      { x: width / 2 + 250, y: height - 1800, image: obstaculo1 },
      { x: width / 2 - 180, y: height - 2300, image: obstaculo2 },
      { x: width / 2, y: height - 2800, image: obstaculo2 },
      { x: width / 2 - 180, y: height - 3300, image: obstaculo1 },
      { x: width / 2 + 180, y: height - 3300, image: obstaculo2 },
      { x: width / 2 + 250, y: height - 3800, image: obstaculo2 },
      { x: width / 2 - 150, y: height - 4300, image: obstaculo1 },
      { x: width / 2 + 250, y: height - 4800, image: obstaculo2 },
      { x: width / 2, y: height - 5300, image: obstaculo1 },
      { x: width / 2 - 180, y: height - 5500, image: obstaculo2 }
    ];
    this.addSprites(obstaculogrupo,obstaclesPositions.length,obstaculo2,0.04,obstaclesPositions)
  }
  
  getState(){
    var gameStateRef=database.ref("gameState")
    gameStateRef.on("value",function(data){
      gameState=data.val()
    })
  }
  update(state){
    database.ref("/").update({
      gameState:state
    })
  }
  play(){
  this.handleElements()
  this.botaodereset()
  Player.getPlayersInfo()
  player.carrosnofinal()
  if(allPlayers!==undefined){
  image(pista,0,-height*5,width,height*6)
  this.showLeaderboard()
  this.showLife()
  this.showFuelBar()
  var index=0
  for (var plr in allPlayers) {
    index += 1;

    //use os dados do banco de dados para exibir os carros nas direções x e y
    var x = allPlayers[plr].positionX;
    var y = height - allPlayers[plr].positionY;//jogador na parte inferior da tela

    //posição também para os carros
    carros[index - 1].position.x = x;
    carros[index - 1].position.y = y;
    if(index===player.index){
    fill("white")
    ellipse(x,y,60,60)
    camera.position.y=carros[index-1].position.y
    this.tirarmoeda(index)
    this.tirarcombustivel(index)
    }
  }
  drawSprites()
  this.handlePlayercontrol()
  const linhadechegada=height*6-100
  if(player.positionY>linhadechegada){
   gameState=2
   player.rank+=1
   Player.updatecarrosnofinal(player.rank)
   player.update()
   this.showRank()
  }
  if(!this.playerMoving){
  player.positionY+=5
  player.update()
  }
  }
  }
  handleElements() {
    //oculta o form quando está no modo de jogo
    form.hide();
    //muda posição do titulo
    form.titleImg.position(40, 50);
    form.titleImg.class("gameTitleAfterEffect");
    this.resetTitle.html("Reinicar Jogo");
    this.resetTitle.class("resetText");
    this.resetTitle.position(width / 2 + 200, 40);

    this.resetButton.class("resetButton");
    this.resetButton.position(width / 2 + 230, 100);

    this.leadeboardTitle.html("Placar");
    this.leadeboardTitle.class("resetText");
    this.leadeboardTitle.position(width / 3 - 60, 40);

    this.leader1.class("leadersText");
    this.leader1.position(width / 3 - 50, 80);

    this.leader2.class("leadersText");
    this.leader2.position(width / 3 - 50, 130);
  }
  handlePlayercontrol(){
   if(keyIsDown(UP_ARROW)){
   player.positionY+=10
   this.playerMoving=true
   player.update()

   }
   if(keyIsDown(LEFT_ARROW)&&player.positionX>width/3-50){
   player.positionX-=5
   player.update()
   }
   if(keyIsDown(RIGHT_ARROW)&&player.positionX<width/2+300){
  player.positionX+=5
  player.update()
   }
  }
  showLeaderboard() {
    var leader1, leader2;
    //retorna matriz de valores enumeraveis dos objetos
    var players = Object.values(allPlayers);
    //verifica se o jogador 1 está no rank 1
    if ((players[0].rank === 0 && players[1].rank === 0)
        || players[0].rank === 1){
      // &emsp;    Essa etiqueta é usada para exibir quatro espaços.
      //exibe o texto na tela por ordem de jogador
      leader1 = players[0].rank +
                "&emsp;" + players[0].name +
                "&emsp;" + players[0].score;

      leader2 = players[1].rank +
                "&emsp;" + players[1].name +
                "&emsp;" + players[1].score;
    }

    //verifica se o jogador 2 está no rank 1
    if (players[1].rank === 1) {
      leader1 = players[1].rank +
                "&emsp;" + players[1].name +
                "&emsp;" + players[1].score;

      leader2 = players[0].rank +
                "&emsp;" + players[0].name +
                "&emsp;" + players[0].score;
    }

    //passar lideres como elementos html
    this.leader1.html(leader1);
    this.leader2.html(leader2);
  }
  botaodereset(){
  this.resetButton.mousePressed(()=>{
  database.ref("/").set({
  playerCount:0,
  gameState:0,
  players:{},
  carrosnofinal:0
  })
  window.location.reload()
  })
  }
  addSprites(spriteGroup, numberOfSprites, spriteImage, scale, positions = []) {
    for (var i = 0; i < numberOfSprites; i++) {
      var x, y;

      //Se a matriz NÃO  estiver vazia
      // adicionar as posições da matriz à x e y
      if (positions.length > 0) {
        x = positions[i].x;
        y = positions[i].y;
        spriteImage = positions[i].image;

      } else {

        //aleatório para as metades da tela em x e y
      x = random(width / 2 + 150, width / 2 - 150);
      y = random(-height * 4.5, height - 400);

      }

      //criar sprite nas posições aleatórias
      var sprite = createSprite(x, y);
      sprite.addImage("sprite", spriteImage);

      sprite.scale = scale;
      spriteGroup.add(sprite);

    }
  }  
  tirarcombustivel(index){
  carros[index-1].overlap(combustivelgrupo,function(collector,collected){
  player.fuel=185
  collected.remove()
  })
  if(player.fuel>0&&!this.playerMoving){
  player.fuel-=0.3
  }
  if(player.fuel<=0){
  gameState=2
  this.gameOver()
  }
  }
   tirarmoeda(index){
    carros[index-1].overlap( moedagrupo,function(collector,collected){
    player.score+=10
    player.update()
    collected.remove()
    })
    }
    showRank() {
      swal({
        //title: `Incrível!${"\n"}Rank${"\n"}${player.rank}`,
        title: `Incrível!${"\n"}${player.rank}º lugar`,
        text: "Você alcançou a linha de chegada com sucesso!",
        imageUrl:
          "https://raw.githubusercontent.com/vishalgaddam873/p5-multiplayer-car-race-game/master/assets/cup.png",
        imageSize: "100x100",
        confirmButtonText: "Ok"
      });
    }
    showLife() {
      push();
      image(lifeImage, width / 2 - 130, height - player.positionY - 300, 20, 20);
      fill("white");
      rect(width / 2 - 100, height - player.positionY - 300, 185, 20);
      fill("#C2331D");
      rect(width / 2 - 100, height - player.positionY - 300, player.life, 20);
      noStroke();
      pop();
    }
  
    //barra combustivel
    showFuelBar() {
      push();
      image(combustivel, width / 2 - 130, height - player.positionY - 300, 20, 20);
      fill("white");
      rect(width / 2 - 100, height - player.positionY - 300, 185, 20);
      fill("#ffc400");
      rect(width / 2 - 100, height - player.positionY - 300, player.fuel, 20);
      noStroke();
      pop();
    }
  
    //final de jogo
    gameOver() {
      swal({
        title: `Fim de Jogo`,
        text: "Oops você perdeu a corrida!",
        imageUrl:
          "https://cdn.shopify.com/s/files/1/1061/1924/products/Thumbs_Down_Sign_Emoji_Icon_ios10_grande.png",
        imageSize: "100x100",
        confirmButtonText: "Obrigado por jogar"
      });
    }
}
