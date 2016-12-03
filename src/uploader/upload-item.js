"use strict";
var UploadItem = (function () {
    function UploadItem() {
        this.method = 'POST';
        this.url = '';
        this.headers = {};
        this.formData = {};
        this.withCredentials = false;
        this.alias = 'file';
        this.file = {};
    }
    return UploadItem;
}());
exports.UploadItem = UploadItem;
//# sourceMappingURL=upload-item.js.map