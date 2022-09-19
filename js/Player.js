class Player {
  constructor() {
    this.name = null;
    this.index = null;
    this.positionX = 0;
    this.positionY = 0;

    this.rank = 0;
    this.score = 0;
    this.fuel = 185;
    this.life = 185;   
     
  }

  addPlayer() {
    
    var playerIndex = "players/player" + this.index;

    if (this.index === 1) {
      //posição na metade esquerda
      this.positionX = width / 2 - 100;
    } else {
      //posição na metade direita
      this.positionX = width / 2 + 100;
    }

    //atualiza o campo no BD
    //ref localiza e set salva
    database.ref(playerIndex).set({
      name: this.name,
      positionX: this.positionX,
      positionY: this.positionY,

      rank: this.rank,
      score: this.score,
    });
  }

  //Obter as posições dos carros do BD
  getDistance() { 
    var playerDistanceRef = database.ref("players/player" + this.index);
    playerDistanceRef.on("value", data => {
      var data = data.val();
      //dados em JSON
      //posições já criadas em constructor
      this.positionX = data.positionX;
      this.positionY = data.positionY;
    });
  }
  
  //atualiza a posição no BD
  update() {
    var playerIndex = "players/player" + this.index;
    //ref é a localização no bando e update atualiza o campo
    database.ref(playerIndex).update({
      positionX: this.positionX,
      positionY: this.positionY,

      rank: this.rank,
      score: this.score
    });
  }

  //lê a informação DO BD
  getCount() {
    var playerCountRef = database.ref("playerCount");
    //ouve as mudanças da variavel
    playerCountRef.on("value", data => {
      //copia o valor do BD para a variável
      playerCount = data.val();
    });
  }

  //atualiza o campo NO BD
  updateCount(count) {
    //referencia a localização no B
    database.ref("/").update({//salva o valor da variável no campo
      playerCount: count
    });
  }

  //buscar dados jogador no BD
  //função estática não é anexada a nenhum jogador/objeto em particular
  //são chamdas pela classe
  static getPlayersInfo() {
    var playerInfoRef = database.ref("players");
    playerInfoRef.on("value", data => {
      allPlayers = data.val();
      //dados são armazenados em formato JSON
    });
  }
  carrosnofinal(){
    database.ref("carrosnofinal").on("value",data=>{
      this.rank=data.val()
    })
  }
  static updatecarrosnofinal(rank){
   database.ref("/").update({
   carrosnofinal:rank
   })
  }
}

