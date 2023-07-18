import { getPhotographers } from '../utils/getPhotographers.js';
import { photographerFactory } from '../factories/photographer.js';

// Function to get the photographer ID from the URL parameter
function getPhotographerIdFromURL() {
	const urlParams = new URLSearchParams(window.location.search);
	return parseInt(urlParams.get('id'));
}

// Function to get media items for a specific photographer ID
async function getMediaItems(photographerId) {
	let photographers = await getPhotographers();
	photographers = photographers.filter((item) => item.id === photographerId);
	console.log('s', photographers);
	return photographers;
}

// Function to generate the gallery HTML for a photographer
async function generateGallery() {
	const photographerId = getPhotographerIdFromURL();
	const mediaItems = await getMediaItems(photographerId);

	const galleryContainer = document.createElement('div');
	galleryContainer.classList.add('gallery');

	mediaItems.forEach((item) => {
		const galleryItem = document.createElement('div');
		galleryItem.classList.add('gallery-item');

		const title = document.createElement('h3');
		title.textContent = item.name;
		title.classList.add('item-title');

		const city = document.createElement('p');
		city.textContent = item.city;
		city.classList.add('item-city');

		const tagline = document.createElement('p');
		tagline.textContent = item.tagline;
		tagline.classList.add('item-tagline');

		const price = document.createElement('p');
		price.textContent = `$${item.price}`;
		price.classList.add('item-price');

		const portrait = document.createElement('img');
		portrait.setAttribute('src', `assets/photographers/${item.portrait}`);
		portrait.classList.add('item-portrait');

		galleryItem.appendChild(portrait);
		galleryItem.appendChild(title);
		galleryItem.appendChild(city);
		galleryItem.appendChild(tagline);
		galleryItem.appendChild(price);

		galleryContainer.appendChild(galleryItem);
	});

	return galleryContainer;
}
generateGallery()
	.then((gallery) => {
		// Append the gallery to a container element  HTML
		const galleryContainer = document.querySelector('.gallery-container');
		galleryContainer.appendChild(gallery);
	})
	.catch((error) => {
		console.error(error);
	});

export { generateGallery };
