// Import necessary components and utils
import { generateGallery, handleSort } from '../utils/gallery.js';
import { showLightbox, showPrevImage, showNextImage } from '../utils/lightbox.js';
import {
	handleContactFormSubmit,
	showContactForm,
	hideContactForm,
} from '../utils/form.js';
import { debounce } from '../utils/debounce.js';

// Cache DOM elements
const elements = {
	sortBy: document.getElementById('sort-by'),
	galleryContainer: document.querySelector('.gallery-container'),
	photographerName: document.getElementById('photographer-name'),
	contactForm: document.getElementById('contact-form'),
	contactButton: document.getElementById('contact-button'),
	closeModalButton: document.getElementById('close-modal-button'),
	mediaItems: document.querySelectorAll('.photo-item'),
};

// Handling Keyboard Events
const handleKeyboardEvents = debounce((event) => {
	const { key } = event;
	const currentLightbox = document.querySelector('.lightbox');

	// If there's no lightbox currently displayed, ignore the keyboard events
	if (!currentLightbox) return;

	const currentIndex = Array.from(elements.mediaItems).indexOf(
		Array.from(currentLightbox.querySelector('.lightbox-content').children).find(
			(child) => child.classList.contains('lightbox-image')
		)
	);

	switch (key) {
		case 'ArrowLeft':
			showPrevImage(currentIndex, currentLightbox);
			break;
		case 'ArrowRight':
			showNextImage(currentIndex, elements.mediaItems.length, currentLightbox);
			break;
		case 'Escape':
			currentLightbox.remove();
			break;
	}
}, 300);

// Handling Gallery Clicks
const handleGalleryClicks = (event) => {
	const lightboxTrigger = event.target.closest('.lightbox-trigger');
	if (lightboxTrigger) {
		showLightbox.call(lightboxTrigger);
	}
};

// Initializing Event Listeners
const initializeEventListeners = () => {
	if (elements.sortBy) elements.sortBy.addEventListener('change', handleSort);
	document.addEventListener('keydown', handleKeyboardEvents);
	if (elements.galleryContainer)
		elements.galleryContainer.addEventListener('click', handleGalleryClicks);
	if (elements.contactForm)
		elements.contactForm.addEventListener('submit', handleContactFormSubmit);
	if (elements.contactButton)
		elements.contactButton.addEventListener('click', showContactForm);
	if (elements.closeModalButton)
		elements.closeModalButton.addEventListener('click', hideContactForm);
	if (elements.closeModalButton)
		elements.closeModalButton.addEventListener('click', hideContactForm);

	document.addEventListener('DOMContentLoaded', () => {
		// No need to query DOM again for lightbox triggers
		const lightboxTriggers = elements.mediaItems;
		lightboxTriggers.forEach((trigger) => {
			if (trigger) trigger.addEventListener('click', showLightbox);
		});
	});
};

// Initializing Gallery
const initializeGallery = async () => {
	try {
		const gallery = await generateGallery('popularity');
		if (gallery && elements.galleryContainer) {
			elements.galleryContainer.appendChild(gallery);
		}
		if (
			gallery &&
			gallery.firstChild &&
			gallery.firstChild.querySelector('.item-title')
		) {
			const photographerName =
				gallery.firstChild.querySelector('.item-title').textContent;
			elements.photographerName.textContent = photographerName;
			elements.contactButton.innerText = `Contact ${photographerName}`;
		}
	} catch (error) {
		console.error('Error generating gallery:', error);
	}
};

initializeGallery();
initializeEventListeners();
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
