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
                , url;
        self.options = options || {};

        Util = {
            createOptions: function () {
                if (options) {
                    if (typeof options === 'string') {
                        url = urlParser.parse(options);
                        self.options.url = url.host;
                        self.options.protocol = (url.protocol.indexOf(':') === -1) ? url.protocol : url.protocol.substring(0, url.protocol.indexOf(':'));
                    } else if (typeof options === 'object') {
                        protocol = (options.protocol.indexOf(':') === -1) ? url.protocol : url.protocol.substring(0, url.protocol.indexOf(':'));
                    }
                }
            },
            handleResponse: function (res, content, callback) {
                callback(null, res, Buffer.concat(content));
            },
            send: function (url, method, data, callback) {
                var requestOptions = {
                    host: url,
                    hostname: '',
                    port: port,
                    method: method,
                    path: url.path,
                    headers: options.headers,
                    //auth: 
                    //agent: 
                    keepAlive: true
                };
                Request.execute(options, data, callback);
            }
        };

        Request = {
            execute: function (options, data, callback) {
                var buffer = [];
                var req = protocol.request(options
                        , function (res) {
                            res.on('data', function (chunk) {
                                buffer.push(new Buffer(chunk));
                            });
                            res.on('end', function () {
                                this.handleResponse(res, buffer, callback);
                            });
                        });
                req.on('error', function (error) {
                    callback(error);
                });
                if (data) {
                    req.write(data);
                }
                req.end();
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
            Util.send(url, 'DELETE', data, callback);
        };
    };
})();
