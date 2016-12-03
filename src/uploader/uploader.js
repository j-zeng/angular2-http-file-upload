"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var Uploader = (function () {
    function Uploader() {
        this.onProgressUpload = function (item, progress) { };
        this.onCompleteUpload = function (item, response, status, headers) { };
        this.onSuccessUpload = function (item, response, status, headers) { };
        this.onErrorUpload = function (item, response, status, headers) { };
        this.onCancelUpload = function (item, response, status, headers) { };
    }
    Uploader.prototype.upload = function (item) {
        if (this.isHTML5()) {
            this.xhrTransport(item);
        }
        else {
            this.onErrorUpload(item, 'Unsupported browser.', null, null);
        }
    };
    Uploader.prototype.isHTML5 = function () {
        return !!(window.File && window.FormData);
    };
    Uploader.prototype.xhrTransport = function (item) {
        var _this = this;
        var xhr = new window.XMLHttpRequest();
        var form = new window.FormData();
        this.forEach(item.formData, function (key, value) {
            form.append(key, value);
        });
        form.append(item.alias, item.file, item.file.name);
        xhr.upload.onprogress = function (event) {
            var progress = Math.round(event.lengthComputable ? event.loaded * 100 / event.total : 0);
            _this.onProgressUpload(item, progress);
        };
        xhr.onload = function () {
            var headers = _this.parseHeaders(xhr.getAllResponseHeaders());
            var response = _this.parseResponse(headers['Content-Type'], xhr.response);
            if (_this.isSuccessStatus(xhr.status)) {
                _this.onSuccessUpload(item, response, xhr.status, headers);
            }
            else {
                _this.onErrorUpload(item, response, xhr.status, headers);
            }
            _this.onCompleteUpload(item, response, xhr.status, headers);
        };
        xhr.onerror = function () {
            var headers = _this.parseHeaders(xhr.getAllResponseHeaders());
            var response = _this.parseResponse(headers['Content-Type'], xhr.response);
            _this.onErrorUpload(item, response, xhr.status, headers);
            _this.onCompleteUpload(item, response, xhr.status, headers);
        };
        xhr.onabort = function () {
            var headers = _this.parseHeaders(xhr.getAllResponseHeaders());
            var response = _this.parseResponse(headers['Content-Type'], xhr.response);
            _this.onCancelUpload(item, response, xhr.status, headers);
            _this.onCompleteUpload(item, response, xhr.status, headers);
        };
        xhr.open(item.method, item.url, true);
        xhr.withCredentials = item.withCredentials;
        this.forEach(item.headers, function (name, value) {
            xhr.setRequestHeader(name, value);
        });
        xhr.send(form);
    };
    Uploader.prototype.isSuccessStatus = function (status) {
        return (status >= 200 && status < 300) || status === 304;
    };
    Uploader.prototype.forEach = function (obj, callback) {
        for (var i in obj) {
            if (obj.hasOwnProperty(i)) {
                callback(i, obj[i]);
            }
        }
    };
    Uploader.prototype.parseHeaders = function (headers) {
        var dict = {};
        var lines = headers.split('\n');
        for (var i = 0; i < lines.length; i++) {
            var entry = lines[i].split(': ');
            if (entry.length > 1) {
                dict[entry[0]] = entry[1];
            }
        }
        return dict;
    };
    Uploader.prototype.parseResponse = function (contentType, response) {
        var parsed = response;
        if (contentType && contentType.indexOf('application/json') === 0) {
            try {
                parsed = JSON.parse(response);
            }
            catch (e) {
            }
        }
        return parsed;
    };
    Uploader = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], Uploader);
    return Uploader;
}());
exports.Uploader = Uploader;
//# sourceMappingURL=uploader.js.map