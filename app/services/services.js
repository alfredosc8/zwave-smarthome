/**
 * @overview Stores methods that are used within controllers.
 * @author Martin Vach
 */

// Angular module
var myAppService = angular.module('myAppService', []);

/**
 * Angular module initialization
 * @class dataService
 */
myAppService.service('dataService', function ($filter, $log, $cookies, $window, $location,cfg, cfgicons, _) {
    /// --- Public functions --- ///
    /**
     * Resets the fatal error object
     * @param {object} notifier
     * @returns {undefined}
     */
    this.resetFatalError = function () {
        if (cfg.route.fatalError.message && !cfg.route.fatalError.permanent) {
            angular.extend(cfg.route.fatalError, {
                type: 'system',// system|network
                message: false,
                info: false,
                permanent: false, // Permanently displayed
                hide: false, // Hide page content
                icon: 'fa-exclamation-triangle',
                icon_jamesbox: 'fa-spinner fa-spin'
            });
        }
    };

    /**
     * Check if access is allowed for the page
     * @param {object} next
     * @returns {undefined}
     */
    this.isAccessAllowed = function (next) {
        if (next.requireLogin) {
            var user = this.getUser();
            if (!user) {
                $location.path('/');
                return;
            }
            if (next.roles && angular.isArray(next.roles)) {
                if (next.roles.indexOf(user.role) === -1) {
                    $location.path('/error403');
                    return;
                }
            }
        }
    };

    /**
     * Set timestamp and ping server if request fails
     * @param {object} next
     * @returns {undefined}
     */
    this.setTimeStamp = function () {
       /* dataFactory.getApi('timezone', null, true).then(function (response) {

        }, function (error) {});*/
    };

    /**
     * Get a language string by key
     * @param {string} key
     * @param {object} languages
     * @param {object} replacement
     * @returns {unresolved}
     */
    this.getLangLine = function (key, languages, replacement) {
        return getLangLine(key, languages, replacement);
    };

    /**
     * Render alertify notifier
     * @param {object} notifier
     * @returns {undefined}
     */
    this.showNotifier = function (notifier) {
        var param = _.defaults(notifier, {position: 'top-right', message: false, type: 'success', wait: 5});
        if (notifier.message) {
            alertify.set('notifier', 'position', 'top-right');
            alertify.notify(param.message, param.type, param.wait);
        }
    };


    /**
     * Log error in the console
     * @param {string} error
     * @param {string} message
     * @returns {undefined}
     */
    this.logError = function (error, message) {
        message = message || 'ERROR:';
        $log.error('---------- ' + message + ' ----------', error);
    };

    /**
     * Get OS (operating system)
     * @returns {String}
     */
    this.getOs = function () {
        if (navigator && navigator.userAgent && navigator.userAgent != null) {
            var agents = ['android', 'iemobile', 'iphone', 'ipad', 'ipod', 'opera mini', 'blackberry'];
            var ua = navigator.userAgent.toLowerCase();
            for (var i in agents) {
                if (ua.match('/' + agents[i] + '/i')) {
                    return agents[i];
                }
            }
            return 'any';
        }
        return 'any';
    };

    /**
     * Get OS (operating system)
     * @returns {String}
     */
    this.isIeEdge = function () {
        var isIE = /*@cc_on!@*/false || !!document.documentMode;
        if (isIE) {
            return true;
        }
        // Edge 20+
        var isEdge = !isIE && !!window.StyleMedia;
        if (isEdge) {
            return true;
        }
        return false;
    };


    /**
     * Detect a mobile device
     * @param {string} a
     * @returns {Boolean}
     */
    this.isMobile = function (a) {
        if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) {
            return true;
        } else {
            return false;
        }
    };

    /**
     * Window history go back
     * @returns {undefined}
     */
    this.goBack = function () {
        window.history.back();
    };


    /**
     * Get user data from cookies
     * @returns {Array|Boolean}
     */
    this.getUser = function () {
        var user = ($cookies.user !== 'undefined' ? angular.fromJson($cookies.user) : false);
        return user;
    };

    /**
     * Set user data
     * @param {object} data
     * @returns {Boolean|Object}
     */
    this.setUser = function (data) {
        if (!data) {
            delete $cookies['user'];
            return false;
        }
        $cookies.user = angular.toJson(data);
        return data;
    };

    /**
     * Unset user data - delete user cookies
     * @returns {undefined}
     */
    this.unsetUser = function () {
        this.setUser(null);
        this.setZWAYSession(null);
    };

    /**
     * Get ZWAY session
     * @returns {string}
     */
    this.getZWAYSession = function () {
        return $cookies.ZWAYSession;
    };
    /**
     * Set ZWAY session
     * @param {string} sid
     * @returns {Boolean|Object}
     */
    this.setZWAYSession = function (sid) {
        if (!sid) {
            delete $cookies['ZWAYSession'];
            return false;
        }
        $cookies.ZWAYSession = sid;
    };
    /**
     * Get last login info
     * @returns {Sring|Boolean}
     */
    this.getLastLogin = function () {
        return $cookies.lastLogin !== 'undefined' ? $cookies.lastLogin : false;
    };

    /**
     * Set last login
     * @param {string} val
     * @returns {undefined}
     */
    this.setLastLogin = function (val) {
        $cookies.lastLogin = val;
    };

    /**
     * Get remember me
     * @returns {Object|Boolean}
     */
    this.getRememberMe = function () {
        var user = ($cookies.rememberme !== 'undefined' ? angular.fromJson($cookies.rememberme) : false);
        return user;
    };

    /**
     * Set remember me
     * @param {object} data
     * @returns {Boolean|Object}
     */
    this.setRememberMe = function (data) {
        if (!data) {
            delete $cookies['rememberme'];
            return false;
        }
        $cookies.rememberme = angular.toJson(data);
        return data;
    };

    /**
     * Logout from the system
     * @returns {undefined}
     */
    this.logOut = function () {
        this.setUser(null);
        this.setZWAYSession(null);
        $window.location.href = '#/?logout';
        $window.location.reload();

    };

    /**
     * Build a new file name without invalid chars
     * @param {string} fileName
     * @returns {string}
     */
    this.uploadFileNewName = function (fileName) {
        var name = fileName.split('.').slice(0, -1).join('.');
        return $filter('stringToSlug')(name) + '.' + $filter('fileExtension')(fileName);


    };

    /**
     * Assign an icon to the element
     * @param {object} element
     * @returns {string}
     */
    this.assignElementIcon = function (element) {
        return assignElementIcon(element);


    };

    /**
     * Get devices -  filtered data from devices dataholder
     * @param {object} data
     * @param {boolean} showHidden
     * @returns {unresolved}
     */
    this.getDevicesData = function (data, showHidden, showAll) {
        var user = this.getUser();
        return _.chain(data)
            .flatten()
            .uniq(false, function (v) {
                return v.id;
            })
            .reject(function (v) {
                if (showAll) {
                    return (v.deviceType === 'battery');
                } else if (showHidden) {
                    return (v.deviceType === 'battery') || (v.permanently_hidden === true);
                } else {
                    return (v.deviceType === 'battery') || (v.permanently_hidden === true) || (v.visibility === false);
                }

            })
            .filter(function (v) {
                var minMax;
                var yesterday = (Math.round(new Date().getTime() / 1000)) - (24 * 3600);
                var isNew = v.creationTime > yesterday ? true : false;
                // Create min/max value
                if (cfg.knob_255.indexOf(v.probeType) > -1) {
                    minMax = {min: 0, max: 255, step: 1};
                } else if (v.deviceType === 'thermostat') {
                    minMax = (v.metrics.scaleTitle === '°F' ? {min: 41, max: 104, step: 1} : {
                        min: 5,
                        max: 40,
                        step: 0.5
                    });
                } else {
                    minMax = {min: 0, max: 99, step: 1};
                }
                // Limit min/max with device metrics
                if (typeof(v.metrics.max) !== 'undefined') {
                    minMax.max = v.metrics.max;
                }
                if (typeof(v.metrics.min) !== 'undefined') {
                    minMax.min = v.metrics.min;
                }
                if (typeof(v.metrics.step) !== 'undefined') {
                    minMax.step = v.metrics.step;
                }
                angular.extend(v,
                    {onDashboard: (user.dashboard.indexOf(v.id) !== -1 ? true : false)},
                    {creatorId: _.isString(v.creatorId) ? v.creatorId.replace(/[^0-9]/g, '') : v.creatorId},
                    {minMax: minMax},
                    {hasHistory: (v.hasHistory === true ? true : false)},
                    {imgTrans: false},
                    {isNew: isNew},
                    {iconPath: assignElementIcon(v)},
                    {updateCmd: (v.deviceType === 'switchControl' ? 'on' : 'update')}
                );
                if (v.metrics.color) {
                    angular.extend(v.metrics, {rgbColors: 'rgb(' + v.metrics.color.r + ',' + v.metrics.color.g + ',' + v.metrics.color.b + ')'});
                }
                if (v.metrics.level) {
                    angular.extend(v.metrics, {level: $filter('numberFixedLen')(v.metrics.level)});
                }
                if (v.metrics.scaleTitle) {
                    angular.extend(v.metrics, {scaleTitle: getLangLine(v.metrics.scaleTitle)});
                }
                return v;
            });
    };

    /**
     * Get an object with element icons
     * @param {object} element
     * @returns {object}
     */
    this.getSingleElementIcons = function (element) {
        var icons = {
            default: {
                default: 'placeholder.png'
            },
            custom: {}
        };
        var iconKey = $filter('hasNode')(element, 'metrics.icon');
        // Set custom icons
        if (_.size(element.customIcons) > 0) {
            icons.custom = (element.customIcons.level ?element.customIcons.level : element.customIcons);
        }
        // Set default icons by metrics.icon
        if (iconKey && iconKey !== '') {
            if ((/^https?:\/\//.test(iconKey))) { // If icon is the url (weather) then custom icons are not allowed
                icons = {};
            } else if ((/\.(png|gif|jpe?g)$/).test(iconKey)) {
                if (iconKey.indexOf('/') > -1) {// If an icon is the sytem icon then custom icons are not allowed
                    icons = {};
                } else {
                    icons.default.default = iconKey;
                }
            } else {
                if (cfgicons.element.icon[iconKey]) {
                    icons.default = setDefaultIcon(cfgicons.element.icon[iconKey]);
                    //console.log(icons.default)
                }

            }

        }
        // Set default icons by deviceType
        else {
            if (cfgicons.element.deviceType[element.deviceType]) {
                icons.default = setDefaultIcon(cfgicons.element.deviceType[element.deviceType]);
            }
        }

        // Build an object with default icons
        function setDefaultIcon(obj) {
            var ret = {};
            // Has level icons?
            if (obj.level) {
                return obj.level;
                /*ret['level'] = obj.level;
                return ret;*/
            }
            return obj;


        }
        ;
        return icons;

    };

    /**
     * Get rooms - filtered data from locations dataholder
     * @param {object} data
     * @returns {unresolved}
     */
    this.getRooms = function (data) {
        return _.chain(data)
            .flatten()
            .filter(function (v) {
                v.title = (v.id === 0 ? getLangLine(v.title) : v.title);
                v.img_src = 'storage/img/placeholder-img.png';
                if (v.id === 0) {
                    v.img_src = 'storage/img/rooms/unassigned.png';
                } else if (v.img_type === 'default' && v.default_img) {
                    v.img_src = 'storage/img/rooms/' + v.default_img;
                } else if (v.img_type === 'user' && v.user_img) {
                    v.img_src = cfg.server_url + cfg.api_url + 'load/image/' + v.user_img;
                }
                return v;
            });

    };

    /**
     * Get local skins - filtered data from skin dataholder
     * @param {object} data
     * @returns {unresolved}
     */
    this.getLocalSkins = function (data) {
        return _.chain(data)
            .flatten()
            .filter(function (v) {
                // Set icon path
                var screenshotPath = v.name !== 'default' ? cfg.skin.path + v.name + '/' : cfg.img.skin_screenshot;
                v.icon = (!v.icon ? 'storage/img/placeholder-img.png' : screenshotPath + 'screenshot.png');
                return v;
            });
    };

    /**
     * Get zwave products - filtered data from devices dataholder
     * @param {object} data
     * @returns {unresolved}
     */
    this.getZwaveProducts = function (data, lang) {
        lang = cfg.zwaveproducts_langs.indexOf(lang) > -1 ? lang.toUpperCase() : cfg.lang.toUpperCase();
        return _.chain(data)
            .flatten()
            .map(function (v) {
                return {
                    id: v.certification_ID,
                    name: v.Name,
                    productcode: v.product_code,
                    wake: v['wake_' + lang] || v['wake_EN'],
                    inc: v['inc_' + lang] || v['inc_EN'],
                    exc: v['exc_' + lang] || v['exc_EN'],
                    brandname: v.brandname,
                    brandid: v.brandid,
                    brand_image: (v.brandname_image ? cfg.img.zwavevendors + v.brandname_image : false),
                    product_image: (v.certification_ID ? cfg.img.zwavedevices + v.certification_ID + '.png' : false),
                    prep: v['prep_' + lang] || v['prep_EN'],
                    inclusion_type: (v.inc_type === 'secure' ? v.inc_type : 'unsecure'),
                    zwplus: v.zwplus,
                    frequencyid: v.frequencyid,
                    frequency: v.frequency,
                    ignore_ui: v.ignore_ui,
                    reset: v['ResetDescription_' + lang] || v['ResetDescription_EN']

                };
            });
    };

    /**
     * Renders the chart data
     * @param {object} data
     * @param {object} colors
     * @returns {Object|NULL}
     */
    this.getChartData = function (data, colors) {
        if (!angular.isObject(data, colors)) {
            return null;
        }
        var currTime = (Math.round(+new Date() / 1000) - 86400);
        var out = {
            labels: [],
            datasets: [{
                fillColor: colors.fillColor,
                strokeColor: colors.strokeColor,
                pointColor: colors.pointColor,
                pointStrokeColor: colors.pointStrokeColor,
                data: []
            }]
        };
        var cnt = 0;
        angular.forEach(data, function (v, k) {
            cnt++;
            var time = $filter('date')(((v.id) * 1000), 'H:mm');
            //if (v.id > currTime && out.labels.indexOf(time) === -1) {
            //if (v.id > currTime && (cnt % 2)) {
            if (v.id > currTime && (cnt % 2) === 0) {
                out.labels.push(time);
                //out.labels.push($filter('date')(v.timestamp,'dd.MM.yyyy H:mm'));
                out.datasets[0].data.push(v.l);
            }

        });
        if (out.datasets[0].data.length > 0) {
            return out;
        }
        return null;
    };

    /**
     * Renders Alpaca module data
     * @param {object} module
     * @param {object} data
     * @returns {unresolved}
     */
    this.getModuleFormData = function (module, data) {
        return getModuleFormData(module, data);
    };

    /**
     * Renders module config data
     * @param {object} module
     * @param {string} params
     * @param {object} namespaces
     * @returns {unresolved}
     */
    this.getModuleConfigInputs = function (module, params, namespaces) {
        return getModuleConfigInputs(module, params, namespaces);
    };

    /**
     *
     * @param {object} data
     * @param {string} key
     * @param {boolean} add
     * @returns {Array}
     */
    this.setArrayValue = function (data, key, add) {
        if (add) {
            return addArrayValue(data, key);
        } else {
            return removeArrayValue(data, key);
        }
    };

    /**
     * Get event level
     * @param {object} data
     * @param {array} set
     * @returns {unresolved}
     */
    this.getEventLevel = function (data, set) {
        var collection = (set ? set : []);
        angular.forEach(data, function (v, k) {
            collection.push({
                'key': v.level,
                'val': v.level
            });
        });

        return $filter('unique')(collection, 'key');
    };

    /**
     * Renders EnOcean profile
     * @param {object} data
     * @returns {unresolved}
     */
    this.setEnoProfile = function (data) {
        var profile = {};
        angular.forEach(data, function (v, k) {
            var profileId = parseInt(v._rorg, 16) + '_' + parseInt(v._func, 16) + '_' + parseInt(v._type, 16);
            profile[profileId] = v;
            profile[profileId]['id'] = profileId;
            profile[profileId]['rorgInt'] = parseInt(v._rorg, 16);
            profile[profileId]['funcInt'] = parseInt(v._func, 16);
            profile[profileId]['typeInt'] = parseInt(v._type, 16);
        });
        return profile;
    };

    /**
     * Compare whether two versions of a resource are the same
     * @param {string} v1
     * @param {string} v2
     * @returns {Boolean}
     */
    this.compareVersions = function (v1, v2) {
        var status = 'equal';
        if (!v1 || !v2) {
            return 'error';
        }
        v1 = v1.toString().split('.'),
            v2 = v2.toString().split('.');

        for (var i = 0; i < v1.length; i++) {
            if ((parseInt(v1[i], 10) < parseInt(v2[i], 10)) || ((parseInt(v1[i], 10) <= parseInt(v2[i], 10)) && (!v1[i + 1] && v2[i + 1] && parseInt(v2[i + 1], 10) > 0))) {
                status = 'notequal';
                break;
            }
        }
        return status;
    };

    /// --- Private functions --- ///
    /**
     * Assign an icon to the element
     */
    function assignElementIcon(element) {
        var icon = cfg.img.icons + 'placeholder.png';
        var iconKey = $filter('hasNode')(element, 'metrics.icon');
        // Assign icon by metrics.icon
        var iconArray = setIcon(cfgicons.element.icon[iconKey], element.customIcons || {});
        /**
         * Set icons by deviceType
         */
        switch (element.deviceType) {
            // switchControl
            case 'switchControl':
                //icon = iconArray.default;
                iconArray = setIcon(cfgicons.element.deviceType['switchControl'], element.customIcons || {});
                return iconArray.default;
            // default
            default:
                break;
        }
        /**
         * Set icons by metrics.icon
         */
        // The icon has a full path
        if ((/^https?:\/\//.test(iconKey))) {
            return iconKey;
        } else if ((/\.(png|gif|jpe?g)$/).test(iconKey)) {
            if (iconKey.indexOf('/') > -1) {
                return iconKey;
            } else {
                return cfg.img.icons + iconKey;
            }
        }

        if (!iconArray) {
            // set default
            return icon;
        }
        switch (iconKey) {
            // door
            case 'door':
                icon = (element.metrics.level === 'open' || element.metrics.level === 'on' ? iconArray.open : iconArray.closed);
                break;
            // window
            case 'window':
                if (typeof (element.metrics.level) === 'number') {
                    if (element.metrics.level === 0) {
                        icon = iconArray.down;
                    } else if (element.metrics.level >= 99) {
                        icon = iconArray.up;
                    } else {
                        icon = iconArray.half;
                    }
                } else {
                    icon = (element.metrics.level === 'open' || element.metrics.level === 'on' ? iconArray.open : iconArray.closed);
                }
                break;
            // switch
            case 'switch':
                icon = (element.metrics.level === 'on' ? iconArray.on : iconArray.off);
                break;
            // motion
            case 'motion':
                icon = (element.metrics.level === 'on' ? iconArray.on : iconArray.off);
                break;
            // alarm
            case 'alarm':
                icon = (element.metrics.level === 'on' ? iconArray.on : iconArray.off);
                break;
            // CO alarm
            case 'CO_alarm':
                icon = (element.metrics.level === 'on' ? iconArray.on : iconArray.off);
                break;
            // tamper
            case 'tamper':
                icon = (element.metrics.level === 'on' ? iconArray.on : iconArray.off);
                break;
            // smoke
            case 'smoke':
                icon = (element.metrics.level === 'on' ? iconArray.on : iconArray.off);
                break;
            // blinds
            case 'blinds':
                if (element.metrics.level === 0) {
                    icon = iconArray.down;
                } else if (element.metrics.level >= 99) {
                    icon = iconArray.up;
                } else {
                    icon = iconArray.half;
                }
                break;
            // multilevel
            case 'multilevel':
                if (element.metrics.level === 0) {
                    icon = iconArray.off;
                } else if (element.metrics.level >= 99) {
                    icon = iconArray.on;
                } else {
                    icon = iconArray.half;
                }
                break;
            // gesture
            case 'gesture':
                icon = (iconArray[element.metrics.state] || iconArray['press']);
                break;
            // default
            default:
                icon = iconArray.default;
                break;
        }


        return icon;

    }
    /**
     * Build an object with icons
     * @param {object} defaultIcon
     * @param {object} customIcon
     * @returns {*}
     */
    function setIcon(defaultIcon, customIcon) {
        var obj = {};
        customIcon = customIcon.level || customIcon
        if (defaultIcon) {
            // If a custom icon exists set it otherwise set a default icon
            angular.forEach(defaultIcon.level || defaultIcon, function (v, k) {
                obj[k] = (customIcon[k] ? cfg.img.custom_icons + customIcon[k] : cfg.img.icons + v);
            });
            return obj;
        } else {
            // If a custom icon exists set it otherwise set false
            if(!_.isEmpty(customIcon.default)){
                obj['default'] = cfg.img.custom_icons + customIcon['default'];
                return obj;
            }
            return false;
        }

    }
    /**
     * Get a language string by key
     */
    function getLangLine(key, languages, replacement) {
        var line = key;
        if (angular.isObject(languages)) {
            if (angular.isDefined(languages[key])) {
                line = (languages[key] !== '' ? languages[key] : key);
            }
        } else {
            line = (cfg.route.t[key] || key);
        }
        return setLangLine(line, replacement);
    }

    /**
     * Set lang line params
     */
    function setLangLine(line, replacement) {
        for (var val in replacement) {
            line = line.split(val).join(replacement[val]);
        }
        return line;
    }

    /**
     * Renders Alpaca module data
     */
    function getModuleFormData(module, data) {
        var collection = {
            'options': replaceModuleFormData(module.options, ['click', 'onFieldChange']),
            'schema': module.schema,
            'data': data,
            'postRender': postRenderAlpaca
        };
        return collection;
    }

    /**
     * Replace module object
     */
    function replaceModuleFormData(obj, keys) {
        var objects = [];
        for (var i in obj) {
            if (!obj.hasOwnProperty(i))
                continue;
            if (typeof obj[i] == 'object') {
                objects = objects.concat(replaceModuleFormData(obj[i], keys));
            } else if (~keys.indexOf(i) && !angular.isArray(obj[i]) &&
                typeof obj[i] === 'string' &&
                obj[i].indexOf("function") === 0) {
                // overwrite old string with function                
                // we can only pass a function as string in JSON ==> doing a real function
                obj[i] = new Function('return ' + obj[i])();
            }
        }
        return obj;
    }

    /**
     * Add array value
     */
    function addArrayValue(data, key) {
        var collection = data;
        if (collection.indexOf(key) === -1) {
            collection.push(key);
        }
        return collection;
    }

    /**
     * Remove array value
     */
    function removeArrayValue(data, key) {
        var collection = [];
        angular.forEach(data, function (v, k) {
            if (v != key) {
                collection.push(v);
            }
        });
        return collection;
    }
});
