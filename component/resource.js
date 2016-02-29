import jQuery from 'jQuery';
import lscache from 'lscache';
import m from 'mithril';

// Benchmarking function used to determine which sub elements in the new layout 
// have performance gains to be realized
var BENCHMARK = false;
var bench = function(label){
	if(!window.BENCHMARK) return;
	bench.curr = new Date();
	console.info(label, (bench.curr - bench.start), "ms");
}
bench.warn = function(label){
	if(!window.BENCHMARK) return;
	bench.curr = new Date();
	console.warn(label, (bench.curr - bench.start), "ms");
}
bench.error = function(label){
	if(!window.BENCHMARK) return;
	bench.curr = new Date();
	console.error(label, (bench.curr - bench.start), "ms");
}
bench.start = new Date();
bench.curr = new Date();

/*
The Resource class simply wraps around m.request to provide a few Genome-specific niceties
- It defaults to unwrapSuccess and unwrapError functions that expose the data.Entries and data.Validation.ErrorMessages conventions (but you can still override these functions as you normally would with m.request)
- It also piggybacks identical simultaneous requests, so calling the exact same web service from two different places at the same time triggers a single HTTP request, instead of two.
*/

var Resource = function(args) {
	if (!args.data) args.data = {};
	args.config = function(xhr){xhr.withCredentials = true};
	args.extract = function(xhr) {
		if (xhr.status == 0) return null;
		if (xhr.status == 401 || xhr.status == 403) {
			location.href = "/login/?t=" + encodeURIComponent(location.href);
			return null;
		}
		//handle an exception thrown by API service
		try {
			var response = JSON.parse(xhr.responseText);
			if (typeof response.ResponseStatus != "undefined" && response.ResponseStatus != null) {
				if (response.ResponseStatus.ErrorCode == "HttpException" && response.ResponseStatus.Message == "UnauthorizedPortfolioAccess") {
					location.href = "/general/conflict_info/";
					return null;
				}
				var res = {
					"Validation" : {
						"IsValid" : false,
						"ErrorCode" : response.ResponseStatus.ErrorCode,
						"ErrorMessages" : [ response.ResponseStatus.Message ]
					}
				}
				return JSON.stringify(res);
			}
		} catch (err) {
		
		}
		
		return xhr.responseText || null;
	}
	args.unwrapSuccess = args.unwrapSuccess || function(data) {
		try {
			if (typeof data.Validation !== 'undefined' && data.Validation !== null && !data.Validation.IsValid) {
				throw Util.map(data.Validation.ErrorMessages, function(error) {return [].concat(error)[0]});
			}
			return data.Entries || [];
		}
		catch (e) {
			throw new Error(e || "A server error occurred");
		}
	}
	args.unwrapError = args.unwrapError || function(data) {
		return data ? Util.map(data.Validation.ErrorMessages, function(error) {return [].concat(error)[0]}) : data;
	}

	if(args.method === "GET"){
		args.background = args.background || true;
	}

	bench(args.url);

	if (args.method == "GET") {
		var key = Resource.getKey(args),
			value = lscache.get(key);

		if (value && !DEV_ENVIRONMENT) { // if the cache exists and its not expired and is not dev environment, use this value
			var deferred = m.deferred();
			return Resource.processData(deferred, value);
		} else { // if the key doesn't exist or its expired, get the new data and set key
			return Resource.fetchData(args, key);
		}
	} else { // only GET requests need to be cached, all other methods will clear cache

		// Remove cache key for 
		Resource.clearCacheKey(args.url);
		
		return Resource.fetchData(args);
	}
}

Resource.fetchData = function (args, key) {
	return m.request(args)
		.then(function (data) {
			if (typeof key !== 'undefined' && !DEV_ENVIRONMENT) { // store the data if a key is provided
				var expiry = Resource.getExpiry(args);
				lscache.set(key, data, expiry);
			}
			bench.warn(args.url);
			return data;
		}, function (e) {
			bench.error(args.url);
			throw e;
		});
}

Resource.processData = function (deferred, data) {
	deferred.resolve(data);
	return deferred.promise;
}

Resource.getKey = function (args) {
	var key = args.url + "?" + jQuery.param(args.data || ""),
		setting = Resource.findSettings(args.url);
	return (typeof setting.url !== 'undefined' ? key : undefined);
}

Resource.clearCacheKey = function(url) {
	for(var key in localStorage) {

		// removes cache prefix and params to get webservice url
		var webservice = key.replace('lscache-', '').split('?')[0];

		if(webservice === url) {
			localStorage.removeItem(key);
		}
	}
};

Resource.getExpiry = function (args) {
	var setting = Resource.findSettings(args.url);
	return (typeof setting.expire !== 'undefined' ? setting.expire : 10);
}

Resource.findSettings = function (requestUrl) {
	var setting = {},
		allSettings = Resource.cacheSettings;
	for (var i = 0 ; i < allSettings.length ; i++) {
		var url = allSettings[i].url.toLowerCase();
		if (requestUrl.toLowerCase() === url) {
			setting = allSettings[i];
			break;
		}
	}
	return setting;
}

/**
  * Caching variable which indicates which urls to cache and for how long to store the information in Local Storage
  * Caching is done using LSCache plugin (https://github.com/pamelafox/lscache)
  * {
  *		url: the url of the webservice that will be cached
  *		expire: the time (in minutes) in which the data will expire
  * }
  */
Resource.cacheSettings = [
	{
		'url': '/api/SystemSetting',
		'expire': 10
	},
	{
		'url': '/api/MegaMenu',
		'expire': 10
	},
	{
		'url': '/api/Genie/Data',
		'expire': 10
	},
	{
		'url': '/api/User/Role',
		'expire': 10
	},
	{
		'url': '/api/Help/Token',
		'expire': 60
	},
	{
		'url': '/api/CensorWord',
		'expire': 60
	},
	{
		'url': '/api/Chatter/KudosType',
		'expire': 60
	},
	{
		'url': '/api/Notification/NotificationAlertType',
		'expire': 60
	},
	{
		'url': '/api/Launcher/Menu',
		'expire': 10
	}
];

/*
This is meant to be used as a unwrapSuccess override (e.g. var foo = new Resource({method: "GET", url: "/api/Foo", unwrapSuccess: Resource.asSingle})
It then exposes a single entity as the result, instead of an array (i.e. foo() returns something like {FooID: 1} instead of [{FooID: 1}]
*/
Resource.asSingle = function(data) { 
	if (typeof data.Validation !== 'undefined' && data.Validation !== null && !data.Validation.IsValid) {
		return Util.map(data.Validation.ErrorMessages, function(error) {return [].concat(error)[0]})
	}
	return data && data.Entries && data.Entries[0] 
};

Resource.fullResults = function (data) { return data; }

export default Resource;