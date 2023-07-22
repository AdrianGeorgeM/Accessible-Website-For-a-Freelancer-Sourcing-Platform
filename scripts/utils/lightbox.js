function showLightbox() {
	const existingLightbox = document.querySelector('.lightbox');
	if (existingLightbox) {
		existingLightbox.remove();
	}

	const lightbox = document.createElement('div');
	lightbox.classList.add('lightbox');

	const mediaItems = document.querySelectorAll('.photo-item');
	const currentMediaItem = this.parentNode;
	const currentIndex = Array.from(mediaItems).indexOf(currentMediaItem);

	const mediaElement = currentMediaItem.querySelector('img, video');

	if (!mediaElement) {
		console.error('Media element not found in the current media item.');
		return;
	}

	const lightboxContent = document.createElement('div');
	lightboxContent.classList.add('lightbox-content');

	const mediaClone = mediaElement.cloneNode(true);
	mediaClone.classList.add('lightbox-image');

	const photoTitleElement = currentMediaItem.querySelector('.photo-title');
	const mediaTitle = photoTitleElement ? photoTitleElement.textContent : '';
	const lightboxTitle = document.createElement('h3');
	lightboxTitle.classList.add('lightbox-title');
	lightboxTitle.textContent = mediaTitle;

	lightboxContent.appendChild(mediaClone);
	lightboxContent.appendChild(lightboxTitle);

	const closeButton = document.createElement('span');
	closeButton.classList.add('lightbox-close');
	closeButton.innerHTML = '&#x2716;';

	closeButton.addEventListener('click', () => lightbox.remove());

	const prevButton = document.createElement('span');
	prevButton.classList.add('lightbox-previous');
	prevButton.innerHTML = '&#10094;';

	const nextButton = document.createElement('span');
	nextButton.classList.add('lightbox-next');
	nextButton.innerHTML = '&#10095;';

	prevButton.addEventListener('click', () => showPrevImage(currentIndex));
	nextButton.addEventListener('click', () =>
		showNextImage(currentIndex, mediaItems.length)
	);

	lightbox.appendChild(closeButton);
	lightbox.appendChild(prevButton);
	lightbox.appendChild(nextButton);
	lightbox.appendChild(lightboxContent);

	lightbox.style.display = 'flex';
	document.body.appendChild(lightbox);
}

function showPrevImage(currentIndex) {
	const mediaItems = document.querySelectorAll('.photo-item');
	const prevIndex = (currentIndex - 1 + mediaItems.length) % mediaItems.length;
	const prevMediaItem = mediaItems[prevIndex];

	// Check if prevMediaItem exists, otherwise, start from the last media item
	if (!prevMediaItem) {
		mediaItems[mediaItems.length - 1].querySelector('.lightbox-trigger').click();
	} else {
		prevMediaItem.querySelector('.lightbox-trigger').click();
	}
}

function showNextImage(currentIndex, totalItems) {
	const mediaItems = document.querySelectorAll('.photo-item');
	const nextIndex = (currentIndex + 1) % totalItems;
	const nextMediaItem = mediaItems[nextIndex];

	// Check if nextMediaItem exists, otherwise, start from the first media item (index 0)
	if (!nextMediaItem) {
		mediaItems[0].querySelector('.lightbox-trigger').click();
	} else {
		nextMediaItem.querySelector('.lightbox-trigger').click();
	}
}

export { showLightbox, showPrevImage, showNextImage };
