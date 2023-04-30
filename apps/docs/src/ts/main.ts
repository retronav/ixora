import 'uno.css';
document
	.querySelector('nav button.toggle-links')
	?.addEventListener('click', () => {
		const links = document.querySelector('ul.links') as HTMLUListElement;
		if (links)
			if (links.style.display) links.style.removeProperty('display');
			else links.style.display = 'flex';
	});
