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

const createProfileItem = ({ name, city, tagline, portrait }) => {
	const galleryItem = createElement('div', ['gallery-item']);
	const elements = [
		createElement('img', ['item-portrait'], null, `assets/photographers/${portrait}`),
		createElement('h3', ['item-title'], name),
		createElement('p', ['item-city'], city),
		createElement('p', ['item-tagline'], tagline),
	];

	elements.forEach((el) => galleryItem.appendChild(el));
	return galleryItem;
};

const createMediaItem = ({
	title,
	likes,
	price,
	image,
	video,
	name,
	photographerName,
}) => {
	const photoItem = createElement('div', ['photo-item']);

	let media;
	if (image) {
		const mediaSource = `assets/photographers/${photographerName}/${image}`;
		media = createElement('img', ['photo'], null, mediaSource);
		media.setAttribute('alt', name);
	} else if (video) {
		media = document.createElement('video');
		media.classList.add('photo');
		media.setAttribute('controls', '');

		const source = document.createElement('source');
		source.setAttribute('src', `assets/photographers/${photographerName}/${video}`);
		source.setAttribute('type', 'video/mp4');

		media.appendChild(source);
		media.addEventListener('error', (e) => {
			console.error('Video error:', e);
		});
	}

	const like = createElement('p', ['photo-likes'], likes.toString());
	const likeIcon = createElement('span', ['like-icon'], '♥');
	likeIcon.addEventListener('click', () => {
		like.textContent = (parseInt(like.textContent) + 1).toString();
	});

	const elements = [
		media,
		createElement('h3', ['photo-title'], title),
		like,
		likeIcon,
		createElement('p', ['photo-price'], price),
		createElement('span', ['lightbox-trigger'], 'View'),
	];

	elements.forEach((el) => photoItem.appendChild(el));
	return photoItem;
};

const generateGallery = async (sortBy) => {
	try {
		const { photographers, media } = await getPhotographers();
		const photographerId = getIdFromURL();
		const photographer = photographers.find((p) => p.id === photographerId);
		if (!photographer) throw new Error(`No photographer found with ID ${photographerId}`);

		const mediaItems = media.filter(
			(item) => item.photographerId === photographerId && (item.image || item.video)
		);
		const sortMap = {
			popularity: (a, b) => b.likes - a.likes,
			title: (a, b) => a.title.localeCompare(b.title),
			date: (a, b) => new Date(a.date) - new Date(b.date),
			price: (a, b) => a.price - b.price,
		};
		if (sortMap[sortBy]) mediaItems.sort(sortMap[sortBy]);

		const galleryItems = [
			createProfileItem(photographer),
			...mediaItems.map((item) =>
				createMediaItem({ ...item, photographerName: photographer.name })
			),
		];

		const galleryContainer = createElement('div', ['gallery']);
		galleryItems.forEach((item) => galleryContainer.appendChild(item));
		return galleryContainer;
	} catch (error) {
		console.error('Error generating gallery:', error);
	}
};

const handleSort = async () => {
	const sortBy = document.getElementById('sort-by').value;
	const gallery = await generateGallery(sortBy);
	const galleryContainer = document.querySelector('.gallery-container');
	galleryContainer.innerHTML = '';
	galleryContainer.appendChild(gallery);
};

export { getIdFromURL, createProfileItem, createMediaItem, generateGallery, handleSort };
