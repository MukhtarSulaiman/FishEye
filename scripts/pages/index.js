import { mainPhotographersTemplate } from '../templates/photographer.js';
import { fetchPhotographers } from '../utils/fetchData.js';

async function displayData(photographers) {
    const photographersSection = document.querySelector('.photographer-section');

    photographers.forEach((photographer) => {
        const photographerModel = mainPhotographersTemplate(photographer);
        const userCardDOM = photographerModel.getUserCardDOM();
        photographersSection.innerHTML += userCardDOM;
    });
}

async function init() {
    // Récupère les datas des photographes
    const { photographers } = await fetchPhotographers();
    displayData(photographers);
}

init();