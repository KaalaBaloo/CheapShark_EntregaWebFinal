document.addEventListener("DOMContentLoaded", function () {
    const toggleBtn = document.getElementById("modo-toggle");
    const logoImg = document.querySelector(".logo-img");
    const fondo = document.body;
    const botonCTA = document.querySelector("#c2a img");

    let darkMode = false;

    toggleBtn.addEventListener("click", (e) => {
      e.preventDefault();
      darkMode = !darkMode;
      fondo.classList.toggle("dark-mode");

      logoImg.src = darkMode
        ? "../media/img/CheapSharkTituloO.png"
        : "../media/img/CheapSharkTituloC.png";

      toggleBtn.src = darkMode
        ? "../media/img/ToggleOscuro.png"
        : "../media/img/ToggleClaro.png";

      botonCTA.src = darkMode
        ? "../media/img/BotonOscuro.png"
        : "../media/img/BotonClaro.png";
    });
  });