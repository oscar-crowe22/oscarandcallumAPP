const cards = [
  "../art/ace_of_clubs.svg", "../art/ace_of_diamonds.svg", "../art/ace_of_hearts.svg", "../art/ace_of_spades.svg",
  "../art/2_of_clubs.svg", "../art/2_of_diamonds.svg", "../art/2_of_hearts.svg", "../art/2_of_spades.svg",
  "../art/3_of_clubs.svg", "../art/3_of_diamonds.svg", "../art/3_of_hearts.svg", "../art/3_of_spades.svg",
  "../art/4_of_clubs.svg", "../art/4_of_diamonds.svg", "../art/4_of_hearts.svg", "../art/4_of_spades.svg",
  "../art/5_of_clubs.svg", "../art/5_of_diamonds.svg", "../art/5_of_hearts.svg", "../art/5_of_spades.svg",
  "../art/6_of_clubs.svg", "../art/6_of_diamonds.svg", "../art/6_of_hearts.svg", "../art/6_of_spades.svg",
  "../art/7_of_clubs.svg", "../art/7_of_diamonds.svg", "../art/7_of_hearts.svg", "../art/7_of_spades.svg",
  "../art/8_of_clubs.svg", "../art/8_of_diamonds.svg", "../art/8_of_hearts.svg", "../art/8_of_spades.svg",
  "../art/9_of_clubs.svg", "../art/9_of_diamonds.svg", "../art/9_of_hearts.svg", "../art/9_of_spades.svg",
  "../art/10_of_clubs.svg", "../art/10_of_diamonds.svg", "../art/10_of_hearts.svg", "../art/10_of_spades.svg",
  "../art/jack_of_clubs.svg", "../art/jack_of_diamonds.svg", "../art/jack_of_hearts.svg", "../art/jack_of_spades.svg",
  "../art/queen_of_clubs.svg", "../art/queen_of_diamonds.svg", "../art/queen_of_hearts.svg", "../art/queen_of_spades.svg",
  "../art/king_of_clubs.svg", "../art/king_of_diamonds.svg", "../art/king_of_hearts.svg", "../art/king_of_spades.svg",
]
const hit = 72 // KEY CODE FOR HITTING
const stand = 83 // KEY CODE FOR STANDING

let in_game = false
let num_player_cards = 0
let num_dealer_cards = 0
let player_wins = 0
let dealer_wins = 0


// main function running 1v1 blackjack game
async function play() {
    player_div = document.getElementById("player-cards")
    dealer_div = document.getElementById("dealer-cards")
    result_div = document.getElementById("result-text")
    prompt_div = document.getElementById("game-prompt")
    score_div = document.getElementById("score-text")
    player_label_div = document.getElementById("player-label-text")
    dealer_label_div = document.getElementById("dealer-label-text")
    buttons = {
      play: document.getElementById("play-button"),
      hit: document.getElementById("hit-button"),
      stand: document.getElementById("stand-button")
    }

    buttons.hit.hidden = false;
    buttons.stand.hidden = false;
  
    resetGame(player_div, dealer_div, result_div, prompt_div)
    in_game = true
    score_div.innerHTML = "Player " + player_wins + " : " + dealer_wins + " Dealer"

    // First deal initial cards me->dealer->me->dealer hidden
    getCard(player_div)
    num_player_cards++
    await pauseForEffect()
    getCard(dealer_div)
    num_dealer_cards++
    await pauseForEffect()
    getCard(player_div)
    num_player_cards++

    // Check for blackjack
    if(in_game === true){
      for(let i = 0; i< player_poss.length; i++){
        if(player_poss[i] === 21){
          result_div.innerHTML = "BLACK JACK!!"
          player_wins++
          score_div.innerHTML = "Player " + player_wins + " : " + dealer_wins + " Dealer"
          in_game = false
          buttons.hit.hidden = true;
          buttons.stand.hidden = true;
        }
      }
    }

    // Let the player continue hitting until they bust
    prompt_div.innerHTML = "Hit or Stand? (H/S)"
    let player_choice = 'd'
    while(player_choice != 's' && in_game === true){
      player_choice = await waitingButtonClick()
      if(player_choice === 'h'){
        getCard(player_div)
        num_player_cards++
      }
      if(player_poss[0] > 21){
        result_div.innerHTML = "You lose mate!!"
        dealer_wins++
        score_div.innerHTML = "Player " + player_wins + " : " + dealer_wins + " Dealer"
        in_game = false
        buttons.hit.hidden = true;
        buttons.stand.hidden = true;
      }
    }

    // Dealer draws until > 16 or bust
    if(in_game){
      while(dealer_poss[0] < 17){
        if(dealer_poss[1] > 16 && dealer_poss[1] < 22){
          break;
        }
        getCard(dealer_div)
        num_dealer_cards++
      }
      const dealerBest = dealer_poss
        .filter(score => score < 22) // keep only values under 22
        .reduce((max, score) => Math.max(max, score), 0) ?? dealer_poss[0]
      const playerBest = player_poss
        .filter(score => score < 22) // keep only values under 22
        .reduce((max, score) => Math.max(max, score), 0) ?? player_poss[0]
      // if the dealer busts
      if(dealerBest > 21){
        result_div.innerHTML = "Player Wins!!"
        player_wins++
        score_div.innerHTML = "Player " + player_wins + " : " + dealer_wins + " Dealer"
      // if the dealer has a better hand than the player
      }else if(dealerBest > playerBest){
        result_div.innerHTML = "You lose mate!!"
        dealer_wins++
        score_div.innerHTML = "Player " + player_wins + " : " + dealer_wins + " Dealer"
      // if the scores are even --> push
      }else if(dealerBest === playerBest){
        result_div.innerHTML = "Push"
      // otherwise the plyer must have won
      }else{
        result_div.innerHTML = "You Win!!"
        player_wins++
        score_div.innerHTML = "Player " + player_wins + " : " + dealer_wins + " Dealer"
      }
    }

    // keep track of global score
    prompt_div.innerHTML = ""
    in_game = false
    buttons.hit.hidden = true;
    buttons.stand.hidden = true;
    if(dealer_wins == 3){
      score_div.innerHTML = "You've lost 3 games, see it off"
      dealer_wins = 0
      player_wins = 0
    }else if(player_wins == 3){
      score_div.innerHTML = "You've won 3 games, choose someone to see one off"
      dealer_wins = 0
      player_wins = 0
    }
}

// pause during dealing for effect
function pauseForEffect(){
  return new Promise(resolve => {
    setTimeout(resolve, 300)
  })
}

// reset game params
function resetGame(player_div, dealer_div, result_div){
  player_div.innerHTML = ""
  dealer_div.innerHTML = ""
  result_div.innerHTML = ""
  player_label_div.innerHTML = "Player Has"
  dealer_label_div.innerHTML = "Dealer Has"
  num_dealer_cards = 0
  num_player_cards = 0
  game_input = ''
  player_poss[0] = 0
  player_poss[1] = 0
  dealer_poss[0] = 0
  dealer_poss[1] = 0
  player_ace = false;
  dealer_ace = false;
}

// get a random card
function getCard(person){
    let card_num = Math.floor(Math.random() * (13 - 1 + 1));
    renderCard(card_num, person)
}

// render it to correct side
function renderCard(cardNum, person){
  let ran_card = Math.floor(Math.random() * (3 - 0 + 1) + 0);
  const svgPath = cards[(cardNum * 4) + ran_card];  // Replace with the actual path
  const imgElement = document.createElement('img');
  imgElement.src = svgPath;
  imgElement.className = "cards"
  if(person === player_div) index = num_player_cards
  if(person === dealer_div) index = num_dealer_cards
  imgElement.style.left = `${index * 32}px`;
  person.appendChild(imgElement);
  updateScores(cardNum, person)
}

let player_poss = [2]
let dealer_poss = [2]  
let player_ace = false;
let dealer_ace = false;

// update the corresponding score
function updateScores(card_num, person){
  card_num = card_num + 1
  // set all picture cards to a value of 10
  if(card_num > 10) card_num = 10

  // update scores and handle ace conditions
  if(person === player_div){
    if(card_num === 1 && player_ace === false){
      player_poss[0] += card_num
      player_poss[1] += 11
      player_ace = true
    }else{
      player_poss[0] += card_num
      player_poss[1] += card_num
    }
    if(player_ace === true){
      player_label_div.innerHTML = 'Player Has: ' + player_poss[0] + " " + player_poss[1];
    }else{
      player_label_div.innerHTML = 'Player Has: ' + player_poss[0];
    }
  }else{
    if(card_num === 1 && dealer_ace === false){
      dealer_poss[0] += card_num
      dealer_poss[1] += 11
      dealer_ace = true
    }else{
      dealer_poss[0] += card_num
      dealer_poss[1] += card_num
    }
    if(dealer_ace === true){
      dealer_label_div.innerHTML = 'Dealer Has: ' + dealer_poss[0] + " " + dealer_poss[1];
    }else{
      dealer_label_div.innerHTML = 'Dealer Has: ' + dealer_poss[0];
    }
  }
}

function waitingButtonClick() {
  return new Promise((resolve) => {
    const hitBtn = document.getElementById('hit-button');
    const standBtn = document.getElementById('stand-button');

    hitBtn.addEventListener('click', onHit);
    standBtn.addEventListener('click', onStand);

    function onHit() {
      cleanup();
      resolve('h');
    }

    function onStand() {
      cleanup();
      resolve('s');
    }

    function cleanup() {
      hitBtn.removeEventListener('click', onHit);
      standBtn.removeEventListener('click', onStand);
    }
  });
}

// Live key press helper
function whichKey(e) { 
    e = e || window.event; 
    let charCode = e.keyCode || e.which; 
    return String.fromCharCode(charCode); 
}

// Live key press handler
window.addEventListener('keypress', function (e) { 
    let key = whichKey(e)
    if(key == 'p' && in_game === false) play()
    if(key == 'q') window.location.pathname = "../index.html";
}, false);
