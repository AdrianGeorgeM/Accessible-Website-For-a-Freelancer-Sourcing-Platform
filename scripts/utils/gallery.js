import { getPhotographers } from '../utils/getPhotographers.js';

const getIdFromURL = () =>
	parseInt(new URLSearchParams(window.location.search).get('id'));

const createElement = (type, classNames, content, src = null) => {
	const element = document.createElement(type);
	element.classList.add(...classNames);
	if (content) element.textContent = content;
	if (src) element.setAttribute('src', src);
	return element;
};

const createPhotoItem = ({ title, likes, price, image, photographerName }) => {
	const photoItem = createElement('div', ['photo-item']);
	const photo = createElement(
		'img',
		['photo'],
		null,
		`assets/photographers/${photographerName}/${image}`
	);
	photo.setAttribute('alt', title);

	const photoLikesContainer = createElement('div', ['photo-likes-container']);
	const likeIcon = createElement('span', ['like-icon'], '♥');
	const photoLikes = createElement('p', ['photo-likes'], likes.toString());
	likeIcon.addEventListener('click', () => {
		photoLikes.textContent = (parseInt(photoLikes.textContent) + 1).toString();
	});

	photoLikesContainer.appendChild(likeIcon);
	photoLikesContainer.appendChild(photoLikes);

	const photoDetails = createElement('div', ['photo-details']);
	const photoTitle = createElement('h3', ['photo-title'], title);
	const photoPrice = createElement('p', ['photo-price'], `Price: $${price}`);
	photoDetails.appendChild(photoTitle);
	photoDetails.appendChild(photoPrice);

	const lightboxTrigger = createElement('span', ['lightbox-trigger'], 'View');

	photoItem.appendChild(photo);
	photoItem.appendChild(photoLikesContainer);
	photoItem.appendChild(photoDetails);
	photoItem.appendChild(lightboxTrigger);

	return photoItem;
};

const generateGallery = async (sortBy) => {
	try {
		const { photographers, media } = await getPhotographers();
		const photographerId = getIdFromURL();
		const photographer = photographers.find((p) => p.id === photographerId);
		if (!photographer) throw new Error(`No photographer found with ID ${photographerId}`);

		const mediaItems = media.filter(
			(item) => item.photographerId === photographerId && item.image
		);
		const sortMap = {
			popularity: (a, b) => b.likes - a.likes,
			title: (a, b) => a.title.localeCompare(b.title),
			date: (a, b) => new Date(a.date) - new Date(b.date),
			price: (a, b) => a.price - b.price,
		};
		if (sortMap[sortBy]) mediaItems.sort(sortMap[sortBy]);

		const galleryContainer = document.querySelector('.gallery-container');
		galleryContainer.innerHTML = '';
		mediaItems.forEach((item) =>
			galleryContainer.appendChild(
				createPhotoItem({ ...item, photographerName: photographer.name })
			)
		);
	} catch (error) {
		console.error('Error generating gallery:', error);
	}
};

const handleSort = async () => {
	const sortBy = document.getElementById('sort-by').value;
	await generateGallery(sortBy);
};

export { getIdFromURL, createPhotoItem, generateGallery, handleSort };
