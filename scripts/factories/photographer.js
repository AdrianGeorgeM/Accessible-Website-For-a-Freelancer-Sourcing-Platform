function photographerFactory(data) {
	const { name, id, city, tagline, price, portrait } = data;
	const picture = `assets/photographers/${portrait}`;

	function getUserCardDOM() {
		const article = document.createElement('article');
		article.classList.add('gallery-item');

		const a = document.createElement('a');
		a.href = `photographer.html?id=${id}`;
		a.classList.add('item-link');

		const img = document.createElement('img');
		img.src = picture;
		img.classList.add('item-portrait', 'loading');
		img.addEventListener('load', () => img.classList.add('loaded'));

		const h2 = document.createElement('h2');
		h2.classList.add('item-title');
		h2.innerText = name;

		const pCity = document.createElement('p');
		pCity.classList.add('item-city');
		pCity.innerText = city;

		const pTagline = document.createElement('p');
		pTagline.classList.add('item-tagline');
		pTagline.innerText = tagline;

		const pPrice = document.createElement('p');
		pPrice.classList.add('photo-price');
		pPrice.innerText = `$${price}/hour`;

		a.append(img, h2, pCity, pTagline, pPrice);
		article.appendChild(a);

		return article;
	}

	return { name, picture, getUserCardDOM, id };
}

export { photographerFactory };
