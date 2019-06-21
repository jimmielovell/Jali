function isArray(a) {
  return Object.prototype.toString.call(a) === '[object Array]' || Object.prototype.toString.call(a) === '[object NodeList]';
}

function isInt(o) {
	return typeof o == 'number';
}

function isString(o) {
	return typeof o === 'string';
}

function isObject(o) {
	return Object.prototype.toString.call(o) === '[object Object]';
}

function isNull(o) {
	return o === null;
}

function isUndefined(o) {
	return typeof o === 'undefined';
}

function isFunction(o) {
	return typeof o === 'function' && typeof o.nodeType !== 'number';
}

function isWindow(o) {
	return o != null && o === o.window;
}

function exists(x) {
	return document.documentElement.contains($(x));
}

var $ = function(x) {
	if (x == null) {
		return;
	}
	var self =  this == window ? document : this;
	var nodeList =  isString(x) ? self.querySelectorAll(x) : x;
	if (nodeList.length == 0) {
		return;
	}
	return nodeList.length == 1 ? nodeList[0] : nodeList;
}

Node.prototype.$ = $;

Node.prototype.name = function(x) {
	if (!isNull(this.getAttribute('name'))) {
		this.getElementsByClassName(x);
	} else {
		return;
	}
};

Node.prototype.on = function(event,callback,option) {
	option = isNull(option)? false : option;
	this.addEventListener(event, function(e){callback.call(this,e)},option)
};

Node.prototype.addClass = function(c) {
	this.classList.add(c);
};

Node.prototype.removeClass = function(c) {
	this.classList.remove(c);
};

Node.prototype.toggleClass = function(c) {
	this.classList.toggle(c);
};

Node.prototype.hasClass = function(c) {
	return this.classList.contains(c);
};

Node.prototype.id = (function() {
	if (this == window || this == document) {
		return;
	}
	this.getAttribute('id');
})();

NodeList.prototype.forEach = function(c) {
	Array.prototype.forEach.call(this, c);
};

Element.prototype.css = function(rule) {
	for (p in rule) {
		if (!rule.hasOwnProperty(p)) {
			continue;
		}
		this.style[p] = rule[p];
	}
};

Element.prototype.removeAll = function () {
  while (this.firstChild) { this.removeChild(this.firstChild); }
  return this;
};

Element.prototype.display = function(state) {
	state = isNull(state)? true : state;
	if (state === true) {
		this.css({display:'block'});
	} else if (state === false) {
		this.css({display:'none'});
	} else {
		return;
	}
}

var passiveSupported = false, 
		onceSupported = false,
		captureSupported = false;
try { 
	var options = Object.defineProperty({},'passive', {
		get: function() { 
			passiveSupported = true;
		}
	});
	options = Object.defineProperty({},'once', {
	  get: function() {
	  	onceSupported = true;
	  }
	});
	options = Object.defineProperty({},'capture', {
	  get: function() {
	  	captureSupported = true;
	  }
	});
	window.addEventListener('test', options, options);
	window.removeEventListener('test', options, options);
} catch (err) {
	passiveSupported = false;
	onceSupported = false;
	captureSupported = false;
}
if (!Event.prototype.preventDefault) {
	Event.prototype.preventDefault = function() {
		this.returnValue = false;
	}
}
if (!Event.prototype.stopPropagation) {
	Event.prototype.stopPropagation = function() {
		this.cancelBubble = true;
	}
}
if (!Element.prototype.addEventListener) {
	var eventListeners = [];
	var addEventListener = function(type,listener) {
		var self = this;
		var wrapper = function(e) {
			e.target = e.srcElement;
			e.currentTarget = self;
			if (!isUndefined(listener.handleEvent)) {
				listener.handleEvent(e);
			} else {
				listener.call(self, e);
			}
		}
		if (type == 'DOMContentLoaded') {
			var wrapper2 = function(e) {
				if (document.readyState == 'complete') {
					wrapper(e);
				}
			}
			document.attachEvent('onreadystatechange', wrapper2); 
			eventListeners.push({object:this, type:type, listener:listener, wrapper:wrapper2});
			if (document.readyState == 'complete') {
				var e = new Event();
				e.srcElement = window;
				wrapper2(e);
			}
		} else {
			this.attachEvent('on'+type, wrapper);
			eventListeners.push({object:this, type:type, listener:listener, wrapper:wrapper});
		}
	}

	var removeEventListener = function(type,listener) {
		var counter = 0;
		while (counter < eventListeners.length) {
			var eventListener = eventListeners[counter];
			if (eventListener.object == this && eventListener.type == type && eventListener.listener == listener) {
				if (type == 'DOMContentLoaded') {
					this.detachEvent('onreadystatechange', eventListener.wrapper);
				} else {
					this.detachEvent('on'+type, eventListener.wrapper);
				}
				eventListeners.splice(counter, 1);
				break;
			}
			++counter;
		}
	}
	Element.prototype.addEventListener = addEventListener;
	Element.prototype.removeEventListener = removeEventListener;
	if (HTMLDocument) {
		HTMLDocument.prototype.addEventListener = addEventListener;
		HTMLDocument.prototype.removeEventListener = removeEventListener;
	}
	if (Window) {
		Window.prototype.addEventListener = addEventListener;
		Window.prototype.removeEventListener = removeEventListener;
	}
}

if (window.XMLHttpRequest === undefined) { 
	window.XMLHttpRequest = function() { 
		try {
			return new ActiveXObject("Msxml2.XMLHTTP.6.0");
		} catch (err1) {
			try {
				return new ActiveXObject("Msxml2.XMLHTTP.3.0");
			} catch (err2) {
				throw new Error("XMLHttpRequest is not supported!");
			}
		}
	}
}

var browser = new (function() {
	var ua = navigator.userAgent.toLowerCase();
	var match  = /(webkit)[ \/]([\w.]+)/.exec(ua) || 
										  /(opera)(?:.*version)?[ \/]([\d]+)/.exec(ua) || 
										  /(msie) ([\w.]+)/.exec(ua) || 
										  !/compatible/.test(ua) && 
										  /(mozilla)(?:.*? rv:([\w.]+))?/.exec(ua) || [];
	this.name = match[1] || '';
	this.version = match[0] || 0;
})();

var mobileDetect = (function() {
	var ua = navigator.userAgent.toLowerCase();	
	return  /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/g.test(ua) || 
						 /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/g.test(ua);
})();

function processAjax(d,u,c,e) {
	var xhttp = new XMLHttpRequest();
	e = isNull(e)? 'json' : e;
	xhttp.onreadystatechange = function(e){
		if (this.status == 200 && this.readyState == 4 && c) {
			c(this);
		}
	};
	xhttp.open('POST',u);
	if (e == 'json') {
		xhttp.setRequestHeader('Content-Type', 'application/json');
		xhttp.send(JSON.stringify(d));
	} else if (e == 'form') {
		xhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		xhttp.send(encodeFormData(d));
	} else {
		xhttp.send();
	}
}

function encodeFormData(d) {
	if (!d) {
		return '';
	}
	var pairs = [];
	for(var name in d) {
		if (!d.hasOwnProperty(name)){
			continue;
		}
		if (isFunction(d[name])) {
			continue;
		}
		var value = d[name].toString();
		name = encodeURIComponent(name.replace(' ', '+'));
		value = encodeURIComponent(value.replace(' ', '+'));
		pairs.push(name + '=' + value);
	}
	return pairs.join('&');
}

function scrollToElem(x,b) {
	b = isNull(b)? 'smooth' : b;
	x = isString(x)? $(x) : x;
	var oLeft = x.offsetLeft,
			otop = x.offsetTop;
	window.scrollTo({top:otop, left:oLeft, behavior:b});
}
