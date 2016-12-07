var app = angular.module('CryptoApp');

app.factory('OpenpgpService', function ($q) {
    var self = {
        privateKey: null,
        publicKey: null,
        password: null,
        keySize: 2048,
        userIds: [{name: 'Jon Smith', email: 'jon@example.com'}],
        setPublicKey: function (key) {
            self.publicKey = key;
        },
        setPrivateKey: function (key) {
            self.privateKey = key;
        },
        encryptFile: function (file) {
            var options = {
                data: file,
                publicKeys: openpgp.key.readArmored(self.publicKey).keys,
            };

            return openpgp.encrypt(options)
                .then(function (ciphertext) {
                    return $q.resolve(ciphertext.data);
                });
        },
        decryptFile: function (encryptedData) {
            var privateKey = openpgp.key.readArmored(self.privateKey).keys[0];

            if (self.password) {
                privateKey.decrypt(self.password);
            }

            var options = {
                message: openpgp.message.readArmored(encryptedData),
                privateKey: privateKey,
            };

            return openpgp.decrypt(options)
                .then(function (text) {
                    return $q.resolve(text.data);
                });
        },
        generateKeys: function () {
            var options = {
                userIds: self.userIds,
                numBits: self.keySize,
            }

            if (self.password) {
                options.passphrase = self.password;
            }

            return openpgp
                .generateKey(options)
                .then(function (key) {
                    return $q.resolve({
                        privateKey: key.privateKeyArmored,
                        publicKey: key.publicKeyArmored
                    });
                });
        }

    };

    return self;
});
