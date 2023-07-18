function photographerFactory(data) {
	const { name, id, portrait } = data;
	const picture = `assets/photographers/${portrait}`;
	function getUserCardDOM() {
		const article = document.createElement('article');
		const img = document.createElement('img');
		img.setAttribute('src', picture);
		const h2 = document.createElement('h2');
		h2.textContent = name;
		// Add a link to the photographer's page
		const a = document.createElement('a');
		a.href = `photographer.html?id=${id}`;
		a.appendChild(img);
		a.appendChild(h2);
		article.appendChild(a);
		return article;
	}
	return { name, picture, getUserCardDOM };
}
