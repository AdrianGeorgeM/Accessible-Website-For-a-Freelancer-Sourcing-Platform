import { generateGallery, handleSort } from '../utils/gallery.js';
import { showLightbox, showPrevImage, showNextImage } from '../utils/lightbox.js';
import {
	handleContactFormSubmit,
	showContactForm,
	hideContactForm,
} from '../utils/form.js';

// Cache DOM elements
const elements = {
	sortBy: document.getElementById('sort-by'),
	galleryContainer: document.querySelector('.gallery-container'),
	photographerName: document.getElementById('photographer-name'),
	contactForm: document.getElementById('contact-form'),
	contactButton: document.getElementById('contact-button'),
	closeModalButton: document.getElementById('close-modal-button'),
};

// Handling Keyboard Events
const handleKeyboardEvents = (event) => {
	const { key } = event;
	const mediaItems = document.querySelectorAll('.photo-item');
	const currentLightbox = document.querySelector('.lightbox');
	const currentIndex = Array.from(mediaItems).indexOf(currentLightbox.firstChild);

	switch (key) {
		case 'ArrowLeft':
			showPrevImage(currentIndex);
			break;
		case 'ArrowRight':
			showNextImage(currentIndex, mediaItems.length);
			break;
		case 'Escape':
			currentLightbox.remove();
			break;
	}
};

// Handling Gallery Clicks
const handleGalleryClicks = (event) => {
	const lightboxTrigger = event.target.closest('.lightbox-trigger');
	if (lightboxTrigger) {
		showLightbox.call(lightboxTrigger);
	}
};

// Initializing Event Listeners
const initializeEventListeners = () => {
	elements.sortBy.addEventListener('change', handleSort);
	document.addEventListener('keydown', handleKeyboardEvents);
	elements.galleryContainer.addEventListener('click', handleGalleryClicks);
	elements.contactForm.addEventListener('submit', handleContactFormSubmit);
	elements.contactButton.addEventListener('click', showContactForm);
	elements.closeModalButton.addEventListener('click', hideContactForm);

	document.addEventListener('DOMContentLoaded', () => {
		const lightboxTriggers = document.querySelectorAll('.lightbox-trigger');
		lightboxTriggers.forEach((trigger) => {
			trigger.addEventListener('click', showLightbox);
		});
	});
};

// Generate Gallery
const initializeGallery = async () => {
	try {
		const gallery = await generateGallery('popularity');
		elements.galleryContainer.appendChild(gallery);
		elements.photographerName.textContent =
			gallery.firstChild.querySelector('.item-title').textContent;
	} catch (error) {
		console.error('Error generating gallery:', error);
	}
};

initializeGallery();
initializeEventListeners();
