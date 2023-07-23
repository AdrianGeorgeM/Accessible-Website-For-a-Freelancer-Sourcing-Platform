function validateEmail(email) {
	var re =
		/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(email);
}

function handleContactFormSubmit(event) {
	event.preventDefault();
	const name = document.getElementById('contact-name').value;
	const email = document.getElementById('contact-email').value;
	const message = document.getElementById('contact-message').value;
	if (!validateEmail(email)) {
		alert('Please enter a valid email.');
		return;
	}

	console.log('Name:', name);
	console.log('Email:', email);
	console.log('Message:', message);
}

function showContactForm() {
	const contactModal = document.getElementById('contact-modal');
	const contactButton = document.getElementById('contact-button');
	const photographerNameElement = document.getElementById('photographer-name');
	const contactModalHeader = document.getElementById('contact-modal-photographer-name');

	contactButton.innerText = `Contact ${photographerNameElement.textContent}`;
	contactModalHeader.textContent = `Contact ${photographerNameElement.textContent}`;

	contactModal.style.display = 'flex';
}

function hideContactForm() {
	const contactModal = document.getElementById('contact-modal');
	contactModal.style.display = 'none';
}

export { handleContactFormSubmit, showContactForm, hideContactForm };
