const sidebar = document.querySelector(
	'main aside  details.sidebar-details'
) as HTMLDetailsElement;

const sidebarCloseQuery =
	getComputedStyle(sidebar).getPropertyValue('--force-close');

const mediaQuery = window.matchMedia(sidebarCloseQuery);
sidebar.open = !mediaQuery.matches;
mediaQuery.addEventListener('change', (e) => {
	sidebar.open = !e.matches;
});
