// Utility function file
var Util = {};

Util.submodule = function(module, args) {
	return module.view.bind(this, new module.controller(args))
}

//returns a getter-setter that reads and writes from a property in an object
Util.props = function(object, key) {
	return function() {
		if (arguments.length > 0) {
			object[key] = arguments[0]
		}
		return object[key]
	}
}

//returns a getter-setter that can incur side-effects when setting
Util.prop = function(data, callback) {
	return function() {
		if (arguments.length > 0) {
			var old = data
			data = arguments[0]
			if (callback) callback(data, old)
		}
		return data
	}
}

//returns a map<key,value> that accepts non-string keys, and returns a view-model
//the view model is a struct of getter-setters, whose initial value is determined by the struct passed into the constructor
//  var map = Util.ViewModelMap({title: "foo", name: "bar"})
//	var key = {foo: "bar"}
//	map(key) == map(key) //true
//  map(key).title() == "foo" //true
//  map(key).title("baz") == "baz" //true
//Use this when you have state that is related to an entity, but that is not part of the entity itself
//This is common when looping through a list of entities, and filling a form about the entity
Util.ViewModelMap = function(members) {
	var keys = [], values = []
	return function(key, value) {
		var index = keys.indexOf(key)
		if (index < 0) {
			index = keys.push(key) - 1
			values[index] = {}
			for (var member in members) values[index][member] = m.prop(members[member])
		}
		if (arguments.length > 1) values[index] = value
		return values[index]
	}
}

//returns a attribute list that contains onchange and value
//binds(getterSetter) - normal bi-directional binding that hooks to a m.prop getter-setter
//binds(object, key, callback) - bi-directional binding that hooks to a POJO object property. `callback` can be used to process the value (e.g. if you need to flip a flag)
Util.binds = function(object, key, callback) {
	if (typeof object == "function") {
		return {
			onchange: m.withAttr("value", object),
			value: object()
		};
	}
	else {
		if (!callback) callback = function(i) {return i}
		return {
			onchange: m.withAttr("value", function(value) {
				return object[key] = callback(value)
			}),
			value: callback(object[key] || "")
		}
	}
}
Util.checks = function(object, key, callback) {
	if (typeof object == "function") {
		return {
			onchange: m.withAttr("checked", object),
			value: object()
		}
	}
	else {
		if (!callback) callback = function(i) {return i}
		return {
			onchange: m.withAttr("checked", function(value) {
				return object[key] = callback(value)
			}),
			checked: callback(object[key] || false)
		}
	}
}
Util.plucks = function(prop) {
	return function(data) {
		return data[prop]
	}
}
Util.where = function(prop, value) {
	return function(data) {
		return data[prop] == value
	}
}
Util.nots = function(callback) {
	return function(value) {
		return !callback(value)
	}
}
Util.not = function(value) {
	return !value
}
Util.toggles = function(prop) {
	return function(e) {
		prop(!prop())
	}
}
Util.clears = function(prop) {
	return function(e) {
		prop("")
	}
}
Util.groups = function(accessor) {
	return function(list) {
		return Util.group(list, accessor)
	}
}
Util.group = function(list, accessor) {
	var output = {}
	for (var i = 0, item; item = list[i]; i++) {
		var key = accessor(item)
		if (output[key] === undefined) output[key] = []
		output[key].push(item)
	}
	return output
}
Util.maps = function(callback) {
	return function(list) {
		return Util.map(list, callback)
	}
}
Util.map = function(collection, bodyClause, elseClause) {
	if (elseClause === undefined) elseClause = function() {}
	if (collection === undefined) return elseClause() || []
	if ("length" in collection) {
		if (collection.length === 0) return elseClause()
		return [].slice.call(collection).map(bodyClause)
	}
	var keys = Object.keys(collection)
	if (keys.length == 0) return elseClause() || []
	return keys.map(function(key) {
		return bodyClause(collection[key], key, collection)
	})
}
Util.indexOf = function(collection, callback) {
	if (!collection) return -1
	for (var i = 0, item; item = collection[i]; i++) {
		if (callback(item)) return i
	}
	return -1
}
Util.if = function(condition, thenClause, elseClause) {
	return condition ? thenClause() : (elseClause || function() {})()
}
Util.toDate = function(date) {

	var currentUserDate = new Date();
	if (!date || date == "") return
	if (date instanceof Date) return date;
	if (typeof(date) == 'string') {
		if (date.indexOf('/Date(') == 0)
			return date instanceof Date ? date : new Date(parseInt(date.substr(6)));
		if (date.length > 0 && date[0] == '"' && date[date.length-1] == '"')
			date = date.substring(1, date.length-1);
	}
	var parsedDate = moment(date);

	return new Date(parsedDate.format());
}
Util.relativeDate = function(date) {
	date = Util.toDate(date);
	if (!date || !(date instanceof Date)) return "";
	return moment(date).fromNow();
}
Util.absoluteDate = function(date) {
	date = Util.toDate(date);
	if (!date || !(date instanceof Date)) return "";
	return moment(date).format("MMM D, YYYY");
}
Util.getTime = function(date, convertAsString) {
	if (convertAsString != true) {
		date = Util.toDate(date);
		if (!date || !(date instanceof Date)) return "";
	}
	return moment(date).format("h:mm A");
}
Util.absoluteDateTime = function(date) {
	date = Util.toDate(date);
	if (!date || !(date instanceof Date)) return "";
	return moment(date).format("MMM D, YYYY h:mm A");
}
Util.toDateFormat = function(date, format) {
	date = Util.toDate(date);
	if (!date || !(date instanceof Date)) return "";
	return moment(date).format(format);
}
Util.secondsToTime = function(total_seconds, round){
    var hours, minutes, seconds, str;

    if(total_seconds < 60) {
        str = 'less than a minute';
    } else if (total_seconds < 3600) {
        minutes = Math.floor(total_seconds / 60);
        seconds = total_seconds % 60;

        str = minutes + ((minutes === 1) ? ' minute ' : ' minutes ') +
            (seconds ? seconds + ((seconds === 1) ? ' second' : ' seconds') : '');

        if(round) {
        	if(seconds >= 30) ++minutes

        	str = str = minutes + ' min'

        	if(seconds) str = '~' + str;
        }
    } else {
        hours = Math.floor(total_seconds / 3600);
        minutes = Math.floor((total_seconds - (hours * 3600)) / 60);

        str = hours + ((hours === 1) ? ' hour ' : ' hours ') +
            (minutes ? minutes + ((minutes === 1) ? ' minute' : ' minutes') : '');

        if(round) {
        	if(minutes >= 30) ++hours

        	str = str = hours + ((hours === 1) ? ' hour' : ' hours')

        	if(minutes) str = '~' + str;
        }
    }

    return str;
};
Util.twoDigit = function(v) {return ("0" + v).slice(-2)}
Util.count = function(list) {
	if (list instanceof Array) return list.length;
	if (list instanceof Object) return Object.keys(list).length;
	return 0;
}
Util.sum = function(list, callback) {
	var sum = 0;
	for (var i = 0; i < list.length; i++)
		sum += parseFloat(callback(list[i])) || 0;
	return sum;
}

Util.transform = function(root, callback) {
    if (!root) return root;
    else if (root instanceof Array) {
        for (var i = 0; i < root.length; i++) {
            Util.transform(root[i], callback);
        }
    }
    else if (root.children) {
		callback(root)
        Util.transform(root.children, callback);
    }
    return root;
}

Util.getTimeRemaining = function(fromDate) {
	if (!fromDate) return '';
	if (typeof fromDate == "string") fromDate = Util.toDate(fromDate);

	var now = new Date();
	var diff = fromDate - now;	// diff = milliseconds between the two dates
	var neg = ""
	if (diff < 0) {
		diff = Math.abs(diff)
		neg = "overdue "
	}

	var seconds = ~~(diff / 1000) % 60;
	var minutes = ~~(diff / 60000) % 60;
	var hours = ~~(diff / 3600000) % 24;
	var days = ~~(diff / 86400000);
	var twodigit = function(v) {return ("0" + String(v).replace(/-/g, "")).slice(-2)}

	return neg + (days > 0 ? days + 'd ' : '') + (hours + ':' + twodigit(minutes) + ':' + twodigit(seconds));
}

var MixinAttrs = function(callback) {
	var attrs = {}
	callback.call(attrs, attrs)
	return attrs
}
var BucketAttrs = function(options) {
	this.ondragover = function(e) {
		e.preventDefault()
		e.dataTransfer.dropEffect = "move"
	}
	this.ondrop = function(e) {
		e.preventDefault()
		e.stopPropagation()
		if (options.ondrop instanceof Function) {
			var data = JSON.parse(e.dataTransfer.getData("text/plain"))
			data.category = options.category
			options.ondrop(e, data)
		}
	}
}
var BucketableAttrs = function(options) {
	this.draggable = true,
	this.ondragstart = function(e) {
		e.stopPropagation()
		e.dataTransfer.setData("text/plain", JSON.stringify(options))
	}
}

var Tooltip = function(options) {
	this.config = function(el, isInit) {
		if (!isInit) jQuery(el).tooltip({html: true, placement: "bottom"})
	}
	this.title = options.data
}

var ErrorView = function(error) {
	return error() ? m(".alert.alert-danger", [
		m("a.close", {onclick: Util.clears(error)}, m.trust("&times;")),
		error()
	]) : ""
}

Util.animates = function(prop, animation, callback) {
	return function(element, isInitialized) {
		if (!prop()) jQuery(element).animate(animation, {
			complete: function() {
				m.startComputation()
				callback()
				m.endComputation()
			}
		})
	}
}
Util.fadesOut = function(prop, callback) {
	return function(element, isInitialized) {
		if (!prop()) jQuery(element).animate({opacity: 0, height: 0}, {
			complete: function() {
				m.startComputation()
				callback()
				m.endComputation()
			}
		})
	}
}

Util.nonMithrilModule = function(callback) {
	return {
		controller: function() {},
		view: function() {
			return m("div", {
				config: function(element, isInit) {
					if (!isInit) {
						callback(element)
					}
				}
			})
		}
	}
}
Util.redraws = function(callback, args) {
	m.startComputation()
	callback(args)
	m.endComputation()
}

var TableSorter = function(list) {
    return {
        onclick: function(e) {
            var prop = e.target.getAttribute("data-sort-by")
            if (prop) {
                var first = list[0]
                list.sort(function(a, b) {
					var aProp = a[prop] || 0
					var bProp = b[prop] || 0
                    return aProp > bProp ? 1 : aProp < bProp ? -1 : 0
                })
                if (first === list[0]) list.reverse()
            }
        }
    }
}

Util.configureObjectToggle = function (type, callback) { //Util.closeWindowEvent.bind(null, el, type, callback)
	return function(el, isInit, ctx) {
		if (!isInit) {
			function closeWindowEvent (e) {
				$this = jQuery(el);
				if (jQuery(e.target).closest('#'+$this.attr('id')).length) {
					if (jQuery(e.target).attr('data-close') && $this.hasClass('open')) {
						$this.removeClass('open');
						if (typeof type != 'undefined') {
							Util.closeModal();
						}
					} else if (jQuery(e.target).attr('data-open') || jQuery(e.target).closest('[data-open]').length) { // if they clicked on the data-open element or inside of one, it should open the modal
						$this.addClass('open');
						window.OPEN_MODAL = $this.attr('id');
						if (typeof type != 'undefined') {
							Util.openModal();
						}
						//if they click on the open button then it should execute the callback
						if (jQuery(e.target).attr('data-close') && typeof callback != "undefined") {
							callback();
						}
					}
				} else if ($this.hasClass('open')) {
					$this.removeClass('open');
					if (typeof type != 'undefined' && window.OPEN_MODAL == $this.attr('id') && jQuery(e.target).attr('id') != 'open-task-modal') {
						Util.closeModal();
					}
				} else {
					m.redraw.strategy("none");
				}
			}

			if (typeof window.OPEN_MODAL == 'undefined') window.OPEN_MODAL = "";
				window.addEventListener("click", closeWindowEvent);

			ctx.onunload = function () {
				window.removeEventListener("click", closeWindowEvent);
			}
		}
	}
}

Util.TooltipConfig = function(el, isInitialized, context) {
	if (!isInitialized) {
		var $el = jQuery(el),
			position = $el.attr('data-position') || 'top';

		$el.tooltip({html: true, placement: position});

		context.onunload = function() {
			$el.tooltip('destroy');
		}

		$el.on('click tap', function (e) {
			$el.tooltip('toggle');
		});
	}
}

Util.isValidUrl = function (url) {
	var regEx = /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!10(?:\.\d{1,3}){3})(?!127(?:\.\d{1,3}){3})(?!169\.254(?:\.\d{1,3}){2})(?!192\.168(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/[^\s]*)?$/i;
	return regEx.test(url);
}

// Set the current position of the scroll to be the negative top value for the css of the body (prevents from the page jumping up to top)
Util.openModal = function (skipRedraw) {
  skipRedraw = skipRedraw || false;
	jQuery('#background-modal').show();
	var pos = jQuery(document).scrollTop() * -1;
	jQuery("body").css({'top': pos + 'px'}).addClass("modal-open");
  if (!skipRedraw) {
    m.redraw();
  }
}

Util.closeModal = function (skipRedraw) {
  skipRedraw = skipRedraw || false;
	var top = jQuery("body").css('top');
	var pos = parseInt(top.substr(0, top.length - 2)) * -1;
	jQuery('#background-modal').hide();
	jQuery("body").css({'top': ''}).removeClass("modal-open");
	jQuery(document).scrollTop(pos);
	// Hide any modals in page
	if(jQuery.fn.modal) {
		jQuery('.modal').modal('hide');
	}
  if (!skipRedraw) {
    m.redraw();
  }
}

Util.containsObject = function (list, key, value) {
    var i;
    list.map(function (item) {
    	if (item[key] == value)
    		return true;
    })
    return false;
}

// This function will check if the data is a function and return the proper value
// This sometimes allows params to be passed to the function when called
Util.returnData = function (data, params) {
	var args = [];
	if (Array.isArray(params))
		args = params;
	else
		args = [params];

	if (typeof data == "function")
		return data.apply(null, args);
	else
		return data;
}

Util.getKeyScanStatus = function (data) {
	var status = data.KeyScanStatus;

	if (data.IsInOffice)
	    keyScanStatus = data.KeyScanStatus;
	else if (status && status.indexOf('Out') > -1)
	    keyScanStatus = "Away";
	else if (data.IsUSEmployee)
		keyScanStatus = "US Employee";
	else if (data.IsTravelling)
		keyScanStatus = "Travelling: Back on " + Util.absoluteDate(data.TravelEnd);
	else if (data.IsOnVacation)
		keyScanStatus = "Vacation: Back on " + Util.absoluteDate(data.VacationEnd);
	else if (data.IsSick)
		keyScanStatus = "Sick/Personal";
	else
		keyScanStatus = "Not in yet";

	return keyScanStatus;
}


Util.lastSpotted = function (locationStatus) {
	var status = locationStatus.KeyScanStatus,
		updated = locationStatus.KeyScanStatusTime,
		action = "",
		suffix = "";
	if (!status || !updated) {
		return "";
	} else {
		if(status == 'Not in yet')
			action = "exiting";
		else
			action = status.replace(/In/g, 'entering').replace(/Out/g, 'exiting');
	}

	return Util.relativeDate(updated) + ", " + action;
}

Util.toArray = function (str) {
	if(str instanceof Array !== true) {
		return [].concat(str.split(","));
	} else {
		return str;
	}
}
Util.toTrimmedArray = function (str) {
	if(typeof(str) === "string") {
		return _.map(Util.toArray(str), function (x){return x.trim()});
	} else {
		return str;
	}
}
Util.toString = function (arr){
	if(arr instanceof Array) {
		return arr.join(",");
	} else {
		return arr;
	}
}

/**
 * Apply background image to mithril elements
 * @param  {string} imagePath path to the imge to be applied as bg
 * @return {object}           Object with style key and background image applied
 */
Util.bg = function(imagePath) {
	return {'style': 'background-image: url("' + imagePath + '")'}
}

Util.scrollToDiv = function (id, speed) {
	jQuery("body").animate({ scrollTop: jQuery('#'+id).offset().top }, speed);
}

Util.dial = function (phonenumber, userID, phoneDial, e) {
	if (typeof e !== 'undefined') e.preventDefault();
	if (phoneDial) {
		m.request({
			method: "GET",
			url: "/elements/javascripts/data/dialnumber?phonenumber=" + phonenumber + (typeof userID !== "undefined" && userID > 0 ? ("&userid=" + userID) : ""),
			deserialize: function(v) {return v},
			background:true
		})
	} else {
		window.location.href = "tel:" + phonenumber;
	}
}

Util.displayPhoneNumber = function (number, code, userID, phoneDial, cssClass) {
	if (number.length <= 0) {
		return "N/A";
	}

	var displayType = CLIENT_OPTIONS.internationalPhoneDisplay ? 'INTERNATIONAL' : 'NATIONAL';

	var phoneNum = intlTelInputUtils.formatNumberByType(number, code || 'us', intlTelInputUtils.numberFormat.INTERNATIONAL).replace(" ", ""),
		display = intlTelInputUtils.formatNumberByType(number, code || 'us', intlTelInputUtils.numberFormat[displayType]);
	return [
		m('a.demo-data', {
			class: cssClass || "",
			href: '#',
			onclick: Util.dial.bind(this, phoneNum, userID, phoneDial)
		}, display)
	];
}

/**
 * Replace extension from any string, i.e. test.jpg to test.png
 * @param  {string} file      File Name including extension
 * @param  {string} extension Extension name
 * @return {string}           File name with new extension
 */
Util.toExtension = function(file, extension) {
	var name = file.split('.');
	name.pop();

	return name.join('.') + '.' + extension;
}

Util.loading = function (size) {
	if (typeof size == 'undefined')
		size = 30;

	return [
		m('img', {
			style: {
				'display': 'block',
				'margin': '0 auto',
				'padding': '5px',
				'width': size + 'px',
				'height': size + 'px'
			},
			src: '/local/images/loading-newlayout.gif'
		})
	];
}

Util.shuffle = function (array) {
	var currentIndex = array.length, temporaryValue, randomIndex ;
	// While there remain elements to shuffle...
	while (0 !== currentIndex) {
		// Pick a remaining element...
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;
		// And swap it with the current element.
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}
	return array;
}

/**
 * Convert numbers into basic currency format
 * i.e. 1 => $1.00
 * @param  {number} value  amount
 * @param  {string} symbol currency symbol
 * @param  {bool} round decimal places after dot
 * @param  {bool}   isAfter Certain currencies requires symbol after value
 * @return {string}        Converted currency
 */
Util.currency = function(value, symbol, round, isAfter) {
	value = value || 0;
	symbol = typeof symbol === 'string' ? symbol : '$';
	var formated = parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');

	formated = round ? formated.split('.')[0] : formated;

	if(isAfter) formated = formated + symbol;
	else formated = formated < 0 ? formated.replace('-', '-' + symbol) : symbol + formated

	return formated;
}

/**
 * Get max length for a input field based on its type. Default to 4000
 * @param  {string} type Type of input
 * @return {number}      maxlength for a input control
 */
Util.getInputMaxLength = function(type) {
	var MAX_INPUT_LENGTH = 4000,
    	length = MAX_INPUT_LENGTH;

    switch (type) {

        case 'phone' :
            length = 50;
            break;

        case 'name' :
        	length = 100;
        	break;

        case 'email' :
        	length = 200;
        	break;
    }

    return length;
};

/**
 * Parse any csv file into an multidimensional array
 * @param  {File} file csv file
 * @param {boolean} [getObject=false] - If true parses the first line as keys for an object
 * @return {array}     multidimensional array
 */
Util.parseCSV = function (file, getObject) {
	if (typeof getObject !== 'boolean') getObject = false;
	var result = m.deferred();

    function getAsText(fileToRead) {
        var reader = new FileReader();
        // Handle errors load
        reader.onload = loadHandler;
        reader.onerror = errorHandler;
        // Read file into memory as UTF-8
        reader.readAsText(fileToRead);
    }

    function loadHandler(event) {
        var csv = event.target.result;
        processData(csv);
    }

    function processData(csv) {
        var allTextLines = csv.split(/\r\n|\n/);
        allTextLines.map(function(item, i) {
        	if(!item) allTextLines.splice(i, 1);
        })
        var lines = [];
        while (allTextLines.length) {
            lines.push(allTextLines.shift().split(','));
        }
        result.resolve(getObject ? parseAsObj(lines) : lines);
    }

    function errorHandler(evt) {
        if(evt.target.error.name == "NotReadableError") {
            alert("Canno't read file !");
        }
    }

	function parseAsObj(csvArray) {
		var parsedCsv = [],
			keys = csvArray.shift().map(function (key) {
				return key.replace(' ', '_');
			});
		csvArray.forEach(function (row) {
			var record = {};
			keys.forEach(function (key, i) {
				record[key] = row[i];
			});
			parsedCsv.push(record);
		});
		return parsedCsv;
	}

    // Check for the various File API support.
    if (window.FileReader) {
        // FileReader are supported.
        getAsText(file);
    } else {
        alert('FileReader are not supported in this browser.');
    }

    return result.promise;
}

/**
 * Adds a variable number of filler elements do the virtual DOM.
 * @param {number} [amount=4] - Amount of filler elements to return
 * @param {string} [elem='li'] - Type of element to fill with
 * @param {string} [elemClass='blank-space-filler'] - Class of filler element
 * @return Mithril added fillers
 */
Util.addFlexFill = function (amount, elem, elemClass) {
	amount = typeof amount === 'number' ? amount : 8;
	elem = typeof elem === 'string' ? elem : 'li';
	elemClass = typeof elemClass === 'string' ? elemClass : 'sensei-flex-fill';
	var list = [];
	for (var i = 0; i < amount; i++) {
		list.push(m(elem, {
			className: elemClass
		}));
	}
	return list;
};


/**
 * Scrolls smoothly to a specific ID.
 * @param {string} id - ID to scroll to
 * @param {number} [offset=-30] - Offset from scroll target
 * @param {number} [duration=1000] - Milliseconds to scroll to target
 */
Util.scroll = function (id, offset, duration) {
	offset = typeof offset === 'number' ? offset : -20;
	duration = typeof duration === 'number' ? duration : 1000;
	$j('html, body').animate({
		scrollTop: $j('#' + id).offset().top + offset
	}, duration);
};


/**
 * Capitalizes the first letter of the string passed in
 * @param {string} string - string to capitalize
 * @return string with first letter capitalized
 */
Util.capitalize = function (string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}
/**
 * Exports a given dom list into a csv file
 * @param  {object} $list    jQuery object of the list (i.e. jQuery('ul.list'))
 * @param  {string} filename filename
 * @return {void}             Will prompt to download a file
 */
Util.exportListToCSV = function($list, filename) {
	var $ = jQuery;

    var $rows = $list.find('li'),

    // Temporary delimiter characters unlikely to be typed by keyboard
    // This is to avoid accidentally splitting the actual contents
    tmpColDelim = String.fromCharCode(11), // vertical tab character
    tmpRowDelim = String.fromCharCode(0), // null character

    // actual delimiter characters for CSV format
    colDelim = '","',
    rowDelim = '"\r\n"',

    // Grab text from table into CSV formatted string
    csv = /*'""Name, Type, Status, Version, Due/Completed Date\r\n"' + */$rows.map(function (i, row) {
        var $row = jQuery(row),
            $cols = $row.find('div > *');

        return $cols.map(function (j, col) {
            var $col = jQuery(col),
                text = $col.text();

            return text.replace(/"/g, '""'); // escape double quotes

        }).get().join(tmpColDelim);

    }).get().join(tmpRowDelim)
        .split(tmpRowDelim).join(rowDelim)
        .split(tmpColDelim).join(colDelim) + '"';

    // Data URI
    return 'data:application/csv;charset=utf-8,' + encodeURIComponent(csv);
};


/**
 * Adds a delimiter between every number group eg: '44,444,444'
 * @param {number|string} value - Value to add notation to
 * @param {string} delimiter - Delimiter to put between each number group
 * @return {string} - Number with delimiter if valid else value param as a string
 */
Util.numberNotation = function (value, delimiter) {
	delimiter = typeof delimiter === 'string' ? delimiter : ',';
	value = value.toString();
  	if (!/^\d+(\.\d+)?$/.test(value)) return value;
	var wholeInt = value.split('.')[0];
	return wholeInt.replace(/\B(?=(\d{3})+(?!\d))/g, delimiter) + value.split(/\w?/)[1];
};


/**
 * Position sticky polyfill.
 * @param {number} waypoint - Position to add or remove the class.
 */
Util.sticky = function (waypoint) {
	if (waypoint <= $j(window).scrollTop()) this.classList.add('sensei-sticky');
	else this.classList.remove('sensei-sticky');
};


/**
 * Returns a function to run on an event listener to block invalid input.
 * @param {string} [lastInput=''] - Default input value
 * @return Function to run on event listener
 */
Util.blockInvalidInput = function (lastInput) {
	lastInput = typeof lastInput !== 'undefined' ? lastInput.toString() : '';
	return function (event) {
		if (!event.target.validity.valid) {
			event.target.value = lastInput;
			return false;
		}
		lastInput = event.target.value;
		return true;
	};
};


/**
 * Check if the value is defined, if so, return actual value, otherwise, return default value
 */
Util.checkIfDefined = function (item, defaultVal) {
	return (typeof item !== 'undefined' ? item : defaultVal);
}

Util.datepicker = function datepickerConfig(el, isInit, ctx) {
	if (isInit) return;

	jQuery(el).datepicker({
		constrainInput: false,
		dateFormat: "yy-mm-dd"
	});

	ctx.onunload = function () {
		jQuery(el).datepicker('destroy');
	}
}

export default Util;