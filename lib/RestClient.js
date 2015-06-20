(function () {
    var http = require('http')
            , https = require('https')
            , qs = require('querystring')
            , urlParser = require('url');

    module.exports = function (options) {
        var self = this
                , protocol
                , Util
                , Request
                , configOptions
                , url;
        self.options = options || {};

        Util = {
            createOptions: function (url, method) {
                var config = {};
                if (url) {
                    if (typeof url === 'string') {
                        url = urlParser.parse(url);
                        config.hostname = url.hostname;
                        config.path = url.path;
                        config.port = url.port;
                        config.auth = url.auth;
                        config.method = method;
                        config.protocol = url.protocol;
                        config.agent = false;
                    }
                }
                return config;
            },
            handleResponse: function (res, content, callback) {
                var response = {
                    headers: res.headers,
                    data: JSON.parse(Buffer.concat(content).toString())
                };

                callback(null, response);
            },
            send: function (url, method, data, callback) {
                configOptions = this.createOptions(url, method);
                Request.execute(configOptions, data, callback);
            }
        };

        //Create object for manage request
        Request = {
            execute: function (options, data, callback) {
                var buffer = [];
                protocol = (options.protocol === 'http' || options.protocol === 'http:') ? http : https;
                if(!options.headers) {
                options.headers={
                    'Content-Type': 'application/json',
                    'Content-Length':(JSON.stringify(data)).length
                };
                }
                console.log(options);
                var req = protocol.request(options
                        , function (res) {
                            res.on('data', function (chunk) {
                                buffer.push(new Buffer(chunk));
                            });
                            res.on('end', function () {
                                Util.handleResponse(res, buffer, callback);
                            });
                        });
                req.on('error', function (error) {
                    callback(error);
                });
                //if (Object.keys(data).length>0) {
                    req.write(JSON.stringify(data));
                //}
                req.end(JSON.stringify(data));
            }
        };

        /**
         * Execute all request
         * @param <string> url
         * @param <string> method
         * @param <object> args      {data:{id:10},headers:{'content-type':'application/json'}}
         * @param <function> callback
         * @returns {undefined}
         */
        self.send = function (url, method, args, callback) {
            var config = {}
            , data
                    , headers;
            data = args.data || {};
            headers = args.headers || {};
            if (url) {
                if (typeof url === 'string') {
                    url = urlParser.parse(url);
                    config.host = url.host;
                    config.path = url.path;
                    config.port = url.port;
                    config.auth = url.auth;
                    config.headers = headers;
                    config.method = method.toLowerCase();
                    config.protocol = (url.protocol.indexOf(':') === -1) ? url.protocol : url.protocol.substring(0, url.protocol.indexOf(':'));
                    Request.execute(config, data, callback);
                } else {
                    callback(new Error('Invalid url'));
                }
            }
        };

        /**
         * Send get request method to url
         * @param <Mixed> url
         * @param <Mixed> data
         * @param <function> callback
         * @returns {undefined}
         */
        self.get = function (url, data, callback) {
            if (typeof data === 'function') {
                callback = data;
                data = {};
            }
            Util.send(url, 'GET', data, callback);
        };

        /**
         * Send post request method to url
         * @param <Mixed> url
         * @param <Mixed> data
         * @param <function> callback
         * @returns {undefined}
         */
        self.post = function (url, data, callback) {
            data = data || {};
            Util.send(url, 'POST', data, callback);
        };

        /**
         * Send put request method to url
         * @param <Mixed> url
         * @param <Mixed> data
         * @param <function> callback
         * @returns {undefined}
         */
        self.put = function (url, data, callback) {
            data = data || {};
            Util.send(url, 'PUT', data, callback);
        };

        /**
         * Send delete  request method to url
         * @param <Mixed> url
         * @param <Mixed> data
         * @param <function> callback
         * @returns {undefined}
         */
        self.delete = function (url, data, callback) {
            data = data || {};
            Util.send(url, 'DELETE', data, callback);
        };
    };
})();
