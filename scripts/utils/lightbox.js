// Helper Functions
function createButton(className, innerHTML, onClick) {
	const button = document.createElement('span');
	button.classList.add(className);
	button.innerHTML = innerHTML;
	button.addEventListener('click', onClick);
	return button;
}

function createMediaElement(mediaElement, mediaTitleText) {
	const mediaClone = mediaElement.cloneNode(true);
	mediaClone.classList.add('lightbox-image');

	const lightboxTitle = document.createElement('h3');
	lightboxTitle.classList.add('lightbox-title');
	lightboxTitle.textContent = mediaTitleText;

	const lightboxContent = document.createElement('div');
	lightboxContent.classList.add('lightbox-content');
	lightboxContent.appendChild(mediaClone);
	lightboxContent.appendChild(lightboxTitle);

	return lightboxContent;
}

function removeExistingLightbox() {
	const existingLightbox = document.querySelector('.lightbox');
	if (existingLightbox) {
		existingLightbox.remove();
	}
}

// Main Functions
function showLightbox() {
	removeExistingLightbox();

	const currentMediaItem = this.parentNode;
	const mediaElement = currentMediaItem.querySelector('img, video');
	const mediaItems = Array.from(document.querySelectorAll('.photo-item'));
	const currentIndex = mediaItems.indexOf(currentMediaItem);

	if (!mediaElement) {
		console.error('Media element not found in the current media item.');
		return;
	}

	const lightbox = document.createElement('div');
	lightbox.classList.add('lightbox');

	const mediaTitleText =
		currentMediaItem.querySelector('.photo-title')?.textContent || '';
	lightbox.appendChild(createMediaElement(mediaElement, mediaTitleText));

	lightbox.appendChild(
		createButton('lightbox-close', '&#x2716;', () => lightbox.remove())
	);
	lightbox.appendChild(
		createButton('lightbox-previous', '&#10094;', () =>
			showPrevImage(currentIndex, lightbox)
		)
	);
	lightbox.appendChild(
		createButton('lightbox-next', '&#10095;', () =>
			showNextImage(currentIndex, mediaItems.length, lightbox)
		)
	);

	lightbox.style.display = 'flex';
	document.body.appendChild(lightbox);
}

function showPrevImage(currentIndex, currentLightbox) {
	currentLightbox.remove();
	const mediaItems = document.querySelectorAll('.photo-item');
	const prevIndex = (currentIndex - 1 + mediaItems.length) % mediaItems.length;
	mediaItems[prevIndex]?.querySelector('.lightbox-trigger')?.click();
}

function showNextImage(currentIndex, totalItems, currentLightbox) {
	currentLightbox.remove();
	const mediaItems = document.querySelectorAll('.photo-item');
	const nextIndex = (currentIndex + 1) % totalItems;
	mediaItems[nextIndex]?.querySelector('.lightbox-trigger')?.click();
}

export { showLightbox, showPrevImage, showNextImage };
