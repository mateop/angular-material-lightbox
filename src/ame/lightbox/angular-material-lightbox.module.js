require('angular');
require('angular-material');
angular.module('ame.lightbox', ['ngMaterial']);

require('./ame-lightbox-factory');
require('./ame-lightbox-controller');
require('./tools/ame-on-load');

module.exports = 'ame.lightbox';
