(function(global){

	"use strict";

	var version = "1.0";
	var doc = global.document;
	var toString = Object.prototype.toString;

	function Jalili(selector) {
		return init(selector);
	}

	Jalili.prototype = {
		version : version,

		constructor : Jalili,

		length : 0,
	}

	function init(selector) {
		function F(){}
		F.prototype = Jalili;
		var jalili = new F();

		if (!isUndefined(selector) || !isNull(selector)) {
			if (isString(selector)) {
				var nodes =  doc.querySelectorAll(selector);

				if (!empty(nodes)) {
					jalili[0] = nodes.length == 1? nodes[0] : nodes;

					return jalili[0];
				}
			} else if (isFunction(selector)) {
				selector();
			} else if (isArray(selector) || isObject(selector)) {
				jalili[0] = selector;
			}
		}

		return jalili;
	}

	//Copy the properties of p to o, and return o.
	//If o and p have a property by the same name, o's property is overwritten.
	Jalili.extend = function(p, o) {
		o = o || this;

		for(var prop in p) {
			o[prop] = p[prop];
		}

		return o;
	}

	Jalili.extend({
		isArray : function(a) {
	  	return toString.call(a) === '[object Array]' || toString.call(a) === '[object NodeList]';
		},

		isInt : function(o) {
			return typeof o === 'number';
		},

		isString : function(o) {
			return typeof o === 'string';
		},

		isObject : function(o) {
			return toString.call(o) === '[object Object]';
		},

		isNull : function(o) {
			return o === null;
		},

		isUndefined : function(o) {
			return typeof o === 'undefined';
		},

		isFunction : function(o) {
			return typeof o === 'function' && !isInt(o.nodeType);
		},

		isWindow : function(o) {
			return !isNull(o) && o === o.global;
		},

		empty : function(o) {
			return o.length == 0;
		},

		each : function(arr, c) {
			Array.prototype.forEach.call(this, c);
		}
	}, global);

	Jalili.extend({
		//Copy the properties of p to o, and return o.
		//If o and p have a property by the same name, o's property is used.
		merge : function(p, o) {
			o = o || this;
			
			for(var prop in p) {
				if (o.hasOwnProperty[prop]) {
					continue;
				}

				o[prop] = p[prop];
			}

			return o;
		},

		//Remove properties from o if there is not a property with the same name in p.
		restrict : function(o, p) {
			for(var prop in o) {
				if (!(prop in p)) {
					delete o[prop];
				}
			}

			return o;
		},

		//For each property of p, delete a property with the same name from o.
		subtract : function(o, p) {
			for(var prop in p) {
				delete o[prop];
			}

			return o;
		},

		//Return a new object holding properties of both o and p.
		//If o and p have properties by the same name, values from o are used.
		union : function(p, o) {
			o = o || this;

			return this.extend(this.extend({},o), p);
		},

		//Return a new object that holds only properties of o also appearing in p
		intersection : function(p, o) {
			o = o || this;

			return this.restrict(this.extend({}, o), p);
		},

		//Return an array containing names of own properties of o
		keys : function(o) {
			if (!isObject(o)) {
				throw TypeError();
			}

			var result = [];

			for (var prop in o) {
				if (o.hasOwnProperty(prop)) {
					result.push(prop);
				}
			}

			return result;
		}
	});

	Jalili.extend({
		pop : function() {
			if (isArray(this[0])) {
				return this[0].pop();
			}
		},

		push : function(x) {
			if (isArray(this[0])) {
				return this[0].push(x);
			}
		},

		join : function() {
			if (isArray(this[0])) {
				return this[0].join();
			}
		},

		shift : function() {
			if (isArray(this[0])) {
				return this[0].shift();
			}
		},

		unshift : function(x) {
			if (isArray(this[0])) {
				return this[0].unshift(x);
			}
		},

		replace : function(i, x) {
			if (isArray(this[0])) {
				var l = this[0].length;

				if (Math.abs(i) >= l) {
					throw "Index out of bounds.";
				}

				if (i < 0) {
					i = l+i;
				}

				return this[0][i] = x;
			}
		},

		splice : function(i, n) {
			if (isArray(this[0])) {
				var l = this[0].length;

				if (Math.abs(i) >= l) {
					throw "Index out of bounds.";
				}

				return this[0].splice(i, Math.abs(n));
			}
		},

		delete : function(i) {
			return this.splice(i, 1);
		},

		concat : function() {
			if (!empty(arguments)) {
				var arr = isArray(this[0])? this[0] : [];

				for (var i = 0; i < arguments.length; i++) {
					if (isArray(arguments[i])) {
						arr = arr.concat(arguments[i]);
					}
				}

				return arr;
			}
		}
	});

	//freeze objects to make its properties non-configurable
	Jalili.freeze = function(o) {
		if (isObject(o)) {
			Object.freeze(o);
		}
	}

	//inherit jalili object
	Jalili.inherit = function() {
		if (Object.create) {
			return Object.create(this);
		}

		function F(){}
		F.prototype = this;

		return new F();
	}
	
	Object.freeze(Jalili);

	global.$ = global.Jalili = Jalili;
	Node.prototype.$ = $;

	return Jalili;
})(undefined !== window? window : this);
