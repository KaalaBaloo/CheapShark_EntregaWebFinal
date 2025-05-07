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
                    <img src="${game.thumb}">
                    <h5 class="card-title">${game.external}</h5>
                    <p class="card-text">Cheapest Price: <strong>$${game.cheapest}</strong></p>
                    <a href="${gameLink}" target="_blank">View Deal</a>
                </div>
            </div>
        `;
        $('#search-results').append(gameCard);
    }

    // Get under 15 deals
    fetch("https://www.cheapshark.com/api/1.0/deals?storeID=1&upperPrice=15")
    .then(function(response) {
        return response.json();
    })
    .then(function(deals) {
        if (deals.length > 0) {
            deals.forEach(function(deal) {
                displayDeal(deal);
            });
          }
     })
     .catch(function(error) {
         console.log(error);
    });

    // Display deal
    function displayDeal(deal) {
        let dealLink = `https://www.cheapshark.com/redirect?dealID=${deal.dealID}`;

        let dealCard = `
            <div class="card">
                <div class="card-body">
                    <img src="${deal.thumb}">
                    <h5 class="card-title">${deal.title}</h5>
                    <p class="card-text">Price: <strong>$${deal.salePrice}</strong> <del>$${deal.normalPrice}</del></p>
                    <a href="${dealLink}" target="_blank">View Deal</a>
                </div>
            </div>
        `;

        $('#deals-list').append(dealCard);
    }

});
