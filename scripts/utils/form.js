function handleContactFormSubmit(event) {
	event.preventDefault();
	const name = document.getElementById('contact-name').value;
	const email = document.getElementById('contact-email').value;
	const message = document.getElementById('contact-message').value;

	console.log('Name:', name);
	console.log('Email:', email);
	console.log('Message:', message);
}

function showContactForm() {
	const contactModal = document.getElementById('contact-modal');
	contactModal.style.display = 'block';
}

function hideContactForm() {
	const contactModal = document.getElementById('contact-modal');
	contactModal.style.display = 'none';
}

export { handleContactFormSubmit, showContactForm, hideContactForm };
