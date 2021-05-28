import VanillaTilt from "../node_modules/vanilla-tilt/src/vanilla-tilt.js";
import * as particles_module from "../node_modules/particlesjs/src/particles.js";
import Clarifai from "clarifai";

// ParticlesJS
window.onload = function () {
  Particles.init({
    selector: ".background",
    maxParticles: 150,
    minDistance: 140,
    connectParticles: true,
    color: "#ffffff",
    responsive: [
      {
        breakpoint: 1200,
        options: {
          minDistance: 130,
          maxParticles: 120,
        },
      },
      {
        breakpoint: 1000,
        options: {
          minDistance: 120,
          maxParticles: 120,
        },
      },
      {
        breakpoint: 768,
        options: {
          minDistance: 100,
          maxParticles: 120,
        },
      },
      {
        breakpoint: 400,
        options: {
          minDistance: 75,
          maxParticles: 120,
        },
      },
    ],
  });
};

// caching DOM elements
const imageSourceEl = document.querySelector("#image-source");
const formEl = document.querySelector("#app-form");
const imageEl = document.querySelector("#current-image");

// global variables
let currentImage = "";
const API_KEY = "";

// source change
imageSourceEl.addEventListener("change", (e) => {
  currentImage = e.currentTarget.value;
  console.log(currentImage);
  imageEl.src = currentImage;
  imageEl.title = "Selected Image";
});

// form submission (request to detect)
formEl.addEventListener("submit", (e) => {
  e.preventDefault();
  console.log("Need to implement request to API");
});
