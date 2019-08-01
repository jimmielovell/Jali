require('./jalimock.js');
const $ = require('./../lib/jali');

test('Querying DOM element by tagname', () => {
	expect($('h1').getAll()).toEqual([...document.getElementsByTagName('h1')]);
});

test('Querying DOM element by id', () => {
	expect($('#test-1').get()).toEqual(document.getElementById('test-1'));
});

test('Querying DOM element by classname', () => {
	expect($('.bold').getAll()).toEqual([...document.getElementsByClassName('bold')]);
});

test('Querying multiple DOM elements', () => {
	expect($('h1','p').get()).toEqual([...document.querySelectorAll('h1'), ...document.querySelectorAll('p')]);
});

test('Querying DOM element by scoping', () => {
	expect($('div').$('p').get()).toEqual((() => {
		let prnts = [...document.querySelectorAll('div')];
		let childs = [];

		prnts.forEach((prnt) => {
			childs.push(...[...prnt.querySelectorAll('p')]);
		});

		return childs;
	})());

	expect($('div > p').get()).toEqual([...document.querySelectorAll('div > p')]);

	expect($('div p').get()).toEqual([...document.querySelectorAll('div p')]);
});

test('Getting an element from a NodeList at a specific index', () => {
	expect($('h2').get(-2)).not.toEqual(document.querySelectorAll('h2')[-2]);
	expect($('h2').get(-2)).toEqual((() => {
		let hds = document.querySelectorAll('h2')
		return hds[hds.length - 2];
	})());
	expect($('h2').get(-1)).not.toEqual(document.querySelectorAll('h2')[-1]);
	expect($('h2').get(-1)).toEqual((() => {
		let hds = document.querySelectorAll('h2')
		return hds[hds.length - 1];
	})());
	expect($('h2').get(0)).toEqual(document.querySelectorAll('h2')[0]);
	expect($('h2').get(1)).toEqual(document.querySelectorAll('h2')[1]);
	//An out of bounds element
	expect($('h2').get(2)).toEqual(document.querySelectorAll('h2')[2]);
});

test('Getting the id attribute of multiple DOM elements', () => {
	expect($('div').id()).toEqual((() => {
		let elems = [...document.querySelectorAll('div')];
		let ids = [];

		elems.forEach((elem) => {
			ids.push(elem.id);
		});

		return ids;
	})());
});

test('Getting the id attribute of a single DOM element', () => {
	expect($('div.active').id()).toEqual('test-2');
	//An element with no id
	expect($('h1').id()).toBeNull();
});

test('Setting the id attribute of a DOM element', () => {
	$('h2').id('h2-test');
	expect($('h2').get()).toEqual([...document.querySelectorAll('#h2-test')]);
});

test('Getting the class attribute of multiple DOM elements', () => {
	expect($('h1', 'h2').class()).toEqual((() => {
		let elems = [...document.querySelectorAll('h1'), ...document.querySelectorAll('h2')];
		let classes = [];

		elems.forEach((elem) => {
			classes.push(elem.getAttribute('class'));
		});

		return classes;
	})());
});

test('Getting the class attribute of a single DOM element', () => {
	expect($('div#test-2').class()).toEqual(document.querySelector('div#test-2').getAttribute('class'));
	//An element with no class
	expect($('div#test-2 p').class()).toEqual(document.querySelector('div#test-2 p').getAttribute('class'));
});

test('Setting the class attribute of a DOM element', () => {
	$('p').class('paragraph');
	expect($('p.paragraph').get()).toEqual([...document.querySelectorAll('p.paragraph')]);
});

test('Getting length of legth of queried DOM list', () => {
	expect($('div').len()).toBe(document.querySelectorAll('div').length);
});

test('Querying the parent element of a node', () => {
	expect($('span.bold').parent()).toEqual(document.querySelector('span.bold').parentNode);
});

test('Querying the next element sibling of a node', () => {
	expect($('div#test-1').next()).toEqual(document.querySelector('div#test-1').nextElementSibling);
});

test('Querying the previous element sibling of a node', () => {
	expect($('div#test-2').prev()).toEqual(document.querySelector('div#test-2').previousElementSibling);
});

test('Querying the first child of a node', () => {
	expect($('div#test-2').first()).toEqual(document.querySelector('div#test-2').firstChild);
});

test('Querying the last child of a node', () => {
	expect($('div#test-2').last()).toEqual(document.querySelector('div#test-2').lastChild);
});

test('Getting the text content of an element', () => {
	expect($('div#test-1 h2').last()).toEqual('Test 1');
});

test('Setting the text content of an element', () => {
	$('p.empty').text('I was an empty text')
	expect($('p.empty').text()).toEqual('I was an empty text');
});
