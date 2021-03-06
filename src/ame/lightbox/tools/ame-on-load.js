(function(angular){

    angular.module("ame.lightbox")
        .directive('ameOnLoad', function() {
            return {
                restrict: 'A',
                link: function(scope, element, attrs) {
                    element.on('load loadedmetadata', function () {
                        //call the function that was passed
                        scope.$apply(attrs.ameOnLoad);
                    });

                    scope.$on('$destroy', function () {
                        element.off('load loadedmetadata');
                    });
                }
            };
        });
})(angular);