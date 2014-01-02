function UploadController($scope, fileService) {
    var dropbox = document.getElementById('dropbox');

    $scope.fileUrl = null;
    $scope.dropText = 'Drop files here...';
    $scope.files = [];

    fileService.list(function(error, list) {
        $scope.list = list;
        $scope.$apply();
    });
    
    function dragEnterLeave(event) {
        event.stopPropagation();
        event.preventDefault();
        $scope.$apply(function () {
            $scope.dropText = 'Drop files here...';
            $scope.dropClass = '';
        });
    }

    dropbox.addEventListener('dragenter', dragEnterLeave, false);
    dropbox.addEventListener('dragleave', dragEnterLeave, false);

    dropbox.addEventListener('dragover', function (event) {
        event.stopPropagation();
        event.preventDefault();
        
        var ok = event.dataTransfer && event.dataTransfer.types && event.dataTransfer.types.indexOf('Files') >= 0;

        $scope.$apply(function () {
            $scope.dropText = ok ? 'Drop files here...' : 'Only files are allowed!';
            $scope.dropClass = ok ? 'over' : 'not-available';
        });
    }, false);

    dropbox.addEventListener('drop', function (event) {
        var files = event.dataTransfer.files || [];

        event.stopPropagation();
        event.preventDefault();

        $scope.$apply(function () {
            $scope.dropText = 'Drop files here...';
            $scope.dropClass = '';
        });

        if (files.length > 0) {
            fileService.upload(files, {
                progress: function (event) {
                    $scope.$apply(function () {
                        if (event.lengthComputable) {
                            $scope.progress = Math.round(event.loaded * 100 / event.total);
                        } else {
                            $scope.progress = 'unable to compute';
                        }
                    });
                },
                complete: function (event) {
                    var result = JSON.parse(event.target.responseText);

                    if(result.error_code){
                        return;
                    }

                    $scope.$apply(function(){
                        $scope.fileUrl = result.file_url;
                    });
                },
                failed: function (event) {
                    alert('There was an error attempting to upload the file.');
                },
                canceled: function (event) {
                    alert('The upload has been canceled by the user or the browser dropped the connection.');
                }
            });
        }
    }, false);
}