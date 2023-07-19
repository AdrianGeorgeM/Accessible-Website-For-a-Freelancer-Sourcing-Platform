import { getPhotographers } from '../utils/getPhotographers.js';

function getIdFromURL() {
	const urlParams = new URLSearchParams(window.location.search);
	return parseInt(urlParams.get('id'));
}

// Function to create a gallery item
function createProfileItem(item) {
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

	const portrait = document.createElement('img');
	portrait.setAttribute('src', `assets/photographers/${item.portrait}`);
	portrait.classList.add('item-portrait');

	galleryItem.appendChild(portrait);
	galleryItem.appendChild(title);
	galleryItem.appendChild(city);
	galleryItem.appendChild(tagline);

	return galleryItem;
}

function createMediaItem(item) {
	const photoItem = document.createElement('div');
	photoItem.classList.add('photo-item');

	const mediaType = item.image ? 'img' : 'video';
	const media = document.createElement(mediaType);

	const mediaSource = `assets/photographers/${item.photographerName}/${
		item.image || item.video
	}`;
	media.setAttribute('src', mediaSource);
	media.setAttribute('alt', item.name);
	media.classList.add('photo');

	if (mediaType === 'video') {
		media.setAttribute('controls', '');
	}

	const title = document.createElement('h3');
	title.textContent = item.title;
	title.classList.add('photo-title');

	const likes = document.createElement('p');
	likes.textContent = item.likes;
	likes.classList.add('photo-likes');

	const price = document.createElement('p');
	price.textContent = item.price;
	price.classList.add('photo-price');

	photoItem.appendChild(media);
	photoItem.appendChild(title);
	photoItem.appendChild(likes);
	photoItem.appendChild(price);

	return photoItem;
}
async function generateGallery() {
	const photographerId = getIdFromURL();

	try {
		const { photographers, media } = await getPhotographers();

		const photographer = photographers.find(
			(photographer) => photographer.id === photographerId
		);

		if (!photographer) {
			throw new Error(`No photographer found with ID ${photographerId}`);
		}

		const galleryItems = [];
		galleryItems.push(createProfileItem(photographer));

		const mediaItems = media
			.filter(
				(item) => item.photographerId === photographerId && (item.image || item.video)
			)
			.map((item) => ({
				...item,
				photographerName: photographer.name,
			}));

		mediaItems.forEach((item) => {
			galleryItems.push(createMediaItem(item));
		});

		// Create gallery
		const galleryContainer = document.createElement('div');
		galleryContainer.classList.add('gallery');

		galleryItems.forEach((item) => galleryContainer.appendChild(item));

		return galleryContainer;
	} catch (error) {
		console.error('Error generating gallery:', error);
	}
}

generateGallery()
	.then((gallery) => {
		const galleryContainer = document.querySelector('.gallery-container');
		if (!galleryContainer) {
			console.error('Cannot find element with class name "gallery-container".');
		} else {
			galleryContainer.appendChild(gallery);
		}
	})
	.catch((error) => {
		console.error('Error generating gallery:', error);
	});

export { generateGallery };
