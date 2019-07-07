(function(global) {
	'use strict';

	var doc = global.document;

	var isArray = global.isArray = function(a) {
		return toString.call(a) == '[object Array]' || toString.call(a) == '[object NodeList]';
	}

	var isInt = global.isInt = function(o) {
		return typeof o == 'number';
	}

	var isString = global.isString = function(o) {
		return typeof o == 'string';
	}

	var isObject = global.isObject = function(o) {
		return toString.call(o) === '[object Object]';
	}

	var isNull = global.isNull = function(o) {
		return o === null;
	}

	var isUndefined = global.isUndefined = function(o) {
		return typeof o == 'undefined';
	}

	var isFunc = global.isFunc = function(o) {
		return typeof o == 'function' && typeof o.nodeType != 'number';
	}

	var isWindow = global.isWindow = function(o) {
		return o !== null && o === o.window;
	}

	var isDOMVal = global.isDOMVal = function(o) {
		var regex = /^\[object HTML.+\]$/m;

		return regex.test(o.toString());
	}

	var Jali = function Jali() {
		return new Init(arguments);
	};

	Jali.prototype = Jali;
	Jali.prototype.constructor = Jali;

	//Returns the length of Jali.values.
	Jali.prototype.len = function len() {
		return this.values.length;
	};

	//Return an element at a specific index
	//Or return the entire Jali.values
	Jali.prototype.get = function get(n) {
		if (isUndefined(n)) {
			return this.len() > 1? this.values : this.values[0];
		}

		return n < 0? this.values[this.len() + n] : this.values[n];
	};

	//Merge two or more arrays with Jali.values.
	//Jali.values contains the new array.
	Jali.prototype.concat = function concat() {
		var args = Array.prototype.slice.call(arguments);
		this.current = null;

		if (args.length > 0) {
			this.values = this.values.concat.apply(this.values, args);
		}

		return this;
	};

	//Copies part Jali.values to another location in the same array
	//Jali.current and returns it.
	Jali.prototype.copyWithin = function copyWithin(target, start, end) {
		this.values.copyWithin(target, start, end);
		this.current = null;

		return this;
	};

	//Returns a key/value pair Array Iteration Object.
	//Jali.current contains the object.
	Jali.prototype.entries = function entries() {
		this.current = this.values.entries();

		return this;
	};

	//Checks if every element in Jali.values pass a test in a testing function.
	//Jali.current contains the result of the test
	Jali.prototype.every = function every(callback) {
		this.current = this.values.every(callback);

		return this.len() != 0? true : false;
	};

	//Calls a function once for each array element.
	Jali.prototype.each = function each(callback) {
		this.values.forEach(callback);
	};

	//Fill the elements in Jali.values with a static value.
	Jali.prototype.fill = function fill(value) {
		this.values.fill(value);

		return this;
	};

	//Creates a new array with all elements that pass the test in a testing
	//function. Jali.current contains the new array.
	Jali.prototype.filter = function filter(callback) {
		this.current = this.values.filter(callback);

		return this;
	};

	//Returns the value of the first element in Jali.values that pass the
	//test in a testing function. Jali.current contains that element.
	Jali.prototype.find = function find(callback) {
		this.current = this.values.find(callback);

		return this;
	};

	//Returns the index of the first element in Jali.values that pass the
	//test in a testing function. Jali.current contains that index
	Jali.prototype.findIndex = function findIndex(callback) {
		this.current = this.values.findIndex(callback);

		return this;
	};

	//Flattens Jali.values to single array of elements.
	//Jali.current contains the flattened array.
	Jali.prototype.flat = function flat() {
		this.current = this.values.flat();

		return this;
	};

	Jali.prototype.flatMap = function flatMap() {
		var args = Array.prototype.slice.call(arguments);
		this.current = this.values.flatMap.apply([], args);

		return this;
	};

	//Determines whether an array includes a certain element.
	//Jali.current contains the result
	Jali.prototype.includes = function includes(elem) {
		this.current = this.values.includes(elem);

		return this;
	};

	//Search Jali.values for an element and returns its first index.
	//Jali.current points to that index
	Jali.prototype.indexOf = function indexOf(elem) {
		this.current = this.values.indexOf(elem);

		return this;
	};

	//Determines whether the passed value is an array.
	Jali.prototype.isArray = function(index) {
		return isArray(this.get(index));
	};

	//Joins all elements of Jali.values into a string.
	//Jali.current contains that string.
	Jali.prototype.join = function join() {
		var vals = this.values;
		this.current = vals.join();

		return this;
	};

	//Returns an Array Iteration Object, containing the keys of Jali.values.
	//Jali.current contains the object
	Jali.prototype.keys = function keys() {
		this.current = this.values.keys();

		return this;
	};

	//Search Jali.values for an element, starting at the end,
	//Jali.curren points to its last index.
	Jali.prototype.lastIndexOf = function lastIndexOf(elem) {
		this.current = this.values.lastIndexOf(elem);

		return this;
	};

	//Creates a new array with the results of calling
	//a function for each Jali.values element. Jali.current contains
	//the new array.
	Jali.prototype.map = function map(callback) {
		this.current = this.values.map(callback);

		return this;
	};

	//Removes the last element from Jali.values,
	//Jali.current points to that element.
	Jali.prototype.pop = function pop() {
		if (this.len() > 0) {
			var i = this.len() - 1;
			this.current = this.values[i];
			this.remove(i);

			return this;
		}
	};

	//Adds one or more elements to the end of Jali.values,
	//Jali.current points to Jali.values' new length.
	Jali.prototype.push = function() {
		var args = Array.prototype.slice.call(arguments);
		this.values.push.apply(this.values, args); 
		this.current = this.len() - 1;

		return this;
	};

	//Reduce Jali.values to a single value (from left-to-right).
	Jali.prototype.reduce = function(callback, initialValue) {
		this.values.reduce(callback, initialValue);
		this.current = null;

		return this;
	};

	//Reduce Jali.values to a single value (from right-to-left).
	Jali.prototype.reduceRight = function(callback, initialValue) {
		this.values.reduceRight(callback, initialValue);
		this.current = null;

		return this;
	};

	//Removes an element from Jali.values at the specified index
	//Jali.current points to the removed element
	Jali.prototype.remove = function remove(index) {
		this.current = index < 0? this.values[this.len() + index] : this.values[index];
		this.values.splice(index, 1);

		return this;
	};

	//Reverses the order of the elements in Jali.values.
	Jali.prototype.reverse = function() {
		this.values.reverse();

		return this;
	};

	//Removes the first element from an array.
	//Jali.current points to that element.
	Jali.prototype.shift = function() {
		this.current = this.values[0];
		this.remove(0);

		return this;
	};

	//Selects a part of Jali.values. Jali.current contains the new array.
	Jali.prototype.slice = function(start, end) {
		this.current = this.values.slice(start, end);

		return this;
	};

	//Checks if any of the elements Jali.values
	//passes the test in a testing function. Jali.current points to the
	//result of the operation
	Jali.prototype.some = function(callback) {
		this.current = this.values.some(callback);

		return this;
	};

	//Sorts the elements of Jali.values
	Jali.prototype.sort = function() {
		this.values.sort();
		this.current = null;

		return this;
	};

	//Adds|Removes elements from Jali.values
	//Jali.values contains all the original values while
	//Jali.current contains the results of splicing Jali.values
	Jali.prototype.splice = function() {
		var args = Array.prototype.slice.call(arguments),
				vals = this.values;
		this.current = vals.splice.apply(vals, args);

		return this;
	};

	//Adds new elements to the beginning of Jali.values,
	//and Jali.current points to Jali.values new length.
	Jali.prototype.unshift = function() {
		var args = Array.prototype.slice.call(arguments);
		this.values.unshift.apply(this.values, args);
		this.current = this.len();

		return this;
	};

	//Returns an Array Iteration Object, containing the values of the original array.
	Jali.prototype.values = function() {
		this.current = this.values.values();

		return this;
	};

	//Copy the properties of source to target, and return target.
	//If target and source have a property by the same name,
	//target's property is overwritten.
	Jali.extend = function(target, source) {
		for(var prop in source) {
			target[prop] = source[prop];
		}

		return target;
	};

	//Copy the properties of source to target, and return o.
	//If target and source have a property by the same name,
	//target's property is used. Returns target.
	Jali.merge = function(target, source) {
		for(var prop in source) {
			if (Object.prototype.hasOwnProperty.call(target, prop)) {
				continue;
			}

			target[prop] = source[prop];
		}

		return target;
	};

	//Remove properties from target if there is not a property with
	//the same name in source. Returns target
	Jali.restrict = function(target, source) {
		for(var prop in target) {
			if (!(prop in source)) {
				delete target[prop];
			}
		}

		return target;
	};

	//For each property of source, delete a property with the same name
	//from target. Returns target
	Jali.subtract = function(target, source) {
		for(var prop in source) {
			delete target[prop];
		}

		return target;
	};

	//Return a new object holding properties of both target and source.
	//If target and source have properties by the same name, values from target are used.
	Jali.union = function(target, source) {
		return this.extend(source, this.extend({},target));
	};

	//Return a new object that holds only properties of target also appearing in source
	Jali.intersection = function(target, source) {
		return this.restrict(source, this.extend({}, target));
	};
	
	var Init = function Init() {
		this.values = [];
		this.current = null;

		var args = Array.prototype.slice.call(arguments[0]),
				len = args.length;

		if (len > 0) {
			for (var i = 0; i < len; i++) {
				if (isFunc(args[i])) {
					var f = args[i];

					if (i == len - 1) {
						this.push(f.call(this));
					} else {
						args.splice(0, i+1);
						this.push(f.apply(this, args));
					}

					break;
				}  else if (isString(args[i])) {
					var nodes = doc.querySelectorAll(':scope ' + args[i]);

					if (nodes.length > 0) {
						this.concat(Array.prototype.slice.call(nodes));
					}
				}  else if (isObject(args[i])) {
					var proto = Object.getPrototypeOf(args[i]);

					if (proto !== this.prototype) {
						this.extend(args[i]);
					}

					return args[i];
				} else {
					this.push(args[i]);
				}
			}
		}
	};

	Init.prototype = Jali.prototype;

	Jali.prototype.isInt = function(index) {
		return isInt(this.get(index));
	};

	Jali.prototype.isString = function(index) {
		return isString(this.get(index));
	};

	Jali.prototype.isObject = function(index) {
		return isObject(this.get(index));
	};

	Jali.prototype.isNull = function(index) {
		return isNull(this.get(index));
	};

	Jali.prototype.isUndefined = function(index) {
		return isUndefined(this.get(index));
	};

	Jali.prototype.isFunc = function(index) {
		return isFunc(this.get(index));
	};

	Jali.prototype.isWindow = function(index) {
		return isWindow(this.get(index));
	};

	Jali.prototype.isDOMVal = function(index) {
		return isDOMVal(this.get(index));
	}

	//Checks the name and version of browser Jali is executing in.
	var UA = navigator.userAgent.toLowerCase(),
		browMatch = /(webkit)[ /]([\w.]+)/.exec(UA) || 
		/(opera)(?:.*version)?[ /]([\d]+)/.exec(UA) || /(msie) ([\w.]+)/.exec(UA) || 
		!/compatible/.test(UA) && /(mozilla)(?:.*? rv:([\w.]+))?/.exec(UA) || [];

	Jali.browser = {
		name : browMatch[1] || '',
		version : browMatch[0] || 0
	};

	//Check if Jali script is executing in a mobile device.
	Jali.mobileDetect = function() {
		return  /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge|maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/g.test(UA) || 
		/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw-(n|u)|c55\/|capi|ccwa|cdm-|cell|chtm|cldc|cmd-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc-s|devi|dica|dmob|do(c|p)o|ds(12|-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(-|_)|g1 u|g560|gene|gf-5|g-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd-(m|p|t)|hei-|hi(pt|ta)|hp( i|ip)|hs-c|ht(c(-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i-(20|go|ma)|i230|iac( |-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|-[a-w])|libw|lynx|m1-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|-([1-8]|c))|phil|pire|pl(ay|uc)|pn-2|po(ck|rt|se)|prox|psio|pt-g|qa-a|qc(07|12|21|32|60|-[2-7]|i-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h-|oo|p-)|sdk\/|se(c(-|0|1)|47|mc|nd|ri)|sgh-|shar|sie(-|m)|sk-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h-|v-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl-|tdg-|tel(i|m)|tim-|t-mo|to(pl|sh)|ts(70|m-|m3|m5)|tx\\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\\-|your|zeto|zte\\-/g.test(UA);
	};

	//Queries DOM elements withing the context(DOM objects) in which they are called
	Jali.$ = function(selector) {
		if (isString(selector) && selector.length != 0) {
			var nodes = [];

			if (this.constructor == Jali) {
				if (this.len() > 0) {
					var context = this.filter(function(nd){
						return isDOMVal(nd);
					}).current;

					context.forEach(function(ctx) { 
						nodes = nodes.concat(Array.prototype.slice.call(ctx.querySelectorAll(':scope ' + selector)));
					});

					this.values = nodes;
				} else {
					nodes = doc.querySelectorAll(':scope ' + selector);

					if (nodes.length > 0) {
						this.concat(Array.prototype.slice.call(nodes));
					}
				}

				return this;
			} else if (isDOMVal(this)) {
				nodes = this.querySelectorAll(':scope ' + selector);

				if (nodes.length > 0) {
					var ji = (new Init([])).concat(Array.prototype.slice.call(nodes));
					
					return ji;
				}
			}
		}
	};

	/*
	//Jali event handlers
	Jali.prototype.click = function click(callback) {
		if (this.len() > 0) {
			var context = this.filter(function(nd){
				return isDOMVal(nd);
			}).current;

			context.forEach(function(ctx) { 
				ctx.addEventListener('click', callback.call(this));
			});
		}
	}
	*/
	
	//Adds the query selectoring function '$' to Node's prototype
	Jali.extend(Node.prototype, {
		$ : Jali.$
	});

	//Export the Jali object to the global namespace
	global.Jali = global.$ = Jali;

	return Jali;
})(window !== undefined? window : this);
