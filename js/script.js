$(document).ready(function() {

    console.log("Ready")

    // Search game
    $('#search-btn').click(function() {
        let game = $('#game-search').val();

        if (game) {
            fetch(`https://www.cheapshark.com/api/1.0/games?title=${encodeURIComponent(game)}`)
                .then(function(response) {
                    return response.json();
                })
                .then(function(results) {
                    $('#search-results').empty();

                    if (results && results.length > 0) {
                        results.forEach(function(game) {
                            displaySearchResult(game);
                        });
                    }
                })
                .catch(function(error) {
                    console.log(error);
                });
        }
    });

    function displaySearchResult(game) {
        let gameLink = `https://www.cheapshark.com/redirect?dealID=${game.cheapestDealID}`;

        let gameCard = `
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">${game.external}</h5>
                    <p class="card-text">Cheapest Price: <strong>$${game.cheapest}</strong></p>
                    <a href="${gameLink}" target="_blank">View Deal</a>
                </div>
            </div>
        `;
        $('#search-results').append(gameCard);
    }

});
