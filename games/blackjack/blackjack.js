let player_poss = [2]
let dealer_poss = [2]
let hit = 72
let stand = 83
let cards = ["../art/ace_of_clubs.svg", "../art/ace_of_diamonds.svg", "../art/ace_of_hearts.svg", "../art/ace_of_spades.svg",
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
let in_game = false

let num_player_cards = 0
let num_dealer_cards = 0

let player_wins = 0
let dealer_wins = 0



async function play() {
    // First deal initial cards me->dealer->me->dealer hidden
    player_div = document.getElementById("player-cards")
    dealer_div = document.getElementById("dealer-cards")
    result_div = document.getElementById("result-text")
    prompt_div = document.getElementById("game-prompt")
    score_div = document.getElementById("score-text")
    resetGame(player_div, dealer_div, result_div, prompt_div)
    in_game = true
    score_div.innerHTML = "Player " + player_wins + " : " + dealer_wins + " Dealer"

    getCard(player_div)
    num_player_cards++
    await pauseForEffect()
    getCard(dealer_div)
    num_dealer_cards++
    await pauseForEffect()
    getCard(player_div)
    num_player_cards++

    prompt_div.innerHTML = "Hit or Stand? (H/S)"
    let player_choice = 'd'
    while(player_choice != 's' && in_game === true){
      player_choice = await waitingKeypress()
      if(player_choice === 'h'){
        getCard(player_div)
        num_player_cards++
      }
      if(player_poss[0] > 21){
        result_div.innerHTML = "You loose mate!!"
        dealer_wins++
        score_div.innerHTML = "Player " + player_wins + " : " + dealer_wins + " Dealer"
        in_game = false
      }
    }

    if(in_game === true){
      if(player_poss[0] === 21){
        result_div.innerHTML = "Player Wins!!"
        player_wins++
        score_div.innerHTML = "Player " + player_wins + " : " + dealer_wins + " Dealer"
        in_game = false
      }
    }
    if(in_game){
      while(dealer_poss[0] < 17){
        getCard(dealer_div)
        num_dealer_cards++
      }
  
      if(dealer_poss[0] > 21){
        result_div.innerHTML = "Player Wins!!"
        player_wins++
        score_div.innerHTML = "Player " + player_wins + " : " + dealer_wins + " Dealer"
      }else if(dealer_poss[0] > player_poss[0]){
        result_div.innerHTML = "You loose mate!!"
        dealer_wins++
        score_div.innerHTML = "Player " + player_wins + " : " + dealer_wins + " Dealer"
      }else if(dealer_poss[0] === player_poss[0]){
        result_div.innerHTML = "Push"
      }else{
        result_div.innerHTML = "You Win!!"
        player_wins++
        score_div.innerHTML = "Player " + player_wins + " : " + dealer_wins + " Dealer"
      }
    }
    prompt_div.innerHTML = ""
    in_game = false
    if(dealer_wins == 5){
      score_div.innerHTML = "You've lost 5 games, see it off"
      dealer_wins = 0
      player_wins = 0
    }else if(player_wins == 3){
      score_div.innerHTML = "You've won 3 games, choose someone to see one off"
      dealer_wins = 0
      player_wins = 0
    }
}

function pauseForEffect(){
  return new Promise(resolve => {
    setTimeout(resolve, 300)
  })
}

function resetGame(player_div, dealer_div, result_div){
  player_div.innerHTML = ""
  dealer_div.innerHTML = ""
  result_div.innerHTML = ""
  num_dealer_cards = 0
  num_player_cards = 0
  game_input = ''
  player_poss[0] = 0
  player_poss[1] = 0
  dealer_poss[0] = 0
  dealer_poss[1] = 0
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
  imgElement.style.left = `${index * 45}px`;
  person.appendChild(imgElement);
  updateScores(cardNum, person)
}

// update the corresponding score
function updateScores(card_num, person){
  card_num = card_num + 1
  if(card_num > 10) card_num = 10
  if(person === player_div){
    player_poss[0] += card_num
  }else{
    dealer_poss[0] += card_num
  }
}

// Promise based key press handler
function waitingKeypress() {
    return new Promise((resolve) => {
      document.addEventListener('keydown', onKeyHandler);
      function onKeyHandler(e) {
        if(e.keyCode === hit) {
            resolve('h')
        }else if(e.keyCode === stand){
            resolve('s')
        }
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
