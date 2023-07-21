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

document.getElementById('sort-by').addEventListener('change', handleSort);

generateGallery('popularity')
	.then((gallery) => {
		const galleryContainer = document.querySelector('.gallery-container');
		if (!galleryContainer) {
			console.error('Cannot find element with class name "gallery-container".');
		} else {
			galleryContainer.appendChild(gallery);
		}

		const photographerName = document.getElementById('photographer-name');
		photographerName.textContent =
			gallery.firstChild.querySelector('.item-title').textContent;
	})
	.catch((error) => {
		console.error('Error generating gallery:', error);
	});

function showLightbox() {
	// Remove the existing lightbox if there is one
	const existingLightbox = document.querySelector('.lightbox');
	if (existingLightbox) {
		existingLightbox.remove();
	}

	const lightbox = document.createElement('div');
	lightbox.classList.add('lightbox');

	const mediaItems = document.querySelectorAll('.photo-item');
	const currentMediaItem = this.parentNode;

	const currentIndex = Array.from(mediaItems).indexOf(currentMediaItem);

	const lightboxContent = document.createElement('div');
	lightboxContent.classList.add('lightbox-content');

	// Append the clone of the clicked media item to the lightbox content
	const mediaClone = currentMediaItem.cloneNode(true);
	lightboxContent.appendChild(mediaClone);

	const closeButton = document.createElement('span');
	closeButton.classList.add('lightbox-close');
	closeButton.innerHTML = '&#x2716;';

	const previousButton = document.createElement('span');
	previousButton.classList.add('lightbox-previous');
	previousButton.innerHTML = '&#x25C0;';

	const nextButton = document.createElement('span');
	nextButton.classList.add('lightbox-next');
	nextButton.innerHTML = '&#x25B6;';

	closeButton.addEventListener('click', () => lightbox.remove());
	previousButton.addEventListener('click', () => {
		if (currentIndex > 0) {
			mediaItems[currentIndex - 1].querySelector('.lightbox-trigger').click();
		}
	});
	nextButton.addEventListener('click', () => {
		if (currentIndex < mediaItems.length - 1) {
			mediaItems[currentIndex + 1].querySelector('.lightbox-trigger').click();
		}
	});

	lightbox.appendChild(closeButton);
	lightbox.appendChild(previousButton);
	lightbox.appendChild(lightboxContent);
	lightbox.appendChild(nextButton);

	lightbox.style.display = 'flex'; // Add this line to show the lightbox
	document.body.appendChild(lightbox);
}

document.addEventListener('keydown', (event) => {
	const mediaItems = document.querySelectorAll('.photo-item');

	const currentLightbox = document.querySelector('.lightbox');
	const currentIndex = Array.from(mediaItems).indexOf(currentLightbox.firstChild);

	if (event.key === 'ArrowLeft') {
		if (currentIndex > 0) {
			mediaItems[currentIndex - 1].querySelector('.lightbox-trigger').click();
		}
	} else if (event.key === 'ArrowRight') {
		if (currentIndex < mediaItems.length - 1) {
			mediaItems[currentIndex + 1].querySelector('.lightbox-trigger').click();
		}
	} else if (event.key === 'Escape') {
		currentLightbox.remove();
	}
});

const galleryContainer = document.querySelector('.gallery-container');
galleryContainer.addEventListener('click', (event) => {
	const lightboxTrigger = event.target.closest('.lightbox-trigger');
	if (lightboxTrigger) {
		showLightbox.call(lightboxTrigger);
	}
});

function handleContactFormSubmit(event) {
	event.preventDefault();
	const name = document.getElementById('contact-name').value;
	const email = document.getElementById('contact-email').value;
	const message = document.getElementById('contact-message').value;

	console.log('Name:', name);
	console.log('Email:', email);
	console.log('Message:', message);
}

const contactForm = document.getElementById('contact-form');
contactForm.addEventListener('submit', handleContactFormSubmit);

function showContactForm() {
	const contactModal = document.getElementById('contact-modal');
	contactModal.style.display = 'block';
}

function hideContactForm() {
	const contactModal = document.getElementById('contact-modal');
	contactModal.style.display = 'none';
}

const contactButton = document.getElementById('contact-button');
contactButton.addEventListener('click', showContactForm);

const closeModalButton = document.getElementById('close-modal-button');
closeModalButton.addEventListener('click', hideContactForm);
