
// Card object defining suit and rank, initialized with values
var card = {
    suit: null, // Suit of the card (Hearts, Diamonds, etc.)
    rank: null, // Rank of the card (2, 3, 10, J, etc.)
    initialize: function(suit, rank) {
        this.suit = suit;
        this.rank = rank; // Rank of the card (2, 3, 10, J, etc.)
        return this;
    },
    // Calculates the value of the card (11 for Ace, 10 for face cards, etc.)
    getValue: function() {
        if (this.rank > 10) return 10;  // J, Q, K are worth 10
        if (this.rank === 1) return 11; // Ace can be 11
        return this.rank;
    }
};

// Deck object for handling card shuffling and dealing
var card_deck = {
    deck: [], // Empty array to hold the cards in the deck
    cardsLeft: 52, //Number of cards in the deck
    //Initialize the deck with 52 cards
    initialize: function() {
        this.deck = [];
        var suits = ["Hearts", "Spades", "Clubs", "Diamonds"]; //declares 4 types of suits
        // Loop through all suits and ranks to create cards
        for (var suit of suits) { //for types of suits
            for (var rank = 1; rank <= 13; rank++) { //for the numbers adn their relation to the suits
                // Create each card and add it to the deck
                this.deck.push(Object.create(card).initialize(suit, rank));
            }
        }
        this.cardsLeft = 52; //Resets the number of cards left to 52
    },
    // Shuffle the deck
    shuffle: function() {
        // Loop through the deck backwards and randomly swap each card with one before it
        for (var i = this.deck.length - 1; i > 0; i--) { //
            var j = Math.floor(Math.random() * (i + 1));// Random index from 0 to i
            [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];// Swap cards
        }
    },
    // Deal a card from the deck, reducing the number of remaining cards
    dealCard: function() {
        if (this.cardsLeft === 0) {
            alert("No more cards in the deck. Reshuffling...");
            this.shuffle(); // If no cards left, reshuffle the deck
            this.cardsLeft = 52; // Reset cards left
        }
        this.cardsLeft--;// Reset cards left
        return this.deck.pop();// Return the last card from the array
    },
    // Return the number of remaining cards in the deck
    getNumCardsLeft: function() {
        return this.cardsLeft;
    }
};

// Hand object for managing a player's or dealer's hand of cards
var hand = {
    cards: [], // Array holding the cards in the hand
    score: 0, // Total score of the hand
    // Add a card to the hand and update the total score
    addCard: function(card) {
        this.cards.push(card);  // Add card to the hand array (last position in the array)
        this.updateScore(); // Recalculate the total score
    },
    // Reset the hand by clearing the cards and score
    reset: function() {
        this.cards = [];
        this.score = 0;
    },
    // Update the score based on the cards in the hand, handling aces separately
    updateScore: function() {
        let aces = 0; // Track the number of aces in the hand
        // Loop through cards and sum up their values
        this.score = this.cards.reduce((acc, card) => {
            let value = card.getValue();  // Get card's value (11 for ace, 10 for face, etc.)
            if (value === 11) aces++;  // If the card is an Ace, increment ace counter
            return acc + value;  // Add the card's value to the score
        }, 0);

        // If the score exceeds 21 and we have aces, reduce the score by treating aces as 1 instead of 11
        while (aces > 0 && this.score > 21) {
            this.score -= 10;  // Convert one Ace from 11 to 1
            aces--;
        }
    },

    // Return the current score of the hand
    getScore: function() {
        return this.score;
    }
};

// Player's wallet object to manage the available balance
var wallet = {
    value: 0,  // Total money available to the player

    // Set the wallet's balance to a specific amount
    setValue: function(amount) {
        this.value = amount;
    },

    // Return the current balance
    getValue: function() {
        return this.value;
    },

    // Add money to the wallet
    addValue: function(amount) {
        this.value += amount;
    },

    // Deduct money from the wallet
    decrementValue: function(amount) {
        this.value -= amount;
    }
};

// User object to handle the player's hand, wallet, and bet
var user = {
    userhand: Object.create(hand),  // The player's hand of cards
    userWallet: Object.create(wallet),  // The player's wallet
    userBet: 100,  // Initial bet is $100

    // Initialize the user by resetting hand, setting wallet balance, and setting default bet
    initialize: function() {

        this.userhand.reset();
        // this.userWallet.setValue(1000);  // Player starts with $1000
        this.userBet = 0;  // Initial bet
        // username-display
        const userName = document.getElementById("username-display");
        const username = userName.innerHTML.split(' ');
        const url = 'http://127.0.0.1:3000/player2?status=get&username=' + username[1];
        const cm = this;
        $.ajax({
            url: url,
            type: 'GET',
            success: function(data) {
                console.log(data);
                const walletBalance = document.getElementById("wallet-balance");
                walletBalance.innerHTML = data.amount;
            }
        })
    },

    // Set the player's current bet
    setUserBet: function(amount) {
        this.userBet = amount;
    },

    // Return the player's current bet
    getUserBet: function() {
        return this.userBet;
    }
};

// Main blackjack game object to manage game logic
var blackjack = {
    carddeck: Object.create(card_deck),  // The card deck used in the game
    dealer: Object.create(hand),  // Dealer's hand
    player: Object.create(user),  // Player object (contains hand and wallet)
    dealersHitLimit: 16,  // Dealer must keep hitting until score reaches 17 or more

    // Initialize the game, set up deck, shuffle, and reset hands
    initialize: function() {
        this.carddeck.initialize();  // Initialize the deck with cards
        this.carddeck.shuffle();  // Shuffle the deck
        this.player.initialize();  // Reset the player's hand and wallet
        this.dealer.reset();  // Reset the dealer's hand
        view.updateDeckCount(this.carddeck.getNumCardsLeft());  // Display remaining cards
    },

    // Function to handle dealing cards to both the player and the dealer
    deal: function() {
        this.player.userhand.reset();
        this.dealer.reset();

        // Deal two cards to the player
        this.player.userhand.addCard(this.carddeck.dealCard());
        this.player.userhand.addCard(this.carddeck.dealCard());

        // Deal two cards to the dealer (second card is face-down)
        this.dealer.addCard(this.carddeck.dealCard());
        this.dealer.addCard(this.carddeck.dealCard());

        view.updateDeckCount(this.carddeck.getNumCardsLeft());  // Update remaining cards count
    },

    // Player requests to hit (take an additional card)
    hit: function() {
        if (!this.didPlayerBust()) {
            this.player.userhand.addCard(this.carddeck.dealCard());  // Add card to player's hand
            view.updateDeckCount(this.carddeck.getNumCardsLeft());  // Update remaining cards count
        }
    },

    // Dealer's turn: dealer keeps hitting until their score is at least 17
    dealerTurn: function() {
        while (this.dealer.getScore() < this.dealersHitLimit) {
            this.dealer.addCard(this.carddeck.dealCard());  // Dealer hits
            view.updateDeckCount(this.carddeck.getNumCardsLeft());  // Update remaining cards count
        }
    },

    // Check if the player has busted (score > 21)
    didPlayerBust: function() {
        return this.player.userhand.getScore() > 21;
    },

    // Set the player's bet, ensuring it's within valid limits
    setBet: function(amount) {
        if (amount <= this.player.userWallet.getValue() && amount >= 100) {
            this.player.setUserBet(amount);
        }
    },
    getRemoteAdvice: function(type) {
        const dealerScore = document.getElementById("dealer-score").innerHTML;
        const playerScore = document.getElementById("player-score").innerHTML;
        const message = document.getElementById("message");

        if (type === "ajax") {
            const url = 'http://127.0.0.1:3000/?userscore='+playerScore+'&dealerscore='+dealerScore;
            $.get(url, function(res) {
                message.innerHTML = res.content.Advice;
                const advice = res.content.Advice;
                if (advice === "Hit") {
                    gamePlay.Blackjack.hit();  // Add a card to the player's hand
                    view.updateHand("player", gamePlay.Blackjack.player.userhand);  // Update player's hand display
                    // If the player busts (score exceeds 21), display a message and end the round
                    if (gamePlay.Blackjack.didPlayerBust()) {
                        const url= 'http://127.0.0.1:3000/?outcome=lost';
                        $.ajax({
                            url: url,
                            type: 'GET',
                            success: function(data) {
                                console.log(data);
                                const wins = data.content.wins;
                                const losses = data.content.losses;
                                const pushes = data.content.pushes;
                                view.addMessage("¡Te pasaste! Has perdido. "+ "Wins: " + wins + " Losses: " + losses + " Pushes: " + pushes);
                            }
                        });
                        // view.addMessage("¡Te pasaste! Has perdido.");  // Inform player they've busted
                        gamePlay.endRound();  // End the current round
                    }
                }
                if (advice === "Stay") {
                    const dealerScore = document.getElementById("dealer-score");
                    dealerScore.style.display = 'block';
                    view.addMessage("Turno del dealer.");  // Inform the player it's now the dealer's turn
                    gamePlay.Blackjack.dealerTurn();  // Dealer plays their hand
                    view.updateHand("dealer", gamePlay.Blackjack.dealer, false);  // Reveal dealer's hand
                    gamePlay.endRound();  // End the current round after dealer finishes
                    const playerScore = document.getElementById("player-score").innerHTML;
                    const dealerScore2 = document.getElementById("dealer-score").innerHTML;
                    if (playerScore > dealerScore2) {
                        const url= 'http://127.0.0.1:3000/?outcome=won';
                        $.ajax({
                            url: url,
                            type: 'GET',
                            success: function(data) {
                                console.log(data);
                                const wins = data.content.wins;
                                const losses = data.content.losses;
                                const pushes = data.content.pushes;
                                view.addMessage("¡Ganaste! "+ "Wins: " + wins + " Losses: " + losses + " Pushes: " + pushes);
                            }
                        });
                        // view.addMessage("¡Ganaste!");
                    } else if (playerScore < dealerScore2) {
                        const url= 'http://127.0.0.1:3000/?outcome=lost';
                        $.ajax({
                            url: url,
                            type: 'GET',
                            success: function(data) {
                                console.log(data);
                                const wins = data.content.wins;
                                const losses = data.content.losses;
                                const pushes = data.content.pushes;
                                view.addMessage("¡Perdiste! "+ "Wins: " + wins + " Losses: " + losses + " Pushes: " + pushes);
                            }
                        });
                        // view.addMessage("¡Perdiste!");
                    } else {
                        const url= 'http://127.0.0.1:3000/?outcome=push';
                        $.ajax({
                            url: url,
                            type: 'GET',
                            success: function(data) {
                                console.log(data);
                                const wins = data.content.wins;
                                const losses = data.content.losses;
                                const pushes = data.content.pushes;
                                view.addMessage("¡Empate! "+ "Wins: " + wins + " Losses: " + losses + " Pushes: " + pushes);
                            }
                        });
                        // view.addMessage("¡Empate!");
                    }
                }

            }).fail(function() {
                message.innerHTML = 'try again';
            });
        }

        if (type === "xml") {
            const xhr = new XMLHttpRequest();
            const url = 'https://convers-e.com/blackjackadvice.php?userscore=' + playerScore + '&dealerscore=' + dealerScore;
            xhr.open('GET', url, true);
            xhr.onload = function () {
                if (xhr.status === 200) {
                    console.log(xhr.responseText);
                    const res = JSON.parse(xhr.responseText);
                    message.innerHTML = res.content.Advice;
                } else {
                    message.innerHTML = 'try again';
                }
            }
            xhr.send();
        }
        if (type === "jquery") {
            const url = 'https://convers-e.com/blackjackadvice.php?userscore=' + playerScore + '&dealerscore=' + dealerScore;
            $.get(url, function(res) {
                console.log(res);
                message.innerHTML = res.content.Advice;
            }).fail(function() {
                message.innerHTML = 'try again';
            });
        }
        if (type === "fetch") {
            const url = 'https://convers-e.com/blackjackadvice.php?userscore=' + playerScore + '&dealerscore=' + dealerScore;
            fetch(url)
                .then(response => response.json())
                .then(data => {
                    // console.log(data);
                    // message.innerHTML = data.content.Advice;
                    if (data.status === 'Success') {
                        message.innerHTML = data.content.Advice;
                    }else {
                        message.innerHTML = 'try again';
                    }
                })
                .catch(err => {
                    message.innerHTML = 'try again';
                });
        }
    }
};