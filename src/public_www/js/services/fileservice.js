app.service('fileService', function($http) {
	return {
		// List all files
		list: function(callback){
			$http.get("/files/").success(function(data){
				callback(null, data);
			}).error(function(data){
				callback(data);
			});
		},
		// Upload one or many files
		upload: function(files, events){
			events = events || {};

	        var formData = new FormData();
	        var request = new XMLHttpRequest();

	        for (var i in files) {
	            formData.append("uploadedFile", files[i]);
	        }
	        
	        if('progress' in events){
		        request.upload.addEventListener("progress", events.progress, false);
		    }
	        
	        if('complete' in events){
	        	request.addEventListener("load", events.complete, false);
		    }

	        if('failed' in events){
	        	request.addEventListener("error", events.failed, false);
		    }

	        if('canceled' in events){
	        	request.addEventListener("abort", events.canceled, false);
		    }

	        request.open("POST", "/files/");

	        request.send(formData);
		}
	};
});