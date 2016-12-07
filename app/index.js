var app = angular.module('CryptoApp', ['simplemde', 'ngFileSaver']);

app.controller('CryptoCtrl', function ($scope, FileSaver, Blob, OpenpgpService) {
    $scope.text = '';
    $scope.file = null;
    $scope.privateKey = null;
    $scope.publicKey = null;
    $scope.password = '123';

    $scope.downloadFile = function () {
        _download($scope.text, 'text.txt');
    };

    $scope.uploadFile = function () {
        _upload('file', function (result) {
            $scope.text = result;
            $scope.$apply();
        });
    }

    $scope.generateKey = function () {
        OpenpgpService.generateKeys()
            .then(function (keys) {
                $scope.privateKey = keys.privateKey;
                $scope.publicKey = keys.publicKey;
                $scope.$apply();

                OpenpgpService.setPublicKey(keys.publicKey);
                OpenpgpService.setPrivateKey(keys.privateKey);
            });
    }

    $scope.downloadKeys = function () {
        if (!$scope.privateKey && !$scope.publicKey) {
            return;
        }

        _download($scope.privateKey, 'private.key');
        _download($scope.privateKey, 'public.key');
    }

    $scope.uploadPrivateKey = function () {
        _upload('pk-file', function (result) {
            $scope.privateKey = result;
            OpenpgpService.setPrivateKey(result);
            $scope.$apply();
        });
    }

    $scope.uploadPublicKey = function () {
        _upload('pubk-file', function (result) {
            $scope.publicKey = result;
            OpenpgpService.setPublicKey(result);
            $scope.$apply();
        });
    }

    $scope.encryptFile = function () {
        OpenpgpService.encryptFile($scope.text)
            .then(function (result) {
                _download(result, 'text.encrypted.txt')
            });
    }

    $scope.decryptFile = function () {
        _upload('enc-file', function (result) {
            OpenpgpService.decryptFile(result)
                .then(function (decryptedData) {
                    $scope.text = decryptedData;
                    $scope.$apply();
                });
        });
    }

    function _upload(fileId, callback) {
        var file = document.getElementById(fileId).files[0];

        if (file) {
            var fileReader = new FileReader();
            fileReader.onloadend = function (e) {
                var data = e.target.result;
                callback(data);
            }

            fileReader.readAsText(file);
        }
    }

    function _download(data, fileName) {
        var data = new Blob([data], {type: 'text/plain;charset=utf-8'});
        FileSaver.saveAs(data, fileName);
    }
});

