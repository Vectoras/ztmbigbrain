import * as particles_module from "../node_modules/particlesjs/src/particles.js";
import VanillaTilt from "../node_modules/vanilla-tilt/src/vanilla-tilt.js";

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

// Clarifai
const app = new Clarifai.App({
  apiKey: "833cf82f5bb24fb99dcd15f6c1c1448d",
});

// global variables
let imageEl;

// caching DOM elements
const imageSourceEl = document.querySelector("#image-source");
const formEl = document.querySelector("#app-form");
const imageContainerEl = document.querySelector("#selected-image-container");

// source change
imageSourceEl.addEventListener("change", (e) => {
  // reset the container
  imageContainerEl.textContent = "";
  // create image element
  imageEl = document.createElement("img");
  imageEl.src = e.currentTarget.value;
  imageEl.title = "Selected Image";
  // append
  imageContainerEl.appendChild(imageEl);
});

// form submission (request to detect)
formEl.addEventListener("submit", (e) => {
  e.preventDefault();
  app.models
    .predict("a403429f2ddf4b49b307e318f00e528b", imageEl.src)
    .then((response) => {
      let faceBoxesArray = response.outputs[0].data.regions.map((currentRegion) => {
        return currentRegion.region_info.bounding_box;
      });
      // draw the boxes
      faceBoxesArray.forEach((faceBox) => {
        // create element and add css build class
        const faceBoxEl = document.createElement("div");
        faceBoxEl.classList.add("face-box");
        // define points for absolute positioning
        faceBoxEl.style.top = `${faceBox.top_row * 100}%`;
        faceBoxEl.style.right = `${(1 - faceBox.right_col) * 100}%`;
        faceBoxEl.style.bottom = `${(1 - faceBox.bottom_row) * 100}%`;
        faceBoxEl.style.left = `${faceBox.left_col * 100}%`;
        // append
        imageContainerEl.appendChild(faceBoxEl);
      });
    })
    .catch((err) => {
      console.log("An error happened: ", err);
    });
});
