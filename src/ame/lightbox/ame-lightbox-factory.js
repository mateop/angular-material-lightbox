(function (angular) {
    "use strict";

    var defaults = {
        buttonClass: "",
        initialIndex: 0,
        keyboard: true,
        showDots: true,
        backdropOpacity: null, // $mdDialog default
        targetEvent: undefined
    };

    angular.module("ame.lightbox")
        .constant("ameLightboxDefaults", defaults)
        .factory("ameLightbox", ['$mdDialog', '$timeout', ameLightboxFactory]);

    function ameLightboxFactory($mdDialog, $timeout) {
        return {
            show: show
        };


        function show(items, options) {
            items = items || [];
            options = angular.extend({}, defaults, options);

            $mdDialog.show({
                template: require('./dialog-lightbox.html'),
                controller: "AmeLightboxController",
                controllerAs: "ctrl",
                targetEvent: options.targetEvent,
                clickOutsideToClose: true,
                onShowing: function () {
                    $timeout(function () {
                        if (angular.isNumber(options.backdropOpacity)) {
                            document.getElementsByClassName("md-dialog-backdrop")[0].style.opacity = options.backdropOpacity;
                        }
                    }, 0, false);
                },
                locals: {
                    items: items.map(_normalizeItem),
                    options: options
                },
                bindToController: true
            })
        }

        function _normalizeItem(item) {
            return angular.isString(item) ? {src: item} : item
        }
    }

})(angular);