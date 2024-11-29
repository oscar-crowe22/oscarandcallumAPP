let player_poss = [2]
let dealer_poss = [2]
let hit = 72
let stand = 83
let game_input = ''
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


async function play() {
    // First deal initial cards me->dealer->me->dealer hidden
    player_div = document.getElementById("player-cards")
    dealer_div = document.getElementById("dealer-cards")
    getCard(player_div)
    getCard(dealer_div)
    getCard(player_div)
    let keypress = await waitingKeypress()
    
}

// get a random card
function getCard(person){
    let card_num = Math.floor(Math.random() * (13 - 1 + 1));
    console.log(card_num)
    renderCard(card_num, person)
}

// render it to correct side
function renderCard(cardNum, person){
  let ran_card = Math.floor(Math.random() * (3 - 0 + 1) + 0);
  const svgPath = cards[(cardNum * 4) + ran_card];  // Replace with the actual path
  const imgElement = document.createElement('img');
  console.log(svgPath)
  imgElement.src = svgPath;
  imgElement.className = "cards"
  person.appendChild(imgElement);
  updateScores(cardNum)
}

// update the corresponding score
function updateScores(card_num, person){
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
    if(key == 'p') play()
    if(key == 'q') window.location.pathname = "../index.html";
}, false);
