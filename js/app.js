/**
 * Define Global Variables
 * 
*/
let sections = document.querySelectorAll('section');
let ul = document.querySelector('ul');
let currentActive;

// this veriable is used to prevent irregular update of nav bar
// during on scroll event update and navbar click update
let debounce = false;

/**
 * End Global Variables
 * Start Helper Functions
 * 
*/
const makeListItem = (id, label) => {
	const li = document.createElement('li');
	li.innerHTML = `<a href="#${id}">${label}</a>`;
	return li;
};

const anchorHandler = (e) => {
	e.preventDefault();

	// get the element hash and remove the #
	const id = e.target.hash.slice(1);

	// invoke the makeScrolling() function
	makeScrolling(id);

	// remove the active class from the previous active section
	document.getElementById(currentActive).classList.remove('active');

	// add the active class to the current section
	document.getElementById(id).classList.add('active');

	// remove the existing active class on the link
	document
		.querySelector(`a[href='#${currentActive}']`)
		.classList.remove('active');

	// set a new active class to the current link
	document.querySelector(`a[href='#${id}']`).classList.add('active');
	currentActive = id;
};

const makeScrolling = (targetID) => {
	// util to get the position of an element from the top and roud it
	const distanceToTop = (el) => Math.floor(el.getBoundingClientRect().top);

	// get the target element
	const targetAnchor = document.getElementById(targetID);
	if (!targetAnchor) return;

	// use the distaceToTop util to get the distance of this element from the top
	const originalTop = distanceToTop(targetAnchor);

	// use the scrollby window method to scroll to the given top
	window.scrollBy({ top: originalTop, left: 0, behavior: 'smooth' });
	// prevent scroll event check
	debounce = true;

	// enable scrool after 1 seconds
	setTimeout(() => {
		debounce = false;
	}, 1000);
};

// util to check element in the viewport
const isInViewPort = (element) => {
	const bounding = element.getBoundingClientRect();
	return (
		bounding.top >= 0 &&
		bounding.left >= 0 &&
		bounding.bottom <=
			(window.innerHeight || document.documentElement.clientHeight) &&
		bounding.right <=
			(window.innerWidth || document.documentElement.clientWidth)
	);
};

// build the nav
sections.forEach((node, index) => {
	const id = node.getAttribute('id');
	const label = node.getAttribute('data-nav');
	const newListItem = makeListItem(id, label);
	if (index === 0) {
		currentActive = id;
	}
	// append the created li to the ul element
	ul.appendChild(newListItem);
});

// Add class 'active' to section when near top of viewport
const links = document.querySelectorAll('a[href^="#"]');
links.forEach((link, index) => {
	// add active class to the first link
	if (index === 0) {
		link.classList.add('active');
	}
	link.addEventListener('click', anchorHandler);
});

// handler function to update the navbar on scroll
const updateNav = () => {
	sections.forEach((section) => {
		const inViewPort = isInViewPort(section);
		if (inViewPort) {
			const id = section.getAttribute('id');
			// remove initial active nav
			document
				.querySelector(`a[href='#${currentActive}']`)
				.classList.remove('active');

			// add new active nav
			document.querySelector(`a[href='#${id}']`).classList.add('active');
			// udate current active
			currentActive = id;
		}
	});
};

// window event listener for scroll event
let ticking = false;
window.addEventListener('scroll', () => {
	if (!ticking && !debounce) {
		window.requestAnimationFrame(() => {
			updateNav();
			ticking = false;
		});
		ticking = true;
	}
});
