(function (angular) {
    'use strict';

    angular.module('ame.lightbox')
        .controller('AmeLightboxController', ['items', 'options', '$log', '$mdDialog', '$scope', '$document', '$timeout', '$mdMedia', AmeLightboxController]);

    function AmeLightboxController(items, options, $log, $mdDialog, $scope, $document, $timeout, $mdMedia) {
        var self = this;
        if (!items.length > 0) {
            $log.warn('mde.lightbox: calling lightbox without any image!');
            $mdDialog.cancel();
            return;
        }
        self.loading = true;
        self.options = options;
        self.imageLoaded = imageLoaded;
        self.videoLoaded = videoLoaded;
        self.currentIndex = Math.max(Math.min(options.initialIndex || 0, items.length - 1), 0);
        self.prev = prev;
        self.next = next;
        self.imageWidth = null;
        self.imageHeight = null;
        self.isImage = true;

        const imageFileTypes = ['png', 'jpg', 'jpeg', 'webp', 'svg', 'gif'];

        if (options.keyboard) {
            _listenToKeyboardEvents();
        }

        $scope.$on('$destroy', _cleanup);

        function next() {
            self.currentIndex = (self.currentIndex + 1) % items.length;
            const extension = self.items[self.currentIndex].src.substr(self.items[self.currentIndex].src.lastIndexOf('.') + 1).toLowerCase();
            self.isImage = imageFileTypes.indexOf(extension) !== -1;
        }

        function prev() {
            var index = self.currentIndex - 1;
            self.currentIndex = (index >= 0 ? index : index + items.length) % items.length;
            const extension = self.items[self.currentIndex].src.substr(self.items[self.currentIndex].src.lastIndexOf('.') + 1).toLowerCase();
            self.isImage = imageFileTypes.indexOf(extension) !== -1;
        }

        $scope.$watch(function () {
            return self.currentIndex;
        }, function (currentIndex) {
            if (angular.isDefined(currentIndex)) {
                self.loading = true;
            }
        });

        function imageLoaded() {
            self.loading = false;
            self.resizing = true;
            resize().then(function () {
                self.resizing = false;
            });
        }

        function videoLoaded() {
            self.loading = false;
            self.resizing = true;

            var imgContainer = document.getElementById('ame_lightbox_image');
            var video = imgContainer.getElementsByTagName('video')[0];
            var containingArea = getContainingArea();

            var height = video.videoHeight;
            var width = video.videoWidth;
            if (video.videoWidth / containingArea.width > video.videoHeight / containingArea.height) {
                // width may be bottleneck
                if (video.videoWidth > containingArea.width) {
                    width = containingArea.width;
                }
                height = video.videoHeight * (width / video.videoWidth);
            }
            else {
                // height may be bottleneck

                if (video.videoHeight > containingArea.height) {
                    height = containingArea.height;
                }
                width = video.videoWidth * (height / video.videoHeight);
            }
            imgContainer.style.height = height + 'px';
            imgContainer.style.width = width + 'px';

            $timeout(200).then(function () {
                self.resizing = false;
            });
        }

        function resize() {
            var imgContainer = document.getElementById('ame_lightbox_image');
            var img = imgContainer.getElementsByTagName('img')[0];
            var containingArea = getContainingArea();

            var height = img.naturalHeight;
            var width = img.naturalWidth;
            if (img.naturalWidth / containingArea.width > img.naturalHeight / containingArea.height) {
                // width may be bottleneck
                if (img.naturalWidth > containingArea.width) {
                    width = containingArea.width;
                }
                height = img.naturalHeight * (width / img.naturalWidth);
            }
            else {
                // height may be bottleneck

                if (img.naturalHeight > containingArea.height) {
                    height = containingArea.height;
                }
                width = img.naturalWidth * (height / img.naturalHeight);
            }
            imgContainer.style.height = height + 'px';
            imgContainer.style.width = width + 'px';
            return $timeout(200);

        }

        function getContainingArea() {
            var body = document.documentElement || document.body;

            var factor = .8,
                buttonSize = $mdMedia('gt-xs') ? 80 : 0,
                dotsHeight = 60;
            var windowWidth = window.innerWidth || body.clientWidth;
            var windowHeight = window.innerHeight || body.clientHeight;
            var area = {
                width: (windowWidth) * factor,
                height: (windowHeight) * factor
            };
            if (area.width > windowWidth - (2 * buttonSize)) {
                area.width = windowWidth - (2 * buttonSize);
            }
            if (area.height > windowHeight - (dotsHeight)) {
                area.height = windowHeight - (dotsHeight);
            }
            return area;
        }


        function _listenToKeyboardEvents() {
            $document.bind('keydown', _keypressHandler);
        }

        function _stopListeningToKeyboardEvents() {
            $document.unbind('keydown', _keypressHandler);
        }

        function _keypressHandler(event) {
            var fn = null;
            switch (event.keyCode) {
                case 37: //'ArrowLeft':
                case 40: //'ArrowDown':
                    fn = document.dir == 'rtl' ? next : prev;
                    break;
                case 39: //'ArrowRight':
                case 38: //'ArrowUp':
                    fn = document.dir == 'rtl' ? prev : next;
                    break;
            }
            if (fn) {
                event.stopPropagation();
                event.preventDefault();
                $scope.$apply(fn);
            }
        }

        function _cleanup() {
            _stopListeningToKeyboardEvents();
        }
    }

})(angular);
