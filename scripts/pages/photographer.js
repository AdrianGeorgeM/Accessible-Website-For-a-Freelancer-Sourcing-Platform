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

	document.addEventListener('DOMContentLoaded', () => {
		// No need to query DOM again for lightbox triggers
		const lightboxTriggers = elements.mediaItems;
		lightboxTriggers.forEach((trigger) => {
			if (trigger) trigger.addEventListener('click', showLightbox);
		});
	});
};
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
			elements.photographerName.textContent =
				gallery.firstChild.querySelector('.item-title').textContent;
		}
	} catch (error) {
		console.error('Error generating gallery:', error);
	}
};

initializeGallery();
initializeEventListeners();
