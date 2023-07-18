async function getMediaItems(photographerId) {
	const response = await fetch('data/photographers.json');
	const data = await response.json();
	return data.media.filter((item) => item.photographerId === photographerId);
}

function createMediaItemHTML(mediaItem) {
	const { title, likes, url, type, id } = mediaItem;
	const mediaItemHTML = `
      <div class="media-item" onclick="openLightbox(${id})">
          ${
						type === 'photo'
							? `<img src="${url}" alt="${title}" />`
							: `<video src="${url}"></video>`
					}
          <h3>${title}</h3>
          <p>Likes: <span id="likes-count-${id}" class="likes-count">${likes}</span></p>
          <button class="like-button" onclick="incrementLikes(${id})">Like</button>
      </div>
  `;
	return mediaItemHTML;
}

function incrementLikes(mediaItemId) {
	const mediaItem = mediaItems.find((item) => item.id === mediaItemId);
	mediaItem.likes++;
	document.querySelector(`#likes-count-${mediaItemId}`).innerText = mediaItem.likes;
}

function sortMediaItems(mediaItems, sortBy) {
	const sortedMediaItems = [...mediaItems];
	sortedMediaItems.sort((a, b) => {
		if (sortBy === 'title') {
			return a.title.localeCompare(b.title);
		} else if (sortBy === 'likes') {
			return b.likes - a.likes;
		} else {
			return 0;
		}
	});
	return sortedMediaItems;
}
function displaySortedMediaItems(sortBy) {
	const sortedMediaItems = sortMediaItems(mediaItems, sortBy);
	const mediaGallery = document.querySelector('.media-gallery');
	mediaGallery.innerHTML = '';
	sortedMediaItems.forEach((mediaItem) => {
		const mediaItemHTML = createMediaItemHTML(mediaItem);
		mediaGallery.insertAdjacentHTML('beforeend', mediaItemHTML);
	});
}
function showContactForm() {
	const contactForm = document.getElementById('contact-form');
	contactForm.style.display = 'block';
}

function submitContactForm(event) {
	event.preventDefault();

	const name = document.getElementById('name').value;
	const email = document.getElementById('email').value;
	const message = document.getElementById('message').value;

	console.log(`Name: ${name}`);
	console.log(`Email: ${email}`);
	console.log(`Message: ${message}`);

	document.getElementById('contact-form').style.display = 'none';
	showContactForm();
}

// TODO: Fetch the photographer's media items, then display them.
async function getMediaItems() {
	const response = await fetch('path_to_your/media.json');
	const data = await response.json();
	return data.media;
}

async function displayMediaItems(photographerId) {
	const mediaItems = await getMediaItems(photographerId);
	const mediaGallery = document.querySelector('.media-gallery');
	mediaItems.forEach((mediaItem) => {
		const mediaItemHTML = createMediaItemHTML(mediaItem);
		mediaGallery.insertAdjacentHTML('beforeend', mediaItemHTML);
	});
}

// TODO: replace with the actual photographer's ID
const photographerId = 1;
displayMediaItems(photographerId);
