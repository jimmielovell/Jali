(function(window){

	"use strict";

	var Jalili = function(selector) {
		return new Jalili._proto_.boot(selector);
	}

	//Define properties and methods for internal use only
	Jalili._proto_ = Jalili.prototype = {
		constructor : Jalili,

		boot : function(selector) {
			return Jalili;
		}
	}

	//Copy the properties of p to o, and return o.
	//If o and p have a property by the same name, o's property is overwritten.
	Jalili.extend = function(o, p) {
		for(var prop in p) {
			o[prop] = p[prop];
		}

		return o;
	}

	//Copy the properties of p to o, and return o.
	//If o and p have a property by the same name, o's property is used.
	Jalili.merge = function(o, p) {
		for(var prop in p) {
			if (o.hasOwnProperty[prop]) {
				continue;
			}

			o[prop] = p[prop];
		}

		return o;
	}

	//Remove properties from o if there is not a property with the same name in p.
	Jalili.restrict = function(o, p) {
		for(var prop in o) {
			if (!(prop in p)) {
				delete o[prop];
			}
		}

		return o;
	}

	//For each property of p, delete a property with the same name from o.
	Jalili.subtract = function(o, p) {
		for(var prop in p) {
			delete o[prop];
		}

		return o;
	}

	//Return a new object holding properties of both o and p.
	//If o and p have properties by the same name, values from o are used.
	Jalili.union = function(o, p) {
		return this.extend(this.extend({},o), p);
	}

	//Return a new object that holds only properties of o also appearing in p
	Jalili.intersection = function(o, p) {
		return this.restrict(this.extend({}, o), p);
	}

	//Return an array containing names of own properties of o
	Jalili.keys = function(o) {
		if (typeof o !== "object") {
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
	
	window.$ = window.Jalili = Jalili;

	return Jalili;
})(window);
