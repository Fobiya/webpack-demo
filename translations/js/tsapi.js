/** Polyfill for ES5 */
if (!Object.assign) {
    Object.defineProperty(Object, 'assign', {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function(target, firstSource) {
            'use strict';
            if (target === undefined || target === null) {
                throw new TypeError('Cannot convert first argument to object');
            }

            var to = Object(target);
            for (var i = 1; i < arguments.length; i++) {
                var nextSource = arguments[i];
                if (nextSource === undefined || nextSource === null) {
                    continue;
                }

                var keysArray = Object.keys(Object(nextSource));
                for (var nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex++) {
                    var nextKey = keysArray[nextIndex];
                    var desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
                    if (desc !== undefined && desc.enumerable) {
                        to[nextKey] = nextSource[nextKey];
                    }
                }
            }
            return to;
        }
    });
}

(function(global) {
    "use strict";
    var debug = false;

    /** --------------------------- Logger ------------------------------ */
    function log(msg) {
        if (debug) {
            console.log(msg);
        }
    }

    /** --------------------------- Params ------------------------------ */
    var defaultParams = {
        lang: 'en'
    };

    /** --------------------------- ResultCode --------------------------- */
    var ResultCode = {
        SUCCESS: 0,
        NOT_AUTH: 3,
        ALREADY_AUTH: 4,
        UNKNOWN_ERROR: 100,
        HTTP_REQUEST_ERROR: 101,
        CALLBACK_ERROR: 102
    };

    /** ------------------------- Observer ----------------------------------- */
    function Observer() {
        this._listenerList = [];
    }
    Observer.prototype = {
        subscribe: function(callback) {
            this._listenerList.push(callback);
        },

        broadcast: function() {
            for (var i = 0; i < this._listenerList.length; i++) {
                this._listenerList[i]();
            }
        }
    };

    /** -------------------------------- ReadyStack--------------------------- */
    function ReadyStack(readyList, callback) {
        Observer.apply(this, arguments);
        this.notified = false;
        this.list = [];

        if (Array.isArray(readyList)) {
            this.list = readyList;
        }
        this.subscribe(callback);

        if (!this.list.length) {
            this.notify();
        }
    }
    ReadyStack.prototype = Object.create(Observer.prototype);
    ReadyStack.prototype.constructor = ReadyStack;

    ReadyStack.prototype.pop = function(key) {
        this.list.splice(this.list.indexOf(key), 1);
        if (!this.list.length) {
            this.notify();
        }
    };
    ReadyStack.prototype.notify = function() {
        if (!this.notified) {
            this.notified = true;
            this.broadcast();
        }
    };

    /** --------------------------- Result ------------------------------- */
    /**
     * Result constructor
     * @constructor
     */
    function Result() {
        this.code = ResultCode.UNKNOWN_ERROR;
        this.message = 'Unknown error';
        this.data = {};
        this.errors = {};
    }
    Result.prototype = {
        getSuccess: function(data) {
            this.code = data.hasOwnProperty('code')? data.code : ResultCode.UNKNOWN_ERROR;
            this.message = data.hasOwnProperty('message')? data.message : 'Unknown error';
            this.data = data.hasOwnProperty('data')? Object.assign({}, data.data) : {};
            this.errors = data.hasOwnProperty('errors')? Object.assign({}, data.errors) : {};
            return this;
        },
        getError: function(code, message, data, errors) {
            this.code = code || this.code;
            this.message = message || this.message;
            this.data = data || this.data;
            this.errors = errors || this.errors;
            return this;
        }
    };

    /** --------------------------- Sender ------------------------------- */
    /**
     * Sender constructor
     * @constructor
     */
    function Sender() {
        this.options = {
            async: true,
            user: null,
            password: null
        };
    }
    Sender.prototype = {
        post: function(url, data, callback, requestParams) {
            return this._send('POST', url, data, callback, requestParams)
        },
        get: function(url, data, callback, requestParams) {
            return this._send('GET', url, data, callback, requestParams)
        },
        _send: function(method, url, data, callback, requestParams) {
            try {
                if (typeof callback !== 'function') {
                    return (new Result()).getError(ResultCode.CALLBACK_ERROR, 'Callback must be function');
                }
                requestParams = Object.assign({}, this.options, requestParams);
                data = data || new FormData();

                var xhr = this._getRequest();
                xhr.withCredentials = true;
                xhr.callback = function() {
                    if (this.status === 200) {
                        var response;
                        try {
                            response = JSON.parse(this.responseText);
                        } catch(e) {
                            log(e);
                            response = {};
                        }
                        callback((new Result()).getSuccess(response));
                    } else {
                        callback((new Result()).getError(ResultCode.HTTP_REQUEST_ERROR, 'Error http request'));
                    }
                };
                xhr.open(method, url, requestParams.async, requestParams.user, requestParams.password);
                xhr.send(data);
            } catch(e) {
                log(e);
                xhr.onerror();
            }
        },
        _getRequest: function() {
            var xhr = new XMLHttpRequest();

            xhr.onerror = function() {
                log('Error http request. Status: ' + this.status);
                this.callback.apply(this);
            };
            xhr.onload = function() {
                this.callback.apply(this);
            };

            return xhr;
        }
    };

    /** --------------------------- Controller ---------------------------- */
    /**
     * Controller constructor
     * @constructor
     */
    function Controller() {
        this.request = new Sender();
        this.requestParams = {
            method: 'POST',
            async: true
        };

        this.apiHost = '';
        this.apiDomain = '';
        this.apiSubDomain = 'jsback';

        this._init();
    }
    Controller.prototype = {
        _init: function() {

            var domain = (function(){
                var i=0,domain=document.domain,p=domain.split('.'),s='_gd'+(new Date()).getTime();
                while(i<(p.length-1) && document.cookie.indexOf(s+'='+s)==-1){
                   domain = p.slice(-1-(++i)).join('.');
                   document.cookie = s+"="+s+";domain="+domain+";";
                }
                document.cookie = s+"=;expires=Thu, 01 Jan 1970 00:00:01 GMT;domain="+domain+";";
                return domain;
             })();
            
            

            this.apiDomain = domain;
            // this.apiDomain = location.host.indexOf('www.') === 0 ? location.host.replace('www.', '') : location.host;
            this.apiHost = '//' + this.apiSubDomain + '.' + this.apiDomain + '/';
        },
        _convertToFormData: function(data) {
            if (data instanceof FormData) {
                return data;
            }

            var convert = function(formData, data, name) {
                if (typeof data === 'undefined') {
                    return;
                }
                if (typeof data === 'object') {
                    for (var key in data) {
                        if (data.hasOwnProperty(key)) {
                            convert(formData, data[key], key);
                        }
                    }
                } else {
                    formData.append(name, data.toString());
                }
            };
            var formData = new FormData();
            convert(formData, data);

            return formData;

        },
        send: function(path, data, callback, requestParams) {
            requestParams = Object.assign({}, this.requestParams, requestParams);
            data = this._convertToFormData(data);

            if (requestParams.method === 'GET') {
                return this.request.get(this.apiHost + path, data, callback, requestParams);
            }

            return this.request.post(this.apiHost + path, data, callback, requestParams);
        }
    };

    /** --------------------------- Site Controller --------------------- */
    /**
     * Country controller constructor
     * @constructor
     */
    function ControllerSite() {
        Controller.apply(this, arguments);
    }
    ControllerSite.prototype = Object.create(Controller.prototype);
    ControllerSite.prototype.constructor = ControllerSite;

    /**
     * Get country list with phone code
     * @example
     * window.TSAPI.site.callback(data, function(result) {});
     * @param {Object} data - Trader data
     * @param {string} data.fullname
     * @param {string} data.email
     * @param {string} data.phone -  regex(/^\+?[*_0-9\s\-\(\)\/\.]*\d+[*_0-9\s\-\(\)\/\.]*\d+[*_0-9\s\-\(\)\/\.]*\d+$/)
     * @param {string} data.country
     * @param {string} data.language - optional
     *
     * @param {responseApiCallback} callback - The callback that handles the response.
     */
    ControllerSite.prototype.callback = function(data, callback) {
        this.send('site/callback', data, callback);
    };

    /**
     * Contact us request
     * @example
     * window.TSAPI.site.contactUs(data, function(result) {});
     * @param {Object} data - Trader data
     * @param {string} data.fullname
     * @param {string} data.email
     * @param {string} data.phone -  regex(/^\+?[*_0-9\s\-\(\)\/\.]*\d+[*_0-9\s\-\(\)\/\.]*\d+[*_0-9\s\-\(\)\/\.]*\d+$/)
     * @param {string} data.topic
     * @param {string} data.message
     * @param {string} data.language - optional
     *
     * @param {responseApiCallback} callback - The callback that handles the response.
     */
    ControllerSite.prototype.contactUs = function(data, callback) {
        this.send('site/contact-us', data, callback);
    };

    /**
     * Get contact topics list
     * @example
     * window.TSAPI.site.getContactUsTopics(function(result) {
     *      console.log(result);
     *      // {code: 0, message: "Success", data: {"affiliation":"Affiliation","billing":"Billing",}, errors: Array(0)}
     * });
     * @param {responseApiCallback} callback - The callback that handles the response.
     */
    ControllerSite.prototype.getContactUsTopics = function(callback) {
        this.send('site/get-contact-us-topics', {}, callback);
    };

    ControllerSite.prototype.getSiteSetting = function(callback) {
        this.send('site/get-site-setting', {}, callback);
    };

    /** --------------------------- Country Controller --------------------- */
    /**
     * Country controller constructor
     * @constructor
     */
    function ControllerCountry() {
        Controller.apply(this, arguments);
    }
    ControllerCountry.prototype = Object.create(Controller.prototype);
    ControllerCountry.prototype.constructor = ControllerCountry;

    /**
     * Get all countries list
     * @example
     * window.TSAPI.country.fullList(function(result) {
     *      console.log(result);
     *      // {code: 0, message: "Success", data: {AF: "Afghanistan", AX: "Aland Islands",...}, errors: Array(0)}
     * });
     * @param {responseApiCallback} callback - The callback that handles the response.
     * @param {Object} data
     * @param {string} data.lang  - content language
     */
    ControllerCountry.prototype.fullList = function(callback, data) {
        data = data || {};
        var requestParams = {lang: typeof data.lang !== 'undefined' ? data.lang : defaultParams.lang};
        this.send('country/full-list', requestParams, callback);
    };

    /**
     * Get countries list allowed for any country type
     * @example
     * window.TSAPI.country.allowedList(function(result) {
     *      console.log(result);
     *      // {code: 0, message: "Success", data: {AF: "Afghanistan", AX: "Aland Islands",...}, errors: Array(0)}
     * });
     * @param {responseApiCallback} callback - The callback that handles the response.
     * @param {Object} data
     * @param {string} data.lang  - content language
     */
    ControllerCountry.prototype.allowedList = function(callback, data) {
        data = data || {};
        var requestParams = {lang: typeof data.lang !== 'undefined' ? data.lang : defaultParams.lang};
        this.send('country/allowed-list', requestParams, callback);
    };

    /**
     * Get countries list group by country type
     * @example
     * window.TSAPI.country.listByCountryTypes(function(result) {
     *      console.log(result);
     *      // {code: 0, message: "Success", data: {1:{AX: "Aland Islands", DZ: "Algeria"}, 2:{...},...}, errors: Array(0)}
     * });
     * @param {responseApiCallback} callback - The callback that handles the response.
     * @param {Object} data
     * @param {string} data.lang  - content language
     */
    ControllerCountry.prototype.listByCountryTypes = function(callback, data) {
        data = data || {};
        var requestParams = {lang: typeof data.lang !== 'undefined' ? data.lang : defaultParams.lang};
        this.send('country/list-by-country-types', requestParams, callback);
    };

    /**
     * Get country list with phone code
     * @example
     * window.TSAPI.country.listWithPhone(function(result) {
         *      console.log(result);
         *      // {code: 0, message: "Success", data: {AD:"376", AE:"971"}, errors: Array(0)}
         * });
     * @param {responseApiCallback} callback - The callback that handles the response.
     */
    ControllerCountry.prototype.listWithPhone = function(callback) {
        this.send('country/list-with-phone', {}, callback);
    };

    /** -------------------------- Trader Controller ------------------------- */
    /**
     * Trader controller constructor
     * @constructor
     */
    function ControllerTrader() {
        Controller.apply(this, arguments)
    }
    ControllerTrader.prototype = Object.create(Controller.prototype);
    ControllerTrader.prototype.constructor = ControllerTrader;

    ControllerTrader.prototype.registration = function(data, callback) {
        this.send('trader/registration', data, callback);
    };
    ControllerTrader.prototype.registrationIslamic = function(data, callback) {
        this.send('trader/registration-islamic', data, callback);
    };
    ControllerTrader.prototype.registrationMini = function(data, callback) {
        this.send('trader/registration-mini', data, callback);
    };
    ControllerTrader.prototype.login = function(data, callback) {
        this.send('trader/login', data, callback);
    };
    ControllerTrader.prototype.forceLogin = function(data, callback) {
        this.send('trader/force-login', data, callback);
    };
    ControllerTrader.prototype.forgotPassword = function(data, callback) {
        this.send('trader/forgot-password', data, callback);
    };
    ControllerTrader.prototype.changePassword = function(data, callback) {
        this.send('trader/change-password', data, callback);
    };
    ControllerTrader.prototype.updateAccount = function(data, callback) {
        this.send('trader/update-account', data, callback);
    };
    ControllerTrader.prototype.logout = function(callback) {
        this.send('trader/logout', {}, callback);
    };
    ControllerTrader.prototype.isGuest = function(callback) {
        this.send('trader/is-guest', {}, callback);
    };
    ControllerTrader.prototype.getInfo = function(callback) {
        this.send('trader/get-info', {}, callback);
    };
    ControllerTrader.prototype.withdrawalRequest = function(data, callback) {
        this.send('trader/withdrawal-request', data, callback);
    };
    ControllerTrader.prototype.getFeeIndexes = function(callback) {
        this.send('trader/get-fee-indexes', {}, callback);
    };
    ControllerTrader.prototype.uploadVerification = function(file, callback) {
        var data = new FormData();
        data.append('verificationFile', file);
        this.send('trader/upload-verification', data, callback);
    };

    /** -------------------------- User -------------------------------------- */
    /**
     * User constructor
     * @constructor
     */
    function User() {
        Object.defineProperty(this, 'isGuest', { value: null, enumerable: false, writable : true});
        Object.defineProperty(this, 'isReady', { value: false, enumerable: false, writable : true});

        this._refreshTraderInfoMilliseconds = null;
        this._refreshTraderInfoIntervalId = null;

        this._init();
    }
    User.prototype = {
        factory: {
            trader: new ControllerTrader(),
            observer: new Observer()
        },

        subscribe: function(callback) {
            this.factory.observer.subscribe(callback);
            if (this.isReady){
                this.factory.observer.broadcast();
            }
        },

        /**
         * Trader registration
         *
         * @example
         * window.TSAPI.user.registration({},function(result) {
         *      console.log(result);
         *      // {code: 0, message: "Success", data: {}, errors: Array(0)}
         * });
         *
         * @param {Object} data - Trader authorization data. Required
         * @param {string} data.fname - Trader first name. Required
         * @param {string} data.lname - Trader last name. Required
         * @param {string} data.country - Trader country code. Required
         * @param {string} data.phone - Trader phone. Required
         * @param {string} data.phoneCode - Trader phone code. Required
         * @param {string} data.email - Trader email. Required
         * @param {string} data.password - Trader password. Required
         * @param {string} data.confirmPassword - Trader confirmPassword. Required
         * @param {string} data.language - Trader language. Required
         * @param {string} data.clientTime - Trader clientTime. Required
         * @param {int} data.accept - Accept T&C. Required
         * @param {string} data.currency - Trader currency.
         *
         * @param {responseApiCallback} callback - The callback that handles the response.
         */
        registration: function(data, callback) {
            this.factory.trader.registration(data, this._afterRegistration.bind(this, callback));
        },

        /**
         * Trader registration islamic
         *
         * @example
         * window.TSAPI.user.registrationIslamic({},function(result) {
         *      console.log(result);
         *      // {code: 0, message: "Success", data: {}, errors: Array(0)}
         * });
         *
         * @param {Object} data - Trader authorization data. Required
         * @param {string} data.fname - Trader first name. Required
         * @param {string} data.lname - Trader last name. Required
         * @param {string} data.country - Trader country code. Required
         * @param {string} data.phone - Trader phone. Required
         * @param {string} data.phoneCode - Trader phone code. Required
         * @param {string} data.email - Trader email. Required
         * @param {string} data.password - Trader password. Required
         * @param {string} data.confirmPassword - Trader confirmPassword. Required
         * @param {string} data.language - Trader language. Required
         * @param {string} data.clientTime - Trader clientTime. Required
         * @param {int} data.accept - Accept T&C. Required
         * @param {string} data.currency - Trader currency.
         *
         * @param {responseApiCallback} callback - The callback that handles the response.
         */
        registrationIslamic: function(data, callback) {
            this.factory.trader.registrationIslamic(data, this._afterRegistration.bind(this, callback));
        },

        /**
         * Trader registration mini
         *
         * @example
         * window.TSAPI.user.registrationMini({},function(result) {
         *      console.log(result);
         *      // {code: 0, message: "Success", data: {}, errors: Array(0)}
         * });
         *
         * @param {Object} data - Trader authorization data. Required
         * @param {string} data.fullname - Trader full name. Required
         * @param {string} data.country - Trader country code. Required
         * @param {string} data.phone - Trader phone. Required
         * @param {string} data.email - Trader email. Required
         * @param {string} data.language - Trader language. Required
         * @param {int} data.accept - Accept T&C. Required
         *
         * @param {responseApiCallback} callback - The callback that handles the response.
         */
        registrationMini: function(data, callback) {
            this.factory.trader.registrationMini(data, this._afterRegistration.bind(this, callback));
        },

        /**
         * Trader login
         *
         * @example
         * window.TSAPI.user.login({username:'email@example.com',password:'password',rememberMe:'1'},function(result) {
         *      console.log(result);
         *      // {code: 0, message: "Success", data: {}, errors: Array(0)}
         * });
         *
         * @param {Object} data - Trader authorization data
         * @param {string} data.username - Trader email.
         * @param {string} data.password - Trader password.
         * @param {int} data.rememberMe - Remember user.
         *
         * @param {responseApiCallback} callback - The callback that handles the response.
         */
        login: function(data, callback) {
            this.factory.trader.login(data, this._afterLogin.bind(this, callback));
        },

        forceLogin: function(token, callback) {
            this.factory.trader.forceLogin({token: token}, this._afterLogin.bind(this, callback));
        },

        /**
         * Trader update account
         *
         * @example
         * window.TSAPI.user.updateAccount(data, function(result) {
         *      console.log(result);
         *      // {code: 0, message: "Success", data: {} errors: Array(0)}
         * });
         *
         * @param {Object} data - Trader authorization data. Required
         * @param {string} data.firstName - Trader first name. Required
         * @param {string} data.lastName - Trader last name. Required
         * @param {string} data.address - Trader address. Optional
         * @param {string} data.address2 - Trader address2. Optional
         * @param {string} data.town - Trader town. Optional
         * @param {string} data.postalCode - Trader postal code. Optional
         * @param {string} data.phone - Trader phone. Required
         * @param {string} data.cellphone - Trader cellphone. Optional
         * @param {string} data.birthday - Trader birthday. Optional format - php:Y-m-d'
         *
         * @param {responseApiCallback} callback - The callback that handles the response.
         */
        updateAccount: function(data, callback) {
            this.factory.trader.updateAccount(data, this._afterUpdateAccount.bind(this, callback));
        },

        /**
         * Trader forgot password
         *
         * @example
         * window.TSAPI.user.forgotPassword({email:'email@example.com'},function(result) {
         *      console.log(result);
         *      // {code: 0, message: "Success", data: {}, errors: Array(0)}
         * });
         *
         * @param {Object} data - Trader authorization data
         * @param {string} data.email - Trader email.
         *
         * @param {responseApiCallback} callback - The callback that handles the response.
         */
        forgotPassword: function(data, callback) {
            this.factory.trader.forgotPassword(data, callback);
        },

        /**
         * Trader change password
         *
         * @example
         * window.TSAPI.user.changePassword(
         *      // {
         *      //      currentPassword:'currentPassword',
         *      //      password:'password',
         *      //      confirmPassword:'password'
         *      // },
         *      // function(result) {
         *      //      console.log(result);
         *      //      {code: 0, message: "Success", data: {}, errors: Array(0)}
         *      // }
         * );
         *
         * @param {Object} data - Trader authorization data
         * @param {string} data.email - Trader email.
         *
         * @param {responseApiCallback} callback - The callback that handles the response.
         */
        changePassword: function(data, callback) {
            this.factory.trader.changePassword(data, callback);
        },

        /**
         * Trader logout
         *
         * @example
         * window.TSAPI.user.logout(function(result) {
         *      console.log(result);
         *      // {code: 0, message: "Success", data: {}, errors: Array(0)}
         * });
         *
         * @param {responseApiCallback} callback - The callback that handles the response.
         */
        logout: function(callback) {
            this.factory.trader.logout(this._afterLogout.bind(this, callback));
        },

        /**
         * Get trader info
         *
         * @example
         * window.TSAPI.user.reload(function(result) {
         *      console.log(result);
         *      // {code: 0, message: "Success", data: {
         *      //          firstName: "User",
         *      //          lastName: "Name",
         *      //          currency: "USD",
         *      //          currencySymbol: "$",
         *      //          currencyPrecision: 2,
         *      //          balance: "0.00",
         *      //          countryCode: "UA",
         *      //          deposited : false,
         *      //          autoVerificationStatus : 0
         *      //          this.deposited = false;
         *      //          address = '';
         *      //          address2 = '';
         *      //          town = '';
         *      //          postalCode = '';
         *      //          phone = '';
         *      //          cellphone = '';
         *      //          birthday = '';
         *      //          hashId : ''
         *      //      }, errors: Array(0)
         *      // }
         * });
         *
         * @param {responseApiCallback} callback - The callback that handles the response.
         */
        reload: function(callback) {
            this.factory.trader.getInfo(this._afterReload.bind(this, callback));
        },

        /**
         * Withdrawal request
         *
         * @example
         * window.TSAPI.user.withdrawalRequest(function(result) {
         *      console.log(result);
         *      // {code: 0, message: "Success", data: {}, errors: Array(0)}
         * });
         *
         * @param {Object} data - Withdrawal request data
         * @param {string} data.amount - Amount.
         *
         * @param {responseApiCallback} callback - The callback that handles the response.
         */
        withdrawalRequest: function(data, callback) {
            this.factory.trader.withdrawalRequest(data, callback);
        },

        /**
         * Get fee indexes for trader
         *
         * @example
         * window.TSAPI.user.getFeeIndexes(function(result) {
         *      console.log(result);
         *      // {code: 0, message: "Success", data: {
         *      //  minAmount:int, maintenance:int, withdrawal:{feeEnabled:bool, min:int, max:int, percentage:float}
         *      // }, errors: Array(0)}
         * });
         *
         * @param {responseApiCallback} callback - The callback that handles the response.
         */
        getFeeIndexes: function(callback) {
            this.factory.trader.getFeeIndexes(callback);
        },

        /**
         * Upload file to verify trader's account
         *
         * @example
         * window.TSAPI.user.uploadVerification(document.getElementById('fileInputId').files[0], function(result) {
         *      console.log(result);
         *      // {code: 0, message: "Success", data: {}, errors: Array(0)}
         * });
         *
         * @param {Object} data - File object
         *     e.g.: document.getElementById('fileInputId').files[0] - to get uploaded file from exact <input type="file" id="fileInputId">
         *
         * @param {responseApiCallback} callback - The callback that handles the response.
         */
        uploadVerification: function(data, callback) {
            this.factory.trader.uploadVerification(data, callback);
        },

        /**
         * Start updating trader info
         *
         * @example
         * window.TSAPI.user.startRefreshTraderInfo(function(result) {
         *      console.log(result);
         * });
         *
         * @param {int} seconds
         */
        startRefreshTraderInfo: function(seconds) {
            this._refreshTraderInfoMilliseconds = seconds * 1000;

            return this._refreshTraderInfo();
        },

        _init: function() {
            this._setDefaultTraderInfo();
            this.reload();
        },

        _afterReload: function(callback, result) {
            if (result.code === ResultCode.SUCCESS) {
                this._switchToTraderMode(result);
            } else {
                this._switchToGuestMode();
            }

            if (typeof callback === 'function') {
                callback(result);
            }

            this._ready();
        },

        _afterLogin: function(callback, result) {
            if (result.code === ResultCode.SUCCESS) {
                this._switchToTraderMode(result);
            }

            if (typeof callback === 'function') {
                callback(result);
            }
        },

        _afterRegistration: function(callback, result) {
            this._afterLogin(callback, result);
        },

        _afterLogout: function(callback, result) {
            if (result.code === ResultCode.SUCCESS) {
                this._switchToGuestMode();
            }

            if (typeof callback === 'function') {
                callback(result);
            }
        },

        _afterUpdateAccount: function(callback, result) {
            if (result.code === ResultCode.SUCCESS) {
                this._setTraderInfo(result);
            }

            if (typeof callback === 'function') {
                callback(result);
            }
        },

        _setTraderInfo: function(result) {
            var prop = Object.keys(this);
            for (var key = 0; key < prop.length; key++) {
                if (typeof result.data[prop[key]] !== 'undefined') {
                    this[prop[key]] = result.data[prop[key]];
                }
            }
        },

        _setDefaultTraderInfo: function() {
            this.firstName = '';
            this.lastName = '';
            this.email = '';
            this.currency = '';
            this.currencySymbol = '';
            this.currencyPrecision = 2;
            this.balance = 0;
            this.countryCode = '';
            this.autoVerificationStatus = 0;
            this.deposited = false;
            this.address = '';
            this.address2 = '';
            this.town = '';
            this.postalCode = '';
            this.phone = '';
            this.cellphone = '';
            this.birthday = '';
            this.hashId = '';
        },

        _ready: function() {
            if (!this.isReady) {
                this.isReady = true;
                this.factory.observer.broadcast();
            }
        },

        _switchToGuestMode: function() {
            this.isGuest = true;
            this._setDefaultTraderInfo();
            this._stopRefreshTraderInfo();
        },

        _switchToTraderMode: function(result) {
            this.isGuest = false;
            this._setTraderInfo(result);
            this._refreshTraderInfo();
        },

        /**
         * @returns {boolean}
         */
        _refreshTraderInfo: function() {

            if (this._refreshTraderInfoIntervalId || !this._refreshTraderInfoMilliseconds) {
                return false;
            }

            this._refreshTraderInfoIntervalId = setInterval(
                function() {
                    this.reload();
                }.bind(this),
                this._refreshTraderInfoMilliseconds
            );

            return true;
        },

        _stopRefreshTraderInfo: function() {
            clearInterval(this._refreshTraderInfoIntervalId);
            this._refreshTraderInfoIntervalId = null;
        }
    };

    /** -------------------------- API --------------------------------------- */
    /**
     * Callback for updating a workflow
     *
     * @callback responseApiCallback
     * @param {Object} result
     * @param {int} result.code - Request status code.
     * @param {string} result.message - Request status message.
     * @param {Object} result.data - Response result data.
     */
    /**
     * @constructor
     * @property {object} user
     * @property {object} country
     * @property {object} site
     * @property {object} siteSetting
     */
    function TSAPI() {
        this._isReady = false;
        this._readyStack = new ReadyStack(['_afterGetSiteSetting', '_userIsReady'], _ready.bind(this));
        this._observer = new Observer();

        this.user = new User();
        this.country = new ControllerCountry();
        this.site = new ControllerSite();

        this.siteSetting = {
            platformLink: '',
            depositLink: '',
            nodeConnectLink: '',
            refreshTraderInfoSeconds: '',
        };
        _init.call(this);

        /**
         * @private
         * @this TSAPI
         */
        function _init () {
            this.user.subscribe(_userIsReady.bind(this));
            this.site.getSiteSetting(_afterGetSiteSetting.bind(this));
        }

        /**
         * @private
         * @this TSAPI
         */
        function _userIsReady() {
            this._readyStack.pop('_userIsReady');
        }

        /**
         * @private
         * @this TSAPI
         * @param {Object} result - Site data
         */
        function _afterGetSiteSetting(result) {
            if (result.code === ResultCode.SUCCESS) {
                _setSiteSetting.call(this, result);
                this.user.startRefreshTraderInfo(result.data.refreshTraderInfoSeconds);
            }
            this._readyStack.pop('_afterGetSiteSetting');
        }

        /**
         * @private
         * @this TSAPI
         * @param {Object} result - Site data
         */
        function _setSiteSetting(result) {
            var prop = Object.keys(this.siteSetting);
            for (var key = 0; key < prop.length; key++) {
                if (typeof result.data[prop[key]] !== 'undefined') {
                    this.siteSetting[prop[key]] = result.data[prop[key]];
                }
            }
        }

        /**
         * @private
         * @this TSAPI
         */
        function _ready() {
            if (!this._isReady) {
                this._isReady = true;
                this._observer.broadcast();
            }
        }
    }

    TSAPI.prototype = {

        /**
         * TSAPI is ready
         * @example
         * window.TSAPI.ready(function() {
         *      // Here is your code to work with api
         * });
         * @param {responseApiCallback} callback - The callback that handles the response.
         */
        ready: function(callback) {
            this._observer.subscribe(callback);
            if (this._isReady) {
                this._observer.broadcast();
            }
        }
    };

    global.TSAPI = new TSAPI();
})(window);