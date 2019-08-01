{
	'use strict';

	let glob = (window !== undefined)? window : this;
	let doc = glob.document;
	let toString = Object.prototype.toString;

	let isArray = function(a) {
		return toString.call(a) == '[object Array]' || toString.call(a) == '[object NodeList]';
	};

	let isString = function(o) {
		return typeof o == 'string';
	};

	let isDOMVal = function(o) {
		return o instanceof Element;
	};

	class Jali {
		constructor() {
			const set = WeakMap.prototype.set;

			this._values = set.call(new WeakMap(), this, []);
			this._length = set.call(new WeakMap(), this, 0);
		}

		init(...selector) {
			let ctx = doc;

			if (this._length.get(this) > 0) {
				ctx = this._values.get(this);
			}

			selector.forEach((s) => {
				if (isDOMVal(s) || s instanceof HTMLDocument) {
					this._values.get(this).push(s);
				} else if (isString(s)) {
					if (s == 'body') {
						this._values.get(this).push(doc.body);
					} else if (s == 'doc') {
						this._values.get(this).push(doc);
					} else {
						let res = [];

						if (isArray(ctx)) {
							ctx.forEach((c) => {
								res.push(...[...c.querySelectorAll(`${s}`)]);
							});
						} else {
							res = [...ctx.querySelectorAll(`${s}`)];
						}

						if (selector.length > 1) {
							this._values.get(this).push(...res);
							this._length.set(this, this._length.get(this) + res.length);
						} else {
							this._values.set(this, res);
							this._length.set(this, res.length);
						}
					}
				} else {
					throw TypeError(`Undefined value ${s}`);
				}
			});
		}

		$(...selector) {
			this.init(...selector);

			return this;
		}

		len() {
			return this._length.get(this);
		}

		get(n) {
			let values = this._values.get(this);

			if (n === undefined) {
				return this.len() > 1? values : values[0];
			}
			
			return n < 0? values[this.len() + n] : values[n];
		}

		getAll() {
			return this._values.get(this);
		}

		id(id) {
			if (id === undefined) {
				let ids = [];

				this.each(function(elem) {
					if (elem === null || elem === undefined) {
						throw TypeError(`Cannot read property 'id' of null`);
					}

					ids.push(elem.id);
				});
				
				return ids.length > 0? ids.length > 1? ids : ids[0] : null;
			} else {
				this.each((elem) => {
					elem.setAttribute('id', id);
				});
			}
		}

		class(c) {
			if (c === undefined) {
				let classes = [];
				
				this.each(function(elem) {
					if (elem === null || elem === undefined) {
						throw TypeError(`Cannot read property 'class' of null`);
					}

					classes.push(elem.getAttribute('class'));
				});
				
				return classes.length > 0? classes.length > 1? classes : classes[0] :null;
			} else {
				this.each((elem) => {
					elem.setAttribute('class', c);
				});
			}
		}

		nodeProp(prop) {//For internal use only
			let nodes = [];

			this.each((val) => {
				nodes.push(val[prop]);
			});

			return nodes.length > 0? nodes.length > 1? nodes : nodes[0] : null;
		}

		parent() {
			return this.nodeProp('parentNode');
		}

		next() {
			return this.nodeProp('nextElementSibling');
		}

		prev() {
			return this.nodeProp('previousElementSibling');
		}

		first() {
			return this.nodeProp('firstChild');
		}

		last() {
			return this.nodeProp('lastChild');
		}

		text(...txt) {
			if (txt.length == 0) {
				let txts = [];
				
				this.each((elem) => {
					txts.push(elem.textContent);
				});
				
				return txts.length > 0? txts.length > 1? txts : txts[0] : null;
			} else {
				if (this.len() == txt.length || this.len() > txt.length) {
					for (let i = 0; i < txt.length; i++) {
						this._values.get(this)[i].textContent = txt[i];
					}
				} else if (this.len() < txt.length) {
					for (let i = 0; i < this.len(); i++) {
						this._values.get(this)[i].textContent = txt[i];
					}
				}
			}
		}

		create(node) {
			this.node = doc.createElement(node);;

			return this;
		}

		append(node) {
			if (node === undefined && this.node === undefined) {
				throw TypeError(`Failed to execute 'append' on 'Jali': 1 argument required, but only 0 present.`);
			} else {
				const n = node === undefined? this.node : node;

				this.each((elem) => {
					elem.appendChild(n);
				});
			}
		}

		remove(child) {
			let oldChilds = [];

			this.each((elem) => {
				oldChilds.push(elem.removeChild(child));
			});

			return oldChilds.length > 1? oldChilds : oldChilds[0];
		}

		replace(nChild, oChild) {
			let repChilds = [];

			this.each((elem) => {
				repChilds.push(elem.replaceChild(nChild, oChild));
			});

			return repChilds.length > 1? repChilds : repChilds[0];
		}

		has(child) {
			if (child !== undefined) {
				this.each((elem) => {
					if (!elem.contains(child)) {
						return false;
					}
				});

				return true;
			} else {
				return this._values.get(this)[0].hasChildNodes();
			}
		}

		equals(node) {
			return this._values.get(this)[0].isEqualNode(node);
		}

		normalize() {
			this.each((elem) => {
				elem.normalize();
			});
		}

		clone(deep) {
			let clones = [];

			this.each((elem) => {
				clones.push(elem.clone(deep));
			});

			return clones.length > 1? clones : clones[0];
		}

		//Checks if every element in Jali values pass a test in a testing callback.
		every(callback) {
			return this._values.get(this).every(callback);
		}

		//Calls a callback once for each Jali values element.
		each(callback) {
			this._values.get(this).forEach(callback);
		}

		//Creates a new array with all elements that pass the test in a testing
		//callback
		filter(callback) {
			return this._values.get(this).filter(callback);
		}

		//Returns the value of the first element in Jali values that pass the
		//test in a testing callback
		find(callback) {
			return this._values.get(this).find(callback);
		}

		//Returns the index of the first element in Jali values that pass the
		//test in a testing callback.
		findIndex(callback) {
			return this._values.get(this).findIndex(callback);
		}

		//Determines Jali values includes a certain element.
		includes(elem) {
			return this._values.get(this).includes(elem);
		}

		//Search Jali values for an element and returns its first index.
		indexOf(elem) {
			return this._values.get(this).indexOf(elem);
		}

		//Joins all elements of Jali values into a string.
		join() {
			return this._values.get(this).join();
		}

		//Search Jali values for an element, starting at the end
		lastIndexOf(elem) {
			return this._values.get(this).lastIndexOf(elem);
		}

		//Creates a new array with the results of calling
		//a callback for each Jali values element
		map(callback) {
			return this._values.get(this).map(callback);
		}

		//Removes the last element from Jali values
		pop() {
			let elem = this._values.get(this).pop();
			this._length.set(this, this._values.get(this).length);

			return elem;
		}

		//Adds one or more elements to the end of Jali values
		push(...elems) {
			elems.foreach((elem) => {
				this._values.get(this).push(elem);
			});

			this._length.set(this, this._values.get(this).length);

			return this.len();
		}

		//Removes an element from Jali values at the specified index
		delete(index) {
			let elem =  this._values.get(this).splice(index, 1);
			this._length.set(this, this._values.get(this).length);

			return elem;
		}

		//Reverses the order of the elements in Jali values.
		reverse() {
			return this._values.get(this).reverse();
		}

		//Removes the first element from an array.
		shift() {
			let elem = this._values.get(this).shift();

			return elem;
		}

		//Selects a part of Jali values.
		slice(start, end) {
			return this._values.get(this).slice(start, end);
		}

		//Checks if any of the elements Jali values passes the test in a testing callback.
		some(callback) {
			this.current = this._values.get(this).some(callback);

			return this;
		}

		//Adds|Removes elements from Jali
		splice(...args) {
			let elem = Array.prototype.splice.apply(null, this._values.get(this), args);
			this._length.set(this, this._values.get(this).length);

			return elem;
		}
	}

	const jali = function(...selector) {
		const _jali = new Jali();
		_jali.init(...selector);

		return _jali;
	}

	jali.id = function(id) {
		return document.getElementById(id);
	}

	jali.class = function(c) {
		return document.querySelectorAll(c);
	}

	//Checks the name and version of browser Jali is executing in.
	const UA = navigator.userAgent.toLowerCase(),
		browMatch = /(webkit)[ /]([\w.]+)/.exec(UA) || 
		/(opera)(?:.*version)?[ /]([\d]+)/.exec(UA) || /(msie) ([\w.]+)/.exec(UA) || 
		!/compatible/.test(UA) && /(mozilla)(?:.*? rv:([\w.]+))?/.exec(UA) || [];

	jali.browser = {
		name : browMatch[1] || '',
		version : browMatch[0] || 0
	};

	//Check if Jali script is executing in a mobile device.
	jali.mobileDetect = function() {
		return  /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge|maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/g.test(UA) || 
		/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw-(n|u)|c55\/|capi|ccwa|cdm-|cell|chtm|cldc|cmd-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc-s|devi|dica|dmob|do(c|p)o|ds(12|-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(-|_)|g1 u|g560|gene|gf-5|g-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd-(m|p|t)|hei-|hi(pt|ta)|hp( i|ip)|hs-c|ht(c(-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i-(20|go|ma)|i230|iac( |-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|-[a-w])|libw|lynx|m1-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|-([1-8]|c))|phil|pire|pl(ay|uc)|pn-2|po(ck|rt|se)|prox|psio|pt-g|qa-a|qc(07|12|21|32|60|-[2-7]|i-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h-|oo|p-)|sdk\/|se(c(-|0|1)|47|mc|nd|ri)|sgh-|shar|sie(-|m)|sk-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h-|v-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl-|tdg-|tel(i|m)|tim-|t-mo|to(pl|sh)|ts(70|m-|m3|m5)|tx\\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\\-|your|zeto|zte\\-/g.test(UA);
	};


	window.$ = window.jali = jali;
}

if (typeof module === "object" && typeof module.exports === "object") {
	module.exports = jali;
}
