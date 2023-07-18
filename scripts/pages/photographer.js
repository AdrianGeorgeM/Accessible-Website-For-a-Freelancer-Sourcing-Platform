import { getPhotographers } from '../utils/getPhotographers.js';

function getPhotographerIdFromURL() {
	const urlParams = new URLSearchParams(window.location.search);
	return parseInt(urlParams.get('id'));
}

async function getProfile(photographerId) {
	try {
		let { photographers } = await getPhotographers();
		console.log(photographers);
		return photographers.filter((item) => item.id === photographerId);
	} catch (error) {
		console.error('Error getting media items:', error);
	}
}

// Function to create a gallery item
function createGalleryItem(item) {
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

function createPhotoItem(item) {
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

// Function to get all photos from a photographer
async function getPhotosMedia(photographerId) {
	try {
		const { photographers, media } = await getPhotographers();

		// Find the photographer once
		const photographer = photographers.find(
			(photographer) => photographer.id === photographerId
		);

		if (!photographer) {
			throw new Error(`No photographer found with ID ${photographerId}`);
		}

		const filteredMedia = media
			.filter(
				(item) => item.photographerId === photographerId && (item.image || item.video)
			)
			.map((item) => ({
				...item,
				photographerName: photographer.name,
			}));
		console.log('filteredMedia', filteredMedia);
		return filteredMedia;
	} catch (error) {
		console.error('Error getting media items:', error);
	}
}

// Function to create a gallery of photos
async function generatePhotos(photographerId) {
	const mediaItems = await getPhotosMedia(photographerId);

	const galleryContainer = document.createElement('div');
	galleryContainer.classList.add('gallery');

	mediaItems.forEach((item) => {
		const photoItem = createPhotoItem(item);
		galleryContainer.appendChild(photoItem);
	});
	console.log(galleryContainer);
	return galleryContainer;
}

async function generateGallery() {
	const photographerId = getPhotographerIdFromURL();
	const profileItems = await getProfile(photographerId);
	const photoGallery = await generatePhotos(photographerId);
	console.log(photoGallery);
	const galleryContainer = document.createElement('div');
	galleryContainer.classList.add('gallery');

	profileItems.forEach((item) => {
		const galleryItem = createGalleryItem(item);
		galleryContainer.appendChild(galleryItem);
	});

	galleryContainer.appendChild(photoGallery);

	return galleryContainer;
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
