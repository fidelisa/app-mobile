angular.module('fidelisa')

.directive('wpComments', function($compile) {
  return {
     restrict: 'E',
     replace: true,
     scope: {
       url: '=',
       parent: '=',
       noshow: '='
     },
     link: function (scope, element) {
        //check if this member has children
        function update() {
            if (scope.url) {
              // append the collection directive to this element
              element.append(
                '<div ng-hide="show" class="comments text-right">'
               +' <h4 ng-click="toggle()">{{commentsLength}}</h4>'
               +'</div>'
               +'<div ng-show="show" class="list" ng-repeat="comment in comments" >'
               +'  <div ng-click="toggle()" class="item item-avatar">'
               +'    <img ng-src="{{comment.author_avatar_urls[48]}}">'
               +'    <h4 ng-bind-html="comment.author_name" ></h4>'
               +'    <p>{{dateAgo(comment.date)}}</p>'
               +'    <p ng-bind-html="comment.content.rendered"></p>'
               +'  </div>'
               +'  <wp-comments url="comment.url" parent="comment.id"></wp-comments>'
               +'</div>'
              );
              // we need to tell angular to render the directive
              $compile(element.contents())(scope);
          }
        }

        scope.$watchGroup(['url', 'parent'], function() {
          update();
        });
     },
     controller: function($scope, Wordpress) {
       function update() {
         if ($scope.url) {
           var url = $scope.url+'&parent='+$scope.parent;
           Wordpress.comments(url).then(function(comments) {
             $scope.comments = comments;
             comments.forEach(function(comment) {
                comment.url = $scope.url;
             })

             if (comments.length > 1) {
               $scope.commentsLength = comments.length + " commentaires"
             }  else if (comments.length == 1) {
               $scope.commentsLength =  "1 commentaire"
             }
           })
         }
       }

       $scope.$watchGroup(['url', 'parent'], function() {
         update();
       });

       $scope.toggle = function() {
         if (!$scope.noshow) {
            $scope.show = !$scope.show ;
         }
       }

     },
     template: '<div></div>'

  }
});
