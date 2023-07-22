// Import necessary components and utils
import { generateGallery, handleSort } from '../utils/gallery.js';
import { showLightbox, showPrevImage, showNextImage } from '../utils/lightbox.js';
import {
	handleContactFormSubmit,
	showContactForm,
	hideContactForm,
} from '../utils/form.js';
import { debounce } from '../utils/debounce.js'; // Import debounce function

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
	// Apply debounce here
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
	elements.sortBy.addEventListener('change', handleSort);
	document.addEventListener('keydown', handleKeyboardEvents);
	elements.galleryContainer.addEventListener('click', handleGalleryClicks);
	elements.contactForm.addEventListener('submit', handleContactFormSubmit);
	elements.contactButton.addEventListener('click', showContactForm);
	elements.closeModalButton.addEventListener('click', hideContactForm);

	document.addEventListener('DOMContentLoaded', () => {
		// No need to query DOM again for lightbox triggers
		const lightboxTriggers = elements.mediaItems;
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
