
// Listener for the "Repartir" (Deal) button
document.getElementById("deal-btn").addEventListener("click", function() {
    // message new
    const message = document.getElementById("message");
    message.innerHTML = '';
    const dealerScore = document.getElementById("dealer-score");
    dealerScore.style.display = 'none';

    const currentBet = document.getElementById("current-bet").innerHTML;
    if (currentBet === '0') {
        const currentBet = document.getElementById("message");
        currentBet.innerHTML = 'Debes apostar antes de pedir carta';
        return false;
    }

    gamePlay.Blackjack.deal();  // Deal cards to player and dealer
    view.updateHand("player", gamePlay.Blackjack.player.userhand);  // Update player's hand
    view.updateHand("dealer", gamePlay.Blackjack.dealer, true);  // Dealer's second card face-down
    document.getElementById("hit-btn").disabled = false;  // Enable "Hit" button
    document.getElementById("stay-btn").disabled = false;  // Enable "Stay" button
    document.getElementById("deal-btn").disabled = true;  // Disable "Deal" button until round ends
    // document.getElementById("xml").disabled = false;
    // document.getElementById("jquery").disabled = false;
    // document.getElementById("fetch").disabled = false;
    // document.getElementById("ajax").disabled = false;
});

// Listener for the "Pedir carta" (Hit) button
document.getElementById("hit-btn").addEventListener("click", function() {
    gamePlay.Blackjack.hit();  // Add a card to the player's hand
    view.updateHand("player", gamePlay.Blackjack.player.userhand);  // Update player's hand display
    // If the player busts (score exceeds 21), display a message and end the round
    if (gamePlay.Blackjack.didPlayerBust()) {
        // const url= 'http://127.0.0.1:3000/?outcome=lost';
        // $.ajax({
        //     url: url,
        //     type: 'GET',
        //     success: function(data) {
        //         console.log(data);
        //         const wins = data.content.wins;
        //         const losses = data.content.losses;
        //         const pushes = data.content.pushes;
        //         view.addMessage("¡Te pasaste! Has perdido. "+ "Wins: " + wins + " Losses: " + losses + " Pushes: " + pushes);
        //     }
        // });
        view.addMessage("¡Te pasaste!! Has perdido.");  // Inform player they've busted
        gamePlay.endRound();  // End the current round
        let walletBalance = document.getElementById("wallet-balance").innerHTML;
        let currentBet = document.getElementById("current-bet").innerHTML;
        walletBalance = parseInt(walletBalance) - parseInt(currentBet);
        document.getElementById("wallet-balance").innerHTML = walletBalance;
        document.getElementById("current-bet").innerHTML = 0;
        document.getElementById("deal-btn").disabled = true;
        document.getElementById("bet-increase").disabled = true;
        document.getElementById("bet-decrease").disabled = true;
    }
});

// Listener for the "Quedarse" (Stay) button
document.getElementById("stay-btn").addEventListener("click", function() {
    const dealerScore = document.getElementById("dealer-score");
    dealerScore.style.display = 'block';
    view.addMessage("Turno del dealer.");  // Inform the player it's now the dealer's turn
    gamePlay.Blackjack.dealerTurn();  // Dealer plays their hand
    view.updateHand("dealer", gamePlay.Blackjack.dealer, false);  // Reveal dealer's hand
    gamePlay.endRound();  // End the current round after dealer finishes

    let playerScore = document.getElementById("player-score").innerHTML;
    let dealerScore2 = document.getElementById("dealer-score").innerHTML;
    let walletBalance = document.getElementById("wallet-balance").innerHTML;
    let currentBet = document.getElementById("current-bet").innerHTML;
    document.getElementById("deal-btn").disabled = true;
    document.getElementById("bet-increase").disabled = true;
    document.getElementById("bet-decrease").disabled = true;
    currentBet = parseInt(currentBet);
    playerScore = parseInt(playerScore);
    dealerScore2 = parseInt(dealerScore2);
    const userName = document.getElementById("username-display");
    const username = userName.innerHTML.split(' ');
    if (dealerScore2 > 21) {
        walletBalance = parseInt(walletBalance) + parseInt(currentBet);
        document.getElementById("wallet-balance").innerHTML = walletBalance;
        const url= 'http://127.0.0.1:3000/player1?status=post&amount='+walletBalance+'&statusGame=won&username='+username[1];
        $.ajax({
            url: url,
            type: 'GET',
            success: function(data) {
                console.log(data);
                view.addMessage("¡Ganaste!!");  // Inform player they've won
            }
        });
        // walletBalance = parseInt(walletBalance) + parseInt(currentBet);
        // document.getElementById("wallet-balance").innerHTML = walletBalance;
        // view.addMessage("¡Ganaste!!");  // Inform player they've won
    }else if (playerScore > dealerScore2) {
        walletBalance = parseInt(walletBalance) + parseInt(currentBet);
        document.getElementById("wallet-balance").innerHTML = walletBalance;
        const url= 'http://127.0.0.1:3000/player1?status=post&amount='+walletBalance+'&statusGame=won&username='+username[1];
        $.ajax({
            url: url,
            type: 'GET',
            success: function(data) {
                console.log(data);
                view.addMessage("¡Ganaste!!");  // Inform player they've won
            }
        });
        // walletBalance = parseInt(walletBalance) + parseInt(currentBet);
        // document.getElementById("wallet-balance").innerHTML = walletBalance;
        // view.addMessage("¡Ganaste!");  // Inform player they've won
    } else if (playerScore < dealerScore2) {
        walletBalance = parseInt(walletBalance) - parseInt(currentBet);
        document.getElementById("wallet-balance").innerHTML = walletBalance;
        const url= 'http://127.0.0.1:3000/player1?status=post&amount='+walletBalance+'&statusGame=lost&username='+username[1];
        $.ajax({
            url: url,
            type: 'GET',
            success: function(data) {
                console.log(data);
                view.addMessage("¡Perdiste!");  // Inform player they've lost
            }
        });
        // walletBalance = parseInt(walletBalance) - parseInt(currentBet);
        // document.getElementById("wallet-balance").innerHTML = walletBalance;
        // view.addMessage("¡Perdiste!");  // Inform player they've lost
    } else {
        // walletBalance = parseInt(walletBalance) + parseInt(currentBet);
        // document.getElementById("wallet-balance").innerHTML = walletBalance;
        const url= 'http://127.0.0.1:3000/player1?status=post&amount='+walletBalance+'&statusGame=push&username='+username[1];
        $.ajax({
            url: url,
            type: 'GET',
            success: function(data) {
                console.log(data);
                view.addMessage("¡Empate!");  // Inform player of
            }
        });
        // view.addMessage("¡Empate!");  // Inform player of
    }
    document.getElementById("current-bet").innerHTML = 0;
});

// Listener for the "Reiniciar" (Reset) button
document.getElementById("reset-btn").addEventListener("click", function() {
    // gamePlay.reset();  // Reset the game to its initial state
    view.clearMessages();  // Clear any messages from the previous round
    // view.updateWallet(gamePlay.Blackjack.player.userWallet.getValue());  // Update wallet display

    const playerCards = document.getElementById("player-cards");
    playerCards.innerHTML = '';
    const dealerCards = document.getElementById("dealer-cards");
    dealerCards.innerHTML = '';

    document.getElementById("deal-btn").disabled = false;
    document.getElementById("bet-increase").disabled = false;
    document.getElementById("bet-decrease").disabled = false;
    const userName = document.getElementById("username-display");
    const username = userName.innerHTML.split(' ');
    const url= 'http://127.0.0.1:3000/player1?status=post&amount='+0+'&statusGame=gameover&username='+username[1];
    $.ajax({
        url: url,
        type: 'GET',
        success: function(data) {
            console.log(data);
            view.addMessage("¡Juego reiniciado!");
        }
    });
});

document.getElementById("reset-btn2").addEventListener("click", function() {
    // gamePlay.reset();  // Reset the game to its initial state
    view.clearMessages();  // Clear any messages from the previous round
    // view.updateWallet(gamePlay.Blackjack.player.userWallet.getValue());  // Update wallet display

    const playerCards = document.getElementById("player-cards");
    playerCards.innerHTML = '';
    const dealerCards = document.getElementById("dealer-cards");
    dealerCards.innerHTML = '';

    document.getElementById("deal-btn").disabled = false;
    document.getElementById("bet-increase").disabled = false;
    document.getElementById("bet-decrease").disabled = false;
    // const userName = document.getElementById("username-display");
    // const username = userName.innerHTML.split(' ');
    // const url= 'http://127.0.0.1:3000/player1?status=post&amount='+0+'&statusGame=gameover&username='+username[1];
    // $.ajax({
    //     url: url,
    //     type: 'GET',
    //     success: function(data) {
    //         console.log(data);
    //         view.addMessage("¡Juego reiniciado!");
    //     }
    // });
});

// Listener for the "Incrementar apuesta" (Increase Bet) button
document.getElementById("bet-increase").addEventListener("click", function() {
    // let currentBet = gamePlay.Blackjack.player.getUserBet();  // Get current bet value
    // let wallet = gamePlay.Blackjack.player.userWallet.getValue();  // Get current wallet balance
    //
    // // Increase bet by $100 if the player has enough balance
    // if (currentBet + 100 <= wallet) {
    //     gamePlay.Blackjack.setBet(currentBet + 100);  // Set the new bet
    //     view.updateBet(currentBet + 100);  // Update the UI with the new bet amount
    // } else {
    //     alert("No tienes suficiente saldo para incrementar la apuesta.");  // Warn if insufficient funds
    // }
    document.getElementById("deal-btn").disabled = false;
    const currentBet = parseInt(document.getElementById("current-bet").innerHTML);
    const wallet = parseInt(document.getElementById("wallet-balance").innerHTML);
    if (currentBet + 100 <= wallet) {
        document.getElementById("current-bet").innerHTML = currentBet + 100;
    } else {
        alert("No tienes suficiente saldo para incrementar la apuesta.");
    }
});

// Listener for the "Disminuir apuesta" (Decrease Bet) button
document.getElementById("bet-decrease").addEventListener("click", function() {
    let currentBet = gamePlay.Blackjack.player.getUserBet();  // Get current bet value

    // Decrease bet by $100 but not below $100
    if (currentBet > 100) {
        gamePlay.Blackjack.setBet(currentBet - 100);  // Set the new bet
        view.updateBet(currentBet - 100);  // Update the UI with the new bet amount
    } else {
        alert("La apuesta mínima es de $100.");  // Warn if trying to bet below $100
    }
});

// document.getElementById("xml").addEventListener("click", function() {
//     gamePlay.Blackjack.getRemoteAdvice("xml");
// })
// document.getElementById("jquery").addEventListener("click", function() {
//     gamePlay.Blackjack.getRemoteAdvice("jquery");
// })
// document.getElementById("fetch").addEventListener("click", function() {
//     gamePlay.Blackjack.getRemoteAdvice("fetch");
// })
// document.getElementById("ajax").addEventListener("click", function() {
//     gamePlay.Blackjack.getRemoteAdvice("ajax");
// })






