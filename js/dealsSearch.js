$(document).ready(function () {
  var currentPage = 1;
  var pageSize = 15;
  var storesMap = {};

  fetch("https://www.cheapshark.com/api/1.0/stores")
    .then(function (res) { return res.json(); })
    .then(function (stores) {
      var $storeSelect = $('#store-select');
      $storeSelect.empty();
      $storeSelect.append('<option value="">Todas</option>');
      for (var i = 0; i < stores.length; i++) {
        var store = stores[i];
        if (store.isActive === 1) {
          storesMap[store.storeID] = store.storeName;
          $storeSelect.append('<option value="' + store.storeID + '">' + store.storeName + '</option>');
        }
      }
    })
    .catch(function () {
      $('#store-select').html('<option value="">Todas</option>');
    });

  $('#price-range').on('input', function () {
    $('#price-value').text('$' + $(this).val());
    currentPage = 1;
    getFilteredDeals(currentPage);
  });

  $('#metacritic-score, #steam-rating, #store-select, #sort-by').on('change', function () {
    currentPage = 1;
    getFilteredDeals(currentPage);
  });

  $('#search-btn').click(function () {
    currentPage = 1;
    getSearchDeals(currentPage);
  });

  $(document).on('click', '#pagination button', function () {
    currentPage = parseInt($(this).data('page'));
    var title = $('#game-search').val().trim();
    if (title) {
      getSearchDeals(currentPage);
    } else {
      getFilteredDeals(currentPage);
    }
  });

  function getSearchDeals(page) {
    showLoader();
    var title = $('#game-search').val().trim();
    var url = "https://www.cheapshark.com/api/1.0/deals?pageSize=60&sortBy=Deal%20Rating&title=" + encodeURIComponent(title);

    fetch(url)
      .then(function (res) { return res.json(); })
      .then(function (data) {
        var deals = data.slice((page - 1) * pageSize, page * pageSize);
        renderDeals(deals);
        renderPagination(data.length, page);
        hideLoader();
      })
      .catch(function () {
        $('#deals-list').html('<p class="text-danger">Error al cargar las ofertas.</p>');
        hideLoader();
      });
  }

  function getFilteredDeals(page) {
    showLoader();

    var maxPrice = parseFloat($('#price-range').val());
    var metacritic = parseInt($('#metacritic-score').val()) || 0;
    var steamRating = parseInt($('#steam-rating').val()) || 0;
    var storeID = $('#store-select').val();
    var sortBy = $('#sort-by').val();

    var url = "https://www.cheapshark.com/api/1.0/deals?pageSize=60";
    if (storeID) url += "&storeID=" + storeID;
    if (sortBy) url += "&sortBy=" + sortBy;
    if (maxPrice) url += "&upperPrice=" + maxPrice;

    fetch(url)
      .then(function (res) { return res.json(); })
      .then(function (data) {
        var filtered = [];

        for (var i = 0; i < data.length; i++) {
          var d = data[i];
          var price = parseFloat(d.salePrice);
          var meta = parseInt(d.metacriticScore) || 0;
          var steam = parseFloat(d.steamRatingPercent) || 0;

          if (price <= maxPrice && meta >= metacritic && steam >= steamRating) {
            filtered.push(d);
          }
        }

        var deals = filtered.slice((page - 1) * pageSize, page * pageSize);
        renderDeals(deals);
        renderPagination(filtered.length, page);
        hideLoader();
      })
      .catch(function () {
        $('#deals-list').html('<p class="text-danger">Error al cargar las ofertas.</p>');
        hideLoader();
      });
  }

  function renderDeals(deals) {
    $('#deals-list').empty();

    if (deals.length === 0) {
      $('#deals-list').append('<p class="text-center">No se encontraron resultados.</p>');
      return;
    }

    for (var i = 0; i < deals.length; i++) {
      var d = deals[i];
      var store = storesMap[d.storeID] || "Desconocida";
      var imgId = "deal-img-" + d.dealID;
      var thumb = d.thumb;

      var card = `
        <div class="col-md-4 mb-4">
          <div class="card h-100">
            <img id="${imgId}" src="${thumb}" class="card-img-top img-fluid" alt="${d.title}" style="height: 200px; object-fit: cover;" />
            <div class="card-body d-flex flex-column">
              <h5 class="card-title">${d.title}</h5>
              <p class="card-text mb-1">Tienda: <strong>${store}</strong></p>
              <p class="card-text">Precio: <strong>$${d.salePrice}</strong> <del>$${d.normalPrice}</del></p>
              <p class="card-text">Metacritic: ${d.metacriticScore || 'N/A'}<br />Steam Rating: ${d.steamRatingPercent || 'N/A'}%</p>
              <a href="https://www.cheapshark.com/redirect?dealID=${d.dealID}" target="_blank" class="btn btn-primary mt-auto">Ver oferta</a>
            </div>
          </div>
        </div>
      `;
      $('#deals-list').append(card);

      if (thumb.indexOf("capsule_sm_120") !== -1) {
        var bigImg = thumb.replace("capsule_sm_120", "capsule_616x353");
        var testImg = new Image();
        testImg.onload = (function (id, src) {
          return function () {
            document.getElementById(id).src = src;
          };
        })(imgId, bigImg);
        testImg.src = bigImg;
      }
    }
  }

  function renderPagination(total, current) {
    var totalPages = Math.ceil(total / pageSize);
    var $p = $('#pagination');
    $p.empty();

    if (totalPages <= 1) return;

    for (var i = 1; i <= totalPages; i++) {
      var active = (i === current) ? 'active' : '';
      var btn = '<button class="btn btn-sm btn-outline-primary me-1 ' + active + '" data-page="' + i + '">' + i + '</button>';
      $p.append(btn);
    }
  }

  function showLoader() {
    var loader = document.getElementById("loader");
    if (!loader) {
      loader = document.createElement("div");
      loader.id = "loader";
      loader.className = "position-fixed top-50 start-50 translate-middle";
      loader.style.zIndex = "9999";
      loader.style.background = "rgba(255,255,255,0.8)";
      loader.style.backdropFilter = "blur(2px)";
      loader.style.width = "100vw";
      loader.style.height = "100vh";
      loader.innerHTML = `
        <div class="d-flex justify-content-center align-items-center h-100">
          <div class="spinner-border text-primary" role="status" style="width: 4rem; height: 4rem;">
            <span class="visually-hidden">Cargando...</span>
          </div>
        </div>
      `;
      document.body.appendChild(loader);
    } else {
      loader.style.opacity = "1";
    }
  }

  function hideLoader() {
    var loader = document.getElementById("loader");
    if (loader) {
      setTimeout(function () {
        loader.style.opacity = "0";
        setTimeout(function () {
          loader.remove();
        }, 500);
      }, 500);
    }
  }

  fetch("https://www.cheapshark.com/api/1.0/deals?pageSize=60")
    .then(function (res) { return res.json(); })
    .then(function (deals) {
      var max = 0;
      for (var i = 0; i < deals.length; i++) {
        var p = parseFloat(deals[i].salePrice);
        if (p > max) max = p;
      }

      var rounded = 100;
      $('#price-range').attr('max', rounded);
      $('#price-range').val(rounded);
      $('#price-value').text('$' + rounded);
      getFilteredDeals(currentPage);
    })
    .catch(function () {
      $('#price-range').attr('max', 100);
      $('#price-range').val(100);
      $('#price-value').text('$100');
      getFilteredDeals(currentPage);
    });
});
