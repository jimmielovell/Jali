(function(glob){

	"use strict";

	var arr = [];
	var hlpObj = {};
	var doc = glob.document;
	var toString = ({}).toString;
	var proto = Object.getPrototypeOf;
	var hasOwnProp = hlpObj.hasOwnProperty;

	function Jalili(selector) {
		return init(selector);
	}

	Jalili.prototype = {
		constructor : Jalili,
		length : 0,
	};

	function init(selector) {
		function F(){}
		F.prototype = Jalili;
		var jalili = new F();

		if (!glob.isUndefined(selector) || !glob.isNull(selector)) {
			if (glob.isString(selector)) {
				var nodes =  doc.querySelectorAll(selector);
				//proto(nodes).each = jalili.each;
				nodes = jalili.merge(jalili, nodes);

				if (nodes.length > 0) {
					if (nodes.length > 1) {
						nodes.each(function(node) {
							node = jalili.merge(jalili, node);
						});

						jalili[0] = proto(arr).slice.call(nodes);
					} else {
						jalili[0] = nodes;
					}

					return jalili[0];
				}
			} else if (glob.isFunction(selector)) {
				selector();
			} else if (glob.isArray(selector) || glob.isObject(selector)) {
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
	};

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
			return typeof o === 'function' && !glob.isInt(o.nodeType);
		},

		isWindow : function(o) {
			return !glob.isNull(o) && o === o.glob;
		},

		empty : function(o) {
			return o.length == 0;
		}
	}, glob);

	//Copy the properties of p to o, and return o.
	//If o and p have a property by the same name, o's property is used.
	Jalili.merge = function(p, o) {
		o = o || this;

		for(var prop in p) {
			if (hasOwnProp.call(o, prop)) {
				continue;
			}

			o[prop] = p[prop];
		}

		return o;
	};

	//Remove properties from o if there is not a property with the same name in p.
	Jalili.restrict = function(o, p) {
		for(var prop in o) {
			if (!(prop in p)) {
				delete o[prop];
			}
		}

		return o;
	};

	//For each property of p, delete a property with the same name from o.
	Jalili.subtract = function(o, p) {
		for(var prop in p) {
			delete o[prop];
		}

		return o;
	};

	//Return a new object holding properties of both o and p.
	//If o and p have properties by the same name, values from o are used.
	Jalili.union = function(p, o) {
		o = o || this;

		return this.extend(p, this.extend({},o));
	};

	//Return a new object that holds only properties of o also appearing in p
	Jalili.intersection = function(p, o) {
		o = o || this;

		return this.restrict(p, this.extend({}, o));
	};

	//Return an array containing names of own properties of o
	Jalili.keys = function(o) {
		if (!glob.isObject(o)) {
			throw TypeError();
		}

		var result = [];

		for (var prop in o) {
			if (hasOwnProp.call(o, prop)) {
				result.push(prop);
			}
		}

		return result;
	};

	Jalili.pop = function() {
		if (glob.isArray(this[0])) {
			return this[0].pop();
		}
	};

	Jalili.push = function(x) {
		if (glob.isArray(this[0])) {
			return this[0].push(x);
		}
	};

	Jalili.join = function() {
		if (glob.isArray(this[0])) {
			return this[0].join();
		}
	};

	Jalili.shift = function() {
		if (glob.isArray(this[0])) {
			return this[0].shift();
		}
	};

	Jalili.unshift = function(x) {
		if (glob.isArray(this[0])) {
			return this[0].unshift(x);
		}
	};

	Jalili.replace = function(i, x) {
		if (glob.isArray(this[0])) {
			var l = this[0].length;

			if (Math.abs(i) >= l) {
				throw "Index out of bounds.";
			}

			if (i < 0) {
				i = l+i;
			}

			this[0][i] = x;

			return this[0];
		}
	};

	Jalili.splice = function(i, n) {
		if (glob.isArray(this[0])) {
			var l = this[0].length;

			if (Math.abs(i) >= l) {
				throw "Index out of bounds.";
			}

			return this[0].splice(i, Math.abs(n));
		}
	};

	Jalili.delete = function(i) {
		return this.splice(i, 1);
	};

	Jalili.concat = function() {
		if (!glob.empty(arguments)) {
			var arr = glob.isArray(this[0])? this[0] : [];

			for (var i = 0; i < arguments.length; i++) {
				if (glob.isArray(arguments[i])) {
					arr = arr.concat(arguments[i]);
				}
			}

			return arr;
		}
	};

	Jalili.each = function(c) {
		if (glob.isUndefined(c)) {
			return this;
		}

		proto(arr).forEach.call(this, c);
	};

	var UA = navigator.userAgent.toLowerCase(),
		browMatch = /(webkit)[ /]([\w.]+)/.exec(UA) || 
		/(opera)(?:.*version)?[ /]([\d]+)/.exec(UA) || /(msie) ([\w.]+)/.exec(UA) || 
		!/compatible/.test(UA) && /(mozilla)(?:.*? rv:([\w.]+))?/.exec(UA) || [];

	Jalili.browser = {
		name : browMatch[1] || '',
		version : browMatch[0] || 0
	};

	Jalili.mobileDetect = function() {
		return  /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge|maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/g.test(UA) || 
		/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw-(n|u)|c55\/|capi|ccwa|cdm-|cell|chtm|cldc|cmd-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc-s|devi|dica|dmob|do(c|p)o|ds(12|-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(-|_)|g1 u|g560|gene|gf-5|g-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd-(m|p|t)|hei-|hi(pt|ta)|hp( i|ip)|hs-c|ht(c(-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i-(20|go|ma)|i230|iac( |-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|-[a-w])|libw|lynx|m1-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|-([1-8]|c))|phil|pire|pl(ay|uc)|pn-2|po(ck|rt|se)|prox|psio|pt-g|qa-a|qc(07|12|21|32|60|-[2-7]|i-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h-|oo|p-)|sdk\/|se(c(-|0|1)|47|mc|nd|ri)|sgh-|shar|sie(-|m)|sk-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h-|v-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl-|tdg-|tel(i|m)|tim-|t-mo|to(pl|sh)|ts(70|m-|m3|m5)|tx\\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\\-|your|zeto|zte\\-/g.test(UA);
	};

	//freeze objects to make its properties non-configurable
	Jalili.freeze = function(o) {
		if (glob.isObject(o)) {
			Object.freeze(o);
		}
	};

	//inherit jalili object
	Jalili.inherit = function() {
		if (Object.create) {
			return Object.create(this);
		}

		function F(){}
		F.prototype = this;

		return new F();
	};
	
	Object.freeze(Jalili);

	glob.$ = glob.Jalili = Jalili;

	return Jalili;
})(undefined !== window? window : this);
