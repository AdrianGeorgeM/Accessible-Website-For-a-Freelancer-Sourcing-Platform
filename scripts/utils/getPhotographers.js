async function getPhotographers() {
	const response = await fetch('data/photographers.json');
	const data = await response.json();
	return data.photographers;
}

export { getPhotographers };
