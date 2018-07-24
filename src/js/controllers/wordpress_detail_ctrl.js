angular.module('fidelisa').controller('WordpressDetailCtrl', function($scope, $rootScope,
    $stateParams, urlObj, Wordpress) {

    var update = function() {

        Wordpress.get(urlObj.value.url)
            .then(function(data) {
                var msg = data[$stateParams.id || 1] || {};
                $scope.title = msg.title.rendered;
                msg.comments = [];

                Wordpress.avatar(msg)
                    .then(function(avatar) {
                        msg.avatar = avatar;
                    });

                Wordpress.media(msg)
                    .then(function(avatar) {
                        msg.media = avatar;
                    });

                $scope.msg = msg;

            });

    }

    update();


});
