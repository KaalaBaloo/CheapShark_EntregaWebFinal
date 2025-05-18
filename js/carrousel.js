$(document).ready(function () {
  const swiperWrapper = document.querySelector(".swiper-wrapper");
  const desiredCount = 10;

  fetch("https://www.cheapshark.com/api/1.0/deals?upperPrice=20&sortBy=Deal%20Rating&pageSize=100")
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      var titles = [];
      var bestDeals = [];
      for (var i = 0; i < data.length; i++) {
        var deal = data[i];
        var index = titles.indexOf(deal.title);
        if (index === -1) {
          titles.push(deal.title);
          bestDeals.push(deal);
        } else {
          if (parseFloat(deal.salePrice) < parseFloat(bestDeals[index].salePrice)) {
            bestDeals[index] = deal;
          }
        }
      }

      var slidesAdded = 0;
      function processDeal(index) {
        if (slidesAdded >= desiredCount || index >= bestDeals.length) {
          if (slidesAdded > 0) {
            new Swiper(".mySwiper", {
              effect: "coverflow",
              grabCursor: true,
              centeredSlides: true,
              loop: true,
              slidesPerView: "auto",
              coverflowEffect: {
                rotate: 50,
                stretch: 0,
                depth: 100,
                modifier: 1,
                slideShadows: true,
              },
              autoplay: {
                delay: 3000,
              },
            });
          }

          var loader = document.getElementById("loader");
          if (loader) {
            setTimeout(function () {
              loader.style.opacity = "0";
              setTimeout(function () {
                loader.remove();
              }, 500);
            }, 500);
          }
          return;
        }

        var deal = bestDeals[index];
        if (!deal.steamAppID) {
          processDeal(index + 1);
          return;
        }

        var imageUrl = "https://cdn.cloudflare.steamstatic.com/steam/apps/" + deal.steamAppID + "/capsule_616x353.jpg";
        fetch(imageUrl, { method: "HEAD" }).then(function (res) {
          if (!res.ok) {
            processDeal(index + 1);
            return;
          }

          var slide = document.createElement("div");
          slide.className = "swiper-slide d-flex flex-column align-items-center";
          slide.style.width = "520px";
          slide.innerHTML =
            '<img src="' + imageUrl + '" alt="' + deal.title + '" class="img-fluid rounded shadow" />' +
            '<p class="mt-2 fw-bold">' + deal.title + '</p>' +
            '<p><span class="text-success">$' + deal.salePrice + '</span>' +
            '<span class="text-decoration-line-through text-muted ms-2">$' + deal.normalPrice + '</span></p>' +
            '<a href="https://www.cheapshark.com/redirect?dealID=' + deal.dealID + '" target="_blank" class="btn btn-outline-light btn-sm mt-1">Ver oferta</a>';

          swiperWrapper.appendChild(slide);
          slidesAdded++;
          processDeal(index + 1);
        }).catch(function (err) {
          console.error("Error checking image for", deal.title);
          processDeal(index + 1);
        });
      }

      processDeal(0);
    })
    .catch(function (err) {
      console.error("Error fetching deals:", err);
      var loader = document.getElementById("loader");
      if (loader) {
        loader.style.opacity = "0";
        setTimeout(function () {
          loader.remove();
        }, 500);
      }
    });
});
