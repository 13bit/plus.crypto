var app = angular.module('CryptoApp', ['simplemde', 'ngFileSaver']);

app.controller('CryptoCtrl', function ($scope, FileSaver, Blob) {
    $scope.text = '';
    $scope.file = null;

    $scope.download = function () {
        var data = new Blob([$scope.text], {type: 'text/plain;charset=utf-8'});
        FileSaver.saveAs(data, 'text.txt');
    };
    $scope.add = function () {
        var file = document.getElementById('file').files[0];
        if (file) {
            var r = new FileReader();
            r.onloadend = function (e) {
                var data = e.target.result;
                $scope.text = data;
                $scope.$apply();
            }
            r.readAsText(file);
        }
    }

});

