import {
	getIdFromURL,
	createProfileItem,
	createMediaItem,
	generateGallery,
	handleSort,
} from '../utils/gallery.js';
import { showLightbox, showPrevImage, showNextImage } from '../utils/lightbox.js';
import {
	handleContactFormSubmit,
	showContactForm,
	hideContactForm,
} from '../utils/form.js';

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

document.addEventListener('DOMContentLoaded', () => {
	const lightboxTriggers = document.querySelectorAll('.lightbox-trigger');
	lightboxTriggers.forEach((trigger) => {
		trigger.addEventListener('click', showLightbox);
	});
});

document.addEventListener('keydown', (event) => {
	const mediaItems = document.querySelectorAll('.photo-item');

	const currentLightbox = document.querySelector('.lightbox');
	const currentIndex = Array.from(mediaItems).indexOf(currentLightbox.firstChild);

	if (event.key === 'ArrowLeft') {
		showPrevImage(currentIndex);
	} else if (event.key === 'ArrowRight') {
		showNextImage(currentIndex, mediaItems.length);
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

const contactForm = document.getElementById('contact-form');
contactForm.addEventListener('submit', handleContactFormSubmit);

const contactButton = document.getElementById('contact-button');
contactButton.addEventListener('click', showContactForm);

const closeModalButton = document.getElementById('close-modal-button');
closeModalButton.addEventListener('click', hideContactForm);
