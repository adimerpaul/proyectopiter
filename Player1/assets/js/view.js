

var view = {
    // Mapping suits to their respective symbols for display
    suitSymbols: {
        "Hearts": "♥️",
        "Diamonds": "♦️",
        "Spades": "♠️",
        "Clubs": "♣️"
    },
    suitSymbolsCode: {
        "Hearts": "H",
        "Diamonds": "D",
        "Spades": "S",
        "Clubs": "C"
    },

    // Mapping numeric card ranks to face cards
    rankSymbols: {
        1: 'A',  // Ace
        11: 'J', // Jack
        12: 'Q', // Queen
        13: 'K'  // King
    },

    // Update the hand of the player or dealer in the interface
    updateHand: function(playerType, hand, facedown = false) {

        // Update the score for the player or dealer
        let scoreElement = (playerType === "player") ? document.getElementById("player-score") : document.getElementById("dealer-score"); // Determine which score element to update based on the playerType ("player" or "dealer")
        scoreElement.textContent = hand.getScore();  // Display the current score

        let handDiv = (playerType === "player") ? document.getElementById("player-cards") : document.getElementById("dealer-cards");
        let handDiv2 = (playerType === "player") ? document.getElementById("player-cards2") : document.getElementById("dealer-cards2");
        handDiv.innerHTML = '';

        // Loop through the cards and display each one
        hand.cards.forEach((card, index) => {
            let cardElement = document.createElement('span');
            cardElement.className = 'card_deck';
            // For the dealer's second card, show a face-down placeholder if facedown is true
            if (facedown && index === 1 && playerType === "dealer") {
                // cardElement.innerHTML = '🂠';  // Face-down card
                cardElement.id = 'facedown';  // Add an ID to the element
            } else {
                // Display card rank (e.g., A, J, 2) and suit
                // let suitSymbol = this.suitSymbols[card.suit];  // Map suit to its symbol
                // let rankDisplay = this.rankSymbols[card.rank] || card.rank;  // Map rank or use number
                // cardElement.innerHTML = `${rankDisplay}${suitSymbol}`;  // Combine rank and suit
                // cardElement.id = 'D4'
                cardElement.id = `${this.suitSymbolsCode[card.suit]}${card.rank}`
            }

            handDiv.appendChild(cardElement);
            // dealer-cards
            const dealerCards = document.getElementById("dealer-cards");
            const playerCards = document.getElementById("player-cards");
            const walletBalance = document.getElementById("wallet-balance");
            // const score = document.getElementById("score");
            const playerScore = document.getElementById("player-score");
            const dealerScore = document.getElementById("dealer-score");
            socket.emit('player1',{
                dealerCards: dealerCards.innerHTML,
                playerCards: playerCards.innerHTML,
                amount: walletBalance.innerHTML,
                // score: score.innerHTML,
                playerScore: playerScore.innerHTML,
                dealerScore: dealerScore.innerHTML,
                visibleDealerCard: dealerScore.style.display === "none" ? false : true
            });
            // handDiv2.appendChild(cardElement.cloneNode(true));
        });

    },

    // Display a message in the game, such as status updates or results
    addMessage: function(msg) {
        document.getElementById('message').textContent = msg;
    },

    // Clear all messages from the message area
    clearMessages: function() {
        document.getElementById('message').textContent = '';
    },

    // Update the player's current bet in the UI
    updateBet: function(betAmount) {
        document.getElementById("current-bet").textContent = betAmount;
    },

    // Update the player's wallet balance in the UI
    updateWallet: function(walletAmount) {
        document.getElementById("wallet-balance").textContent = walletAmount;
    },

    // Update the remaining deck count in the UI
    updateDeckCount: function(cardsLeft) {
        document.getElementById("cards-left").textContent = cardsLeft;
    }
};





