// Game State
let gameState = {
    deck: [],
    piles: [[], [], [], [], []], // 5 piles, each starts with one card
    currentPosition: 0, // 0-4 (corresponding to piles 1-5)
    direction: null, // 'left' or 'right'
    strikes: 0,
    gameStarted: false,
    isGuessing: false,
    nextCard: null
};

// Card definitions - using same structure as blackjack
const cardPaths = [
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
    "../art/king_of_clubs.svg", "../art/king_of_diamonds.svg", "../art/king_of_hearts.svg", "../art/king_of_spades.svg"
];

// DOM Elements
let elements = {};

// Initialize game when DOM loads
document.addEventListener('DOMContentLoaded', function() {
    initializeElements();
    bindEventListeners();
    resetGame();
});

function initializeElements() {
    elements = {
        directionSelector: document.getElementById('direction-selector'),
        gameBoard: document.getElementById('game-board'),
        leftButton: document.getElementById('left-button'),
        rightButton: document.getElementById('right-button'),
        strikeCount: document.getElementById('strike-count'),
        strikeIndicators: [
            document.getElementById('strike-1'),
            document.getElementById('strike-2'),
            document.getElementById('strike-3'),
            document.getElementById('strike-4')
        ],
        piles: [
            document.getElementById('cards-1'),
            document.getElementById('cards-2'),
            document.getElementById('cards-3'),
            document.getElementById('cards-4'),
            document.getElementById('cards-5')
        ],
        pileContainers: [
            document.getElementById('pile-1'),
            document.getElementById('pile-2'),
            document.getElementById('pile-3'),
            document.getElementById('pile-4'),
            document.getElementById('pile-5')
        ],
        positionArrow: document.getElementById('position-arrow'),
        guessArea: document.getElementById('guess-area'),
        revealArea: document.getElementById('reveal-area'),
        currentCardValue: document.getElementById('current-card-value'),
        higherButton: document.getElementById('higher-button'),
        lowerButton: document.getElementById('lower-button'),
        continueButton: document.getElementById('continue-button'),
        revealText: document.getElementById('reveal-text'),
        resetButton: document.getElementById('reset-button'),
        drinkModal: document.getElementById('drink-modal'),
        deckEmptyModal: document.getElementById('deck-empty-modal'),
        victoryModal: document.getElementById('victory-modal'),
        resultModal: document.getElementById('result-modal'),
        drinkReason: document.getElementById('drink-reason'),
        drinkOkButton: document.getElementById('drink-ok-button'),
        concedeButton: document.getElementById('concede-button'),
        continuePlayingButton: document.getElementById('continue-playing-button'),
        victoryOkButton: document.getElementById('victory-ok-button'),
        resultTitle: document.getElementById('result-title'),
        resultMessage: document.getElementById('result-message')
    };
}

function bindEventListeners() {
    elements.leftButton.addEventListener('click', () => startGame('left'));
    elements.rightButton.addEventListener('click', () => startGame('right'));
    elements.higherButton.addEventListener('click', () => makeGuess('higher'));
    elements.lowerButton.addEventListener('click', () => makeGuess('lower'));
    elements.resetButton.addEventListener('click', resetGame);
    elements.drinkOkButton.addEventListener('click', () => { 
        hideModal('drink'); 
        // Continue the game after dismissing the drink modal
        if (gameState.gameStarted) {
            startGuessing();
        }
    });
    elements.concedeButton.addEventListener('click', () => { hideModal('deck-empty'); resetGame(); });
    elements.continuePlayingButton.addEventListener('click', () => { hideModal('deck-empty'); reshuffleDeck(); });
    elements.victoryOkButton.addEventListener('click', () => { hideModal('victory'); resetGame(); });
}

function createDeck() {
    const deck = [];
    for (let i = 0; i < cardPaths.length; i++) {
        deck.push({
            path: cardPaths[i],
            value: getCardValue(i),
            name: getCardName(i)
        });
    }
    return shuffleDeck(deck);
}

function getCardValue(cardIndex) {
    const value = Math.floor(cardIndex / 4) + 1;
    return value; // Ace=1, King=13
}

function getCardName(cardIndex) {
    const values = ['Ace', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'Jack', 'Queen', 'King'];
    const suits = ['Clubs', 'Diamonds', 'Hearts', 'Spades'];
    const valueIndex = Math.floor(cardIndex / 4);
    const suitIndex = cardIndex % 4;
    return `${values[valueIndex]} of ${suits[suitIndex]}`;
}

function shuffleDeck(deck) {
    const shuffled = [...deck];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

function resetGame() {
    gameState = {
        deck: createDeck(),
        piles: [[], [], [], [], []],
        currentPosition: 0,
        direction: null,
        strikes: 0,
        gameStarted: false,
        isGuessing: false,
        nextCard: null
    };

    // Reset UI
    elements.directionSelector.classList.remove('hidden');
    elements.gameBoard.classList.remove('hidden'); // Show game board with cards
    elements.guessArea.classList.add('hidden');
    elements.revealArea.classList.add('hidden');
    updateStrikeDisplay();
    clearAllPiles();
    hideAllModals();
    
    // Deal initial cards first, then show direction selector
    setTimeout(() => {
        dealInitialCards();
    }, 100);
}

function startGame(direction) {
    gameState.direction = direction;
    gameState.gameStarted = true;
    
    // Set starting position based on direction
    if (direction === 'left') {
        gameState.currentPosition = 0; // Start at pile 1
    } else {
        gameState.currentPosition = 4; // Start at pile 5
    }

    // Show game board (cards already dealt)
    elements.directionSelector.classList.add('hidden');
    elements.gameBoard.classList.remove('hidden');
    
    // Start the first guess
    startGuessing();
}

function dealInitialCards() {
    for (let i = 0; i < 5; i++) {
        if (gameState.deck.length === 0) {
            showModal('deck-empty');
            return;
        }
        
        const card = gameState.deck.pop();
        gameState.piles[i].push(card);
        
        setTimeout(() => {
            renderCard(card, i, 0);
        }, i * 200);
    }
}

function renderCard(card, pileIndex, cardIndex) {
    const cardElement = document.createElement('div');
    cardElement.className = 'card new-card';
    
    const img = document.createElement('img');
    img.src = card.path;
    img.alt = card.name;
    cardElement.appendChild(img);
    
    // Position card in pile with slight offset for stacking effect
    cardElement.style.top = `${cardIndex * 2}px`;
    cardElement.style.left = `${cardIndex * 2}px`;
    cardElement.style.zIndex = cardIndex;
    
    elements.piles[pileIndex].appendChild(cardElement);
}

function startGuessing() {
    if (!gameState.gameStarted) return;
    
    const currentPile = gameState.piles[gameState.currentPosition];
    if (currentPile.length === 0) return;
    
    const currentCard = currentPile[currentPile.length - 1];
    
    // Update current position indicator
    updatePositionIndicator();
    
    // Show guess area
    elements.currentCardValue.textContent = currentCard.name;
    elements.guessArea.classList.remove('hidden');
    elements.revealArea.classList.add('hidden');
    
    gameState.isGuessing = true;
}

function makeGuess(guess) {
    if (!gameState.isGuessing) return;
    
    // Draw next card
    if (gameState.deck.length === 0) {
        showModal('deck-empty');
        return;
    }
    
    gameState.nextCard = gameState.deck.pop();
    const currentCard = gameState.piles[gameState.currentPosition][gameState.piles[gameState.currentPosition].length - 1];
    
    // Hide guess area
    elements.guessArea.classList.add('hidden');
    gameState.isGuessing = false;
    
    // Add card to current pile
    gameState.piles[gameState.currentPosition].push(gameState.nextCard);
    
    // Render the new card
    const cardIndex = gameState.piles[gameState.currentPosition].length - 1;
    renderCard(gameState.nextCard, gameState.currentPosition, cardIndex);
    
    // Evaluate guess after card animation
    setTimeout(() => {
        evaluateGuess(guess, currentCard, gameState.nextCard);
    }, 500);
}

function evaluateGuess(guess, currentCard, nextCard) {
    const currentValue = currentCard.value;
    const nextValue = nextCard.value;
    
    let correct = false;
    let sameCard = currentValue === nextValue;
    
    if (sameCard) {
        // Same card = strike + drink and reset
        gameState.strikes++;
        updateStrikeDisplay();
        
        // Check if this same card also gives us the 4th strike
        if (gameState.strikes >= 4) {
            showDrinkModal("Bloody hell! Same card AND 4 strikes - down TWO drinks mate!");
            gameState.strikes = 0; // Reset strikes after hitting 4
            updateStrikeDisplay();
        } else {
            showDrinkModal("Same card! That's a strike and a drink!");
        }
        
        resetToStart();
        return;
    }
    
    if (guess === 'higher') {
        correct = nextValue > currentValue;
    } else {
        correct = nextValue < currentValue;
    }
    
    // Show result modal
    showResultModal(correct, nextCard.name, currentCard.name, guess);
    
    // Auto-continue after 1 second
    setTimeout(() => {
        hideModal('result');
        
        if (correct) {
            // Move to next position
            moveToNextPosition();
            // Check if game is won, if not continue guessing
            if (gameState.gameStarted) {
                startGuessing();
            }
        } else {
            // Wrong guess - add strike and reset position
            addStrike();
            // Continue guessing after strike (unless game ended)
            if (gameState.gameStarted) {
                startGuessing();
            }
        }
    }, 1000);
}

function moveToNextPosition() {
    // Check if we've reached the end
    if ((gameState.direction === 'left' && gameState.currentPosition === 4) ||
        (gameState.direction === 'right' && gameState.currentPosition === 0)) {
        // Won the game!
        showModal('victory');
        return;
    }
    
    // Move to next position
    if (gameState.direction === 'left') {
        gameState.currentPosition++;
    } else {
        gameState.currentPosition--;
    }
}

function addStrike() {
    gameState.strikes++;
    updateStrikeDisplay();
    
    if (gameState.strikes >= 4) {
        showDrinkModal("4 strikes! That's a drink!");
        gameState.strikes = 0; // Reset strikes after hitting 4
        updateStrikeDisplay(); // Update the display immediately
        resetToStart();
    } else {
        resetToStart();
    }
}

function resetToStart() {
    // Reset position based on direction but keep piles intact
    if (gameState.direction === 'left') {
        gameState.currentPosition = 0;
    } else {
        gameState.currentPosition = 4;
    }
}



function updatePositionIndicator() {
    // Remove current class from all piles
    elements.pileContainers.forEach(pile => pile.classList.remove('current'));
    
    // Add current class to current pile
    elements.pileContainers[gameState.currentPosition].classList.add('current');
    
    // Position the arrow
    const arrowPosition = gameState.currentPosition * 180 + 90; // Adjust based on pile width and spacing
    elements.positionArrow.style.transform = `translateX(${arrowPosition - 450}px)`; // Center alignment
}

function updateStrikeDisplay() {
    elements.strikeCount.textContent = gameState.strikes;
    
    elements.strikeIndicators.forEach((indicator, index) => {
        if (index < gameState.strikes) {
            indicator.classList.add('active');
        } else {
            indicator.classList.remove('active');
        }
    });
}

function clearAllPiles() {
    elements.piles.forEach(pile => {
        pile.innerHTML = '';
    });
    
    elements.pileContainers.forEach(pile => {
        pile.classList.remove('current');
    });
}

function showModal(type) {
    hideAllModals();
    
    switch(type) {
        case 'drink':
            elements.drinkModal.classList.remove('hidden');
            break;
        case 'deck-empty':
            elements.deckEmptyModal.classList.remove('hidden');
            break;
        case 'victory':
            elements.victoryModal.classList.remove('hidden');
            break;
        case 'result':
            elements.resultModal.classList.remove('hidden');
            break;
    }
}

function showDrinkModal(reason) {
    elements.drinkReason.textContent = reason;
    showModal('drink');
}

function showResultModal(correct, nextCardName, currentCardName, guess) {
    // Set the modal content
    if (correct) {
        elements.resultTitle.textContent = "✅ Correct!";
        elements.resultMessage.textContent = `${nextCardName} is ${guess} than ${currentCardName}`;
        elements.resultModal.querySelector('.modal-content').className = 'modal-content result-modal correct';
    } else {
        elements.resultTitle.textContent = "❌ Incorrect!";
        const actualDirection = guess === 'higher' ? 'lower' : 'higher';
        elements.resultMessage.textContent = `${nextCardName} is ${actualDirection} than ${currentCardName}`;
        elements.resultModal.querySelector('.modal-content').className = 'modal-content result-modal incorrect';
    }
    
    showModal('result');
}

function hideModal(type) {
    switch(type) {
        case 'drink':
            elements.drinkModal.classList.add('hidden');
            break;
        case 'deck-empty':
            elements.deckEmptyModal.classList.add('hidden');
            break;
        case 'victory':
            elements.victoryModal.classList.add('hidden');
            break;
        case 'result':
            elements.resultModal.classList.add('hidden');
            break;
    }
}

function hideAllModals() {
    elements.drinkModal.classList.add('hidden');
    elements.deckEmptyModal.classList.add('hidden');
    elements.victoryModal.classList.add('hidden');
    elements.resultModal.classList.add('hidden');
}

function reshuffleDeck() {
    // Collect all cards from piles except the top card of each pile
    const cardsToReshuffle = [];
    
    gameState.piles.forEach((pile, pileIndex) => {
        if (pile.length > 1) {
            // Keep the top card, reshuffle the rest
            const cardsToAdd = pile.slice(0, -1);
            cardsToReshuffle.push(...cardsToAdd);
            
            // Update pile to only have top card
            gameState.piles[pileIndex] = [pile[pile.length - 1]];
            
            // Update DOM - remove all but the top card
            const pileElement = elements.piles[pileIndex];
            while (pileElement.children.length > 1) {
                pileElement.removeChild(pileElement.firstChild);
            }
        }
    });
    
    // Add cards back to deck and shuffle
    gameState.deck.push(...cardsToReshuffle);
    gameState.deck = shuffleDeck(gameState.deck);
    
    // Continue the game
    startGuessing();
} 