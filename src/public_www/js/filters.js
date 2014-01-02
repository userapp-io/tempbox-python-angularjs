'use strict';

/* Filters */

angular.module('tempbox.filters', [])

.filter('interpolate', ['version', function(version) {
    return function(text) {
      return String(text).replace(/\%VERSION\%/mg, version);
    }
}])

// relative time
.filter("relativeTime", function () {
    return function (ts) {
    	var str = "-";
    	
    	if (typeof(ts) != "number" || ts === 0) {
    		return str;
    	}
    	
    	var now = new Date().getTime() / 1000;
    	
    	var second  = 1;
    	var minute  = 60 * second;
    	var hour    = 60 * minute;
    	var day     = 24 * hour;
    	var month   = 30 * day;

    	var delta = Math.round(now - ts);
    	
        if (delta < 0) {
            delta = 0;
        }
    	
    	if (delta < (1 * minute)) {
			str = "just a moment ago";
		} else if (Math.round(delta / minute) <= 1) {
			str = "1 min ago";
		} else if (delta < 50 * minute) {
			str = Math.round(delta / minute) + " mins ago";
		} else if (Math.round(delta / hour) <= 1) {
			str = "1 hour ago";
		} else if (delta < 24 * hour) {
			str = Math.round(delta / hour) + " hours ago";
		} else if (delta < 48 * hour) {
			str = "yesterday";
		} else if (delta < 30 * day) {
			str = Math.round(delta / day) + " days ago";
		} else if (delta < 12 * month) {
			var months = Math.round(delta / month);
			if (months <= 1) {
				str = "1 month ago";
			} else {
				str = months + " months ago";
			} 
		} else {
			var years = Math.round((delta / day) / 365);
			if (years <= 1) {
				str = "1 year ago";
			} else {
				str = years + " years ago";
			} 
		}
    	
    	return str;
    };
});