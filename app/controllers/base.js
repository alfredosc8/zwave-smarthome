/**
 * Application base controller
 * @author Martin Vach
 */

/*** Controllers ***/
var myAppController = angular.module('myAppController', []);
/**
 * Base controller
 */
myAppController.controller('BaseController', function ($scope, $cookies, $filter, $location, $route, $window, cfg, dataFactory, dataService, myCache) {
    /**
     * Global scopes
     */
    $scope.cfg = cfg;
    $scope.languages = {};
    $scope.loading = false;
    $scope.alert = {message: false, status: 'is-hidden', icon: false};
    $scope.user = dataService.getUser();
    $scope.hostName = $location.host();
    $scope.ZWAYSession = dataService.getZWAYSession();
    $scope.lastLogin = dataService.getLastLogin();
    $scope.setPollInterval = function () {
        if (!$scope.user) {
            $scope.cfg.interval = $scope.cfg.interval;
        } else {
            $scope.cfg.interval = ($filter('toInt')($scope.user.interval) >= 1000 ? $filter('toInt')($scope.user.interval) : $scope.cfg.interval);
        }

    };
    $scope.setPollInterval();
    $scope.elementAccess = function (roles, mobile) {
        if (!$scope.user) {
            return false;
        }
        // Hide on mobile devices
        if (mobile) {
            return false;
        }
        // Hide for restricted roles
        if (angular.isArray(roles) && roles.indexOf($scope.user.role) === -1) {
            return false;
        }
        return true;
    };

    /**
     * Language settings
     */
    $scope.lang_list = cfg.lang_list;
    // Set language
    //$scope.lang = cfg.lang;
    $scope.getLang = function () {
        if ($scope.user) {
            $scope.lang = $scope.user.lang;
        } else {
            $scope.lang = angular.isDefined($cookies.lang) ? $cookies.lang : cfg.lang;
        }
    };
    $scope.getLang();
    $cookies.lang = $scope.lang;

    // Load language files
    $scope.loadLang = function (lang) {
        // Is lang in language list?
        var lang = (cfg.lang_list.indexOf(lang) > -1 ? lang : cfg.lang);
        dataFactory.getLanguageFile(lang).then(function (response) {
            //$scope.languages = response.data;
            angular.extend($scope.languages, response.data);
        }, function (error) {
            dataService.showConnectionError(error);
        });
    };
    // Get language lines
    $scope._t = function (key) {
        return dataService.getLangLine(key, $scope.languages);
    };

    // Watch for lang change
    $scope.$watch('lang', function () {
        $scope.loadLang($scope.lang);
    });

    // Order by
    $scope.orderBy = function (field) {
        $scope.predicate = field;
        $scope.reverse = !$scope.reverse;
    };

    /**
     * Get body ID
     */
    $scope.getBodyId = function () {
        var path = $location.path().split('/');
        return path[1] || 'login';
//        if (path[1] == 'elements') {
//            switch (path[2]) {
//                case 'location':
//                    return 'location';
//                    break;
//                case 'dashboard':
//                    return 'dashboard';
//                    break;
//                default:
//                    return 'elements';
//                    break;
//            }
//
//        } else {
//            return path[1] || 'login';
//        }

    };

    /**
     * Get current filter
     */
    $scope.getCurrFilter = function (index, val) {
        var path = $location.path().split('/');

    };
    /**
     * Get body ID
     */
    $scope.footer = 'Home footer';
    /**
     *
     * Mobile detect
     */
    $scope.isMobile = dataService.isMobile(navigator.userAgent || navigator.vendor || window.opera);
    /*
     * Menu active class
     */
    $scope.isActive = function (route) {
        return (route === $scope.getBodyId() ? 'active' : '');
    };

    /**
     * Set time
     */
    $scope.setTime = function () {
        dataService.updateTimeTick();
    };
    $scope.setTime();

    /**
     *Reload data
     */
    $scope.reloadData = function () {
        myCache.removeAll();
        $route.reload();
    };
    /**
     * Redirect to given url
     */
    $scope.redirectToRoute = function (url) {
        if (url) {
            $location.path(url);
        }
    };
    /**
     * Get app logo
     */
    $scope.getAppLogo = function () {
        var logo = 'app/img/app-logo-default.png';
        if (cfg.custom_cfg[cfg.app_type]) {
            logo = cfg.custom_cfg[cfg.app_type].logo || logo;
        }
        return logo;
    };
    /**
     * Get hidden apps array by app_type
     */
    $scope.getHiddenApps = function () {
        var apps = [];
        if (cfg.custom_cfg[cfg.app_type]) {
            apps = cfg.custom_cfg[cfg.app_type].hidden_apps || [];
        }
        return apps;
    };

    /**
     * Get array from custom config
     */
    $scope.getCustomCfgArr = function (key) {
        if (cfg.custom_cfg[cfg.app_type]) {
            return cfg.custom_cfg[cfg.app_type][key] || [];
        }
        return [];
    };

    /**
     * Redirect to Expert
     */
    $scope.toExpert = function (url, message) {
        alertify.confirmWarning(message, function () {
            //$window.location.href = url;
            $window.open(url, '_blank');
        }).set('labels', {ok: $scope._t('goahead')});
    };

    /**
     * Expand/collapse navigation
     */
    $scope.naviExpanded = {};
    $scope.expandNavi = function (key, $event, status) {
        if ($scope.naviExpanded[key]) {
            $scope.naviExpanded = {};
            $event.stopPropagation();
            return;
        }
        $scope.naviExpanded = {};
        if (typeof status === 'boolean') {
            $scope.naviExpanded[key] = status;
        } else {
            $scope.naviExpanded[key] = !$scope.naviExpanded[key];
        }
        $event.stopPropagation();
    };
    // Collaps element/menu when clicking outside
    window.onclick = function () {
        if ($scope.naviExpanded) {
            angular.copy({}, $scope.naviExpanded);
            $scope.$apply();
        }
    };

    /**
     * Open/close modal
     */
    $scope.modalArr = {};
    $scope.handleModal = function (key, $event, status) {
        if (typeof status === 'boolean') {
            $scope.modalArr[key] = status;
        } else {
            $scope.modalArr[key] = !($scope.modalArr[key]);
        }

        $event.stopPropagation();
    };
    /**
     * Expand/collapse element
     */
    $scope.expand = {};
    $scope.expandElement = function (key) {
        $scope.expand[key] = !($scope.expand[key]);
    };


    /**
     * Alertify defaults
     */
    alertify.defaults.glossary.title = cfg.app_name;
    alertify.defaults.glossary.ok = 'OK';
    alertify.defaults.glossary.cancel = 'CANCEL';
   
    // Extend existing alert (ERROR) dialog
    if (!alertify.alertError) {
        //define a new errorAlert base on alert
        alertify.dialog('alertError', function factory() {
            return{
                build: function () {
                    var errorHeader = '<span class="fa fa-exclamation-triangle fa-lg text-danger" '
                            + 'style="vertical-align:middle;">'
                            + '</span> ' + cfg.app_name + ' - ERROR';
                    this.setHeader(errorHeader);
                }
            };
        }, true, 'alert');
    }
    
    // Extend existing alert (WARNING) dialog
    if (!alertify.alertWarning) {
        //define a new errorAlert base on alert
        alertify.dialog('alertWarning', function factory() {
            return{
                build: function () {
                    var errorHeader = '<span class="fa fa-exclamation-circle fa-lg text-warning" '
                            + 'style="vertical-align:middle;">'
                            + '</span> ' + cfg.app_name + ' - WARNING';
                    this.setHeader(errorHeader);
                }
            };
        }, true, 'alert');
    }
    
    // Extend existing confirm dialog
    if (!alertify.confirmWarning) {
        //define a new errorAlert base on alert
        alertify.dialog('confirmWarning', function factory() {
            return{
                build: function () {
                    var errorHeader = '<span class="fa fa-exclamation-circle fa-lg text-warning" '
                            + 'style="vertical-align:middle;">'
                            + '</span> ' + cfg.app_name + ' - WARNING';
                    this.setHeader(errorHeader);
                }
            };
        }, true, 'alert');
    }

});
