function photographerFactory(data) {
	const { name, id, city, tagline, price, portrait } = data;
	const picture = `assets/photographers/${portrait}`;

	function getUserCardDOM() {
		const article = document.createElement('article');
		const img = document.createElement('img');
		img.setAttribute('src', picture);

		const h2 = document.createElement('h2');
		h2.textContent = name;

		const pCity = document.createElement('p');
		pCity.textContent = city;

		const pTagline = document.createElement('p');
		pTagline.textContent = tagline;

		const pPrice = document.createElement('p');
		pPrice.textContent = `$${price}/hour`;

		const a = document.createElement('a');
		a.href = `photographer.html?id=${id}`;
		a.appendChild(img);
		a.appendChild(h2);
		a.appendChild(pCity);
		a.appendChild(pTagline);
		a.appendChild(pPrice);

		article.appendChild(a);

		return article;
	}

	return { name, picture, getUserCardDOM, id };
}

export { photographerFactory };
