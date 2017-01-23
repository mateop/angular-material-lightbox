(function(angular){

    angular.module("ame.lightbox")
        .directive('ameOnLoad', function() {
            return {
                restrict: 'A',
                link: function(scope, element, attrs) {
                    element.bind('load', function() {
                        //call the function that was passed
                        scope.$apply(attrs.ameOnLoad);
                    });
                }
            };
        });
})(angular);