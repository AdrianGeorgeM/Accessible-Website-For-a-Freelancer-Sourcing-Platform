import { getPhotographers } from '../utils/getPhotographers.js';
import { photographerFactory } from '../factories/photographer.js';

async function displayData(photographers) {
	const photographersSection = document.querySelector('.photographer_section');
	photographers.forEach((photographer) => {
		const photographerModel = photographerFactory(photographer);
		const userCardDOM = photographerModel.getUserCardDOM();
		photographersSection.appendChild(userCardDOM);
	});
}

async function init() {
	// Retrieve photographer data
	const photographers = await getPhotographers();
	console.log('dd', photographers);
	displayData(photographers);
}

init();
