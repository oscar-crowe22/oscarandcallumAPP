// Test Scenarios for Ride the Bus Game
// This script tests various game outcomes without playing the actual game
// Open browser console to see the test results

console.log("🚌 RIDE THE BUS - Test Scenarios Starting...\n");

// Mock the modal functions to log instead of showing UI
function mockShowDrinkModal(reason) {
    console.log(`🍺 DRINK MODAL: ${reason}`);
}

// Mock the original showDrinkModal function
const originalShowDrinkModal = window.showDrinkModal;
window.showDrinkModal = mockShowDrinkModal;

// Test helper functions
function createTestCard(value, name) {
    return {
        value: value,
        name: name,
        path: `../art/${name.toLowerCase().replace(' ', '_')}.svg`
    };
}

function resetTestGameState() {
    // Reset game state for testing
    if (typeof gameState !== 'undefined') {
        gameState.strikes = 0;
        gameState.gameStarted = true;
        gameState.direction = 'left';
        gameState.currentPosition = 0;
        
        // Update display if elements exist
        if (typeof updateStrikeDisplay === 'function') {
            updateStrikeDisplay();
        }
    }
    console.log("🔄 Game state reset for testing");
}

function logCurrentState() {
    if (typeof gameState !== 'undefined') {
        console.log(`📊 Current strikes: ${gameState.strikes}/4`);
        console.log(`📍 Current position: ${gameState.currentPosition + 1}`);
        console.log(`➡️  Direction: ${gameState.direction}`);
    }
}

// Test Scenario 1: Normal same card (should get 1 strike + drink)
function testSameCard() {
    console.log("\n=== TEST 1: Same Card (Not 4th Strike) ===");
    resetTestGameState();
    
    const currentCard = createTestCard(7, "7 of Hearts");
    const nextCard = createTestCard(7, "7 of Spades");
    
    console.log(`Current card: ${currentCard.name}`);
    console.log(`Next card: ${nextCard.name}`);
    logCurrentState();
    
    // Simulate the same card scenario
    if (typeof evaluateGuess === 'function') {
        evaluateGuess('higher', currentCard, nextCard);
    }
    
    setTimeout(() => {
        logCurrentState();
        console.log("✅ Expected: 1 strike added, drink modal shown");
    }, 100);
}

// Test Scenario 2: 4th strike from wrong guess
function testFourthStrike() {
    console.log("\n=== TEST 2: 4th Strike from Wrong Guess ===");
    resetTestGameState();
    
    // Set up 3 strikes already
    if (typeof gameState !== 'undefined') {
        gameState.strikes = 3;
        if (typeof updateStrikeDisplay === 'function') {
            updateStrikeDisplay();
        }
    }
    
    const currentCard = createTestCard(8, "8 of Hearts");
    const nextCard = createTestCard(5, "5 of Spades");
    
    console.log(`Current card: ${currentCard.name}`);
    console.log(`Next card: ${nextCard.name}`);
    console.log("Guessing: higher (wrong!)");
    logCurrentState();
    
    // This should trigger the 4th strike
    if (typeof addStrike === 'function') {
        addStrike();
    }
    
    setTimeout(() => {
        logCurrentState();
        console.log("✅ Expected: 4 strikes reached, drink modal, strikes reset to 0");
    }, 100);
}

// Test Scenario 3: Same card AND 4th strike (the special case!)
function testSameCardFourthStrike() {
    console.log("\n=== TEST 3: Same Card + 4th Strike (SPECIAL CASE!) ===");
    resetTestGameState();
    
    // Set up 3 strikes already
    if (typeof gameState !== 'undefined') {
        gameState.strikes = 3;
        if (typeof updateStrikeDisplay === 'function') {
            updateStrikeDisplay();
        }
    }
    
    const currentCard = createTestCard(10, "10 of Clubs");
    const nextCard = createTestCard(10, "10 of Hearts");
    
    console.log(`Current card: ${currentCard.name}`);
    console.log(`Next card: ${nextCard.name}`);
    console.log("SAME CARD! This should trigger the special TWO drinks message!");
    logCurrentState();
    
    // Simulate the same card scenario when already on 3 strikes
    if (typeof evaluateGuess === 'function') {
        evaluateGuess('higher', currentCard, nextCard);
    }
    
    setTimeout(() => {
        logCurrentState();
        console.log("✅ Expected: 'Down TWO drinks mate!' message, strikes reset to 0");
    }, 100);
}

// Test Scenario 4: Multiple same cards in a row
function testMultipleSameCards() {
    console.log("\n=== TEST 4: Multiple Same Cards in a Row ===");
    resetTestGameState();
    
    const scenarios = [
        { current: createTestCard(3, "3 of Hearts"), next: createTestCard(3, "3 of Diamonds") },
        { current: createTestCard(9, "9 of Clubs"), next: createTestCard(9, "9 of Spades") },
        { current: createTestCard(12, "Queen of Hearts"), next: createTestCard(12, "Queen of Clubs") }
    ];
    
    scenarios.forEach((scenario, index) => {
        setTimeout(() => {
            console.log(`\n--- Same Card #${index + 1} ---`);
            console.log(`Current: ${scenario.current.name}, Next: ${scenario.next.name}`);
            logCurrentState();
            
            if (typeof evaluateGuess === 'function') {
                evaluateGuess('lower', scenario.current, scenario.next);
            }
            
            setTimeout(() => {
                logCurrentState();
            }, 50);
        }, index * 200);
    });
}

// Test Scenario 5: Build up to 4th strike with same card finish
function testBuildupToFourthStrikeSameCard() {
    console.log("\n=== TEST 5: Building Up to 4th Strike with Same Card Finish ===");
    resetTestGameState();
    
    console.log("Simulating 3 wrong guesses first...");
    
    // Simulate 3 wrong guesses
    for (let i = 0; i < 3; i++) {
        setTimeout(() => {
            console.log(`\n--- Wrong Guess #${i + 1} ---`);
            if (typeof addStrike === 'function') {
                const currentCard = createTestCard(5 + i, `${5 + i} of Hearts`);
                const nextCard = createTestCard(3 + i, `${3 + i} of Spades`);
                console.log(`Wrong guess: ${currentCard.name} vs ${nextCard.name}`);
                logCurrentState();
                
                // Add strike manually to simulate wrong guess
                if (typeof gameState !== 'undefined') {
                    gameState.strikes++;
                    if (typeof updateStrikeDisplay === 'function') {
                        updateStrikeDisplay();
                    }
                }
                
                setTimeout(() => logCurrentState(), 50);
            }
        }, i * 300);
    }
    
    // Now the same card for the 4th strike
    setTimeout(() => {
        console.log("\n--- NOW THE SAME CARD (4th Strike!) ---");
        const currentCard = createTestCard(11, "Jack of Hearts");
        const nextCard = createTestCard(11, "Jack of Diamonds");
        
        console.log(`Current: ${currentCard.name}, Next: ${nextCard.name}`);
        console.log("This should trigger the TWO drinks message!");
        logCurrentState();
        
        if (typeof evaluateGuess === 'function') {
            evaluateGuess('higher', currentCard, nextCard);
        }
        
        setTimeout(() => {
            logCurrentState();
            console.log("🎯 This should show: 'Bloody hell! Same card AND 4 strikes - down TWO drinks mate!'");
        }, 100);
    }, 1000);
}

// Run all tests
function runAllTests() {
    console.log("🧪 Running all test scenarios...\n");
    
    testSameCard();
    
    setTimeout(() => {
        testFourthStrike();
    }, 500);
    
    setTimeout(() => {
        testSameCardFourthStrike();
    }, 1000);
    
    setTimeout(() => {
        testMultipleSameCards();
    }, 1500);
    
    setTimeout(() => {
        testBuildupToFourthStrikeSameCard();
    }, 2500);
    
    setTimeout(() => {
        console.log("\n🏁 All tests completed! Check the console output above.");
        console.log("💡 To run individual tests, call:");
        console.log("   testSameCard()");
        console.log("   testFourthStrike()");
        console.log("   testSameCardFourthStrike()");
        console.log("   testMultipleSameCards()");
        console.log("   testBuildupToFourthStrikeSameCard()");
    }, 5000);
}

// Make functions available globally for manual testing
window.testSameCard = testSameCard;
window.testFourthStrike = testFourthStrike;
window.testSameCardFourthStrike = testSameCardFourthStrike;
window.testMultipleSameCards = testMultipleSameCards;
window.testBuildupToFourthStrikeSameCard = testBuildupToFourthStrikeSameCard;
window.runAllTests = runAllTests;

// Auto-run tests when script loads (with delay to ensure game is loaded)
setTimeout(() => {
    if (typeof gameState !== 'undefined') {
        console.log("🎮 Game detected! Running automatic tests...");
        runAllTests();
    } else {
        console.log("⚠️  Game not loaded yet. Run runAllTests() manually or reload the page.");
        console.log("Or run individual test functions manually.");
    }
}, 1000);

console.log("\n📝 Test script loaded! Functions available:");
console.log("🔄 runAllTests() - Run all test scenarios");
console.log("🎯 Individual test functions also available (see console output after tests run)"); 