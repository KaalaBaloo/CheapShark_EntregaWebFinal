document.addEventListener("DOMContentLoaded", function () {
  const toggleBtn = document.getElementById("modo-toggle");
  const logoImg = document.querySelector(".logo-img");
  const fondo = document.body;
  const botonCTA = document.querySelector("#c2a img");

  const isInHtmlFolder = location.pathname.includes("/html/");
  const imgPrefix = isInHtmlFolder ? "../media/img/" : "media/img/";

  let darkMode = false;

  toggleBtn.addEventListener("click", (e) => {
    e.preventDefault();
    darkMode = !darkMode;
    fondo.classList.toggle("dark-mode");

    logoImg.src = imgPrefix + (darkMode
      ? "CheapSharkTituloO.png"
      : "CheapSharkTituloC.png");

    toggleBtn.src = imgPrefix + (darkMode
      ? "ToggleOscuro.png"
      : "ToggleClaro.png");

    botonCTA.src = imgPrefix + (darkMode
      ? "BotonOscuro.png"
      : "BotonClaro.png");
  });
});
