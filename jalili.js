(function(global){

	"use strict";

	var version = "1.0";
	var doc = global.document;
	var toString = Object.prototype.toString;

	function Jalili(selector) {
		return init();
	}

	Jalili.prototype = {
		version : version,

		constructor : Jalili,

		length : 0,
	}

	function init() {
		function f(){}
		f.prototype = Jalili;

		return new f();
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
		}
	}, global);

	Jalili.extend({
		//Copy the properties of p to o, and return o.
		//If o and p have a property by the same name, o's property is used.
		merge : function(o, p) {
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
		union : function(o, p) {
			return this.extend(this.extend({},o), p);
		},

		//Return a new object that holds only properties of o also appearing in p
		intersection : function(o, p) {
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

		function f(){}
		f.prototype = this;

		return new f();
	}
	
	Object.freeze(Jalili);

	global.$ = global.Jalili = Jalili;

	return Jalili;
	
})(window);
