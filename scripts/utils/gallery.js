import { getPhotographers } from '../utils/getPhotographers.js';

function getIdFromURL() {
	const urlParams = new URLSearchParams(window.location.search);
	return parseInt(urlParams.get('id'));
}

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

	const likeIcon = document.createElement('span');
	likeIcon.classList.add('like-icon');
	likeIcon.innerHTML = '&#x2665;';

	likeIcon.addEventListener('click', () => {
		likes.textContent = parseInt(likes.textContent) + 1;
	});

	const lightboxTrigger = document.createElement('span');
	lightboxTrigger.classList.add('lightbox-trigger');
	lightboxTrigger.textContent = 'View';

	photoItem.appendChild(media);
	photoItem.appendChild(title);
	photoItem.appendChild(likes);
	photoItem.appendChild(likeIcon);
	photoItem.appendChild(price);
	photoItem.appendChild(lightboxTrigger);

	return photoItem;
}

async function generateGallery(sortBy) {
	const photographerId = getIdFromURL();

	try {
		const { photographers, media } = await getPhotographers();

		const photographer = photographers.find(
			(photographer) => photographer.id === photographerId
		);

		if (!photographer) {
			throw new Error(`No photographer found with ID ${photographerId}`);
		}

		const galleryItems = [createProfileItem(photographer)];

		const mediaItems = media
			.filter(
				(item) => item.photographerId === photographerId && (item.image || item.video)
			)
			.map((item) => ({
				...item,
				photographerName: photographer.name,
			}));

		// Sort media items
		if (sortBy === 'popularity') {
			mediaItems.sort((a, b) => b.likes - a.likes);
		} else if (sortBy === 'title') {
			mediaItems.sort((a, b) => a.title.localeCompare(b.title));
		} else if (sortBy === 'date') {
			mediaItems.sort((a, b) => new Date(a.date) - new Date(b.date));
		} else if (sortBy === 'price') {
			mediaItems.sort((a, b) => a.price - b.price);
		}

		console.log(
			'Sorted media items:',
			mediaItems.map((item) => ({
				title: item.title,
				likes: item.likes,
				price: item.price,
				date: item.date,
			}))
		);

		const galleryContainer = document.createElement('div');
		galleryContainer.classList.add('gallery');

		const fragment = document.createDocumentFragment();
		galleryItems.forEach((item) => {
			fragment.appendChild(item);
		});

		galleryContainer.appendChild(fragment);

		mediaItems.forEach((item) => {
			galleryContainer.appendChild(createMediaItem(item));
		});

		return galleryContainer;
	} catch (error) {
		console.error('Error generating gallery:', error);
	}
}

async function handleSort() {
	const sortBy = document.getElementById('sort-by').value;
	const gallery = await generateGallery(sortBy);
	const galleryContainer = document.querySelector('.gallery-container');
	galleryContainer.innerHTML = '';
	galleryContainer.appendChild(gallery);
}

export { getIdFromURL, createProfileItem, createMediaItem, generateGallery, handleSort };
