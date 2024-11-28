

var gamePlay = {
    Blackjack: Object.create(blackjack),  // Create an instance of the blackjack game

    // Function to initialize and start the game
    playGame: function() {
        this.Blackjack.initialize();  // Initialize the game (shuffle, reset hands)
        view.clearMessages();  // Clear any messages from the previous round
        view.updateBet(this.Blackjack.player.getUserBet());  // Display the initial bet
        view.updateWallet(this.Blackjack.player.userWallet.getValue());  // Display player's wallet balance
        document.getElementById("hit-btn").disabled = true;  // Disable hit button until cards are dealt
        document.getElementById("stay-btn").disabled = true;  // Disable stay button until cards are dealt
        // document.getElementById("deal-btn").disabled = false;  // Enable the deal button to start the game
    },

    // End the round, reset game state
    endRound: function() {
        document.getElementById("deal-btn").disabled = false;  // Re-enable the deal button
        document.getElementById("hit-btn").disabled = true;  // Disable hit button after the round ends
        document.getElementById("stay-btn").disabled = true;  // Disable stay button after the round ends
    },

    // Reset the game back to the initial state
    reset: function() {
        this.Blackjack.initialize();  // Reinitialize the game (reshuffle, reset hands, etc.)
        view.updateBet(this.Blackjack.player.getUserBet());  // Display the initial bet again
        view.updateWallet(this.Blackjack.player.userWallet.getValue());  // Display the wallet balance
        view.updateHand("player", this.Blackjack.player.userhand);  // Clear player hand display
        view.updateHand("dealer", this.Blackjack.dealer, true);  // Reset dealer's hand, face-down
    }
};





