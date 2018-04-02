import { Injectable }  from '@angular/core';

import { UploadItem }  from './upload-item';

@Injectable()
export class Uploader {
    onProgressUpload = (item: UploadItem, progress: number) => {};
    onCompleteUpload = (item: UploadItem, response: any, status: any, headers: any) => {};
    onSuccessUpload = (item: UploadItem, response: any, status: any, headers: any) => {};
    onErrorUpload = (item: UploadItem, response: any, status: any, headers: any) => {};
    onCancelUpload = (item: UploadItem, response: any, status: any, headers: any) => {};

    constructor() { }

    upload(item: UploadItem) {
        if(this.isHTML5()) {
            this.xhrTransport(item);
        } else {
            this.onErrorUpload(item, 'Unsupported browser.', null, null);
        }
    }

    private isHTML5(): boolean {
        return !!((<any>window).File && (<any>window).FormData);
    }

    private xhrTransport(item: UploadItem) {
        let xhr  = new (<any>window).XMLHttpRequest();
        let form = new (<any>window).FormData();

        this.forEach(item.formData, (key: string, value: any) => {
            form.append(key, value);
        });

        form.append(item.alias, item.file, item.file.name);

        xhr.upload.onprogress = (event: any) => {
            let progress = Math.round(event.lengthComputable ? event.loaded * 100 / event.total : 0);
            this.onProgressUpload(item, progress);
        };

        xhr.onload = () => {
            let headers = this.parseHeaders(xhr.getAllResponseHeaders());
            let response = this.parseResponse(headers['Content-Type'] || headers['content-type'], xhr.response);
            if(this.isSuccessStatus(xhr.status)) {
                this.onSuccessUpload(item, response, xhr.status, headers);
            } else {
                this.onErrorUpload(item, response, xhr.status, headers);
            }
            this.onCompleteUpload(item, response, xhr.status, headers);
        };

        xhr.onerror = () => {
            let headers = this.parseHeaders(xhr.getAllResponseHeaders());
            let response = this.parseResponse(headers['Content-Type'] || headers['content-type'], xhr.response);
            this.onErrorUpload(item, response, xhr.status, headers);
            this.onCompleteUpload(item, response, xhr.status, headers);
        };

        xhr.onabort = () => {
            let headers = this.parseHeaders(xhr.getAllResponseHeaders());
            let response = this.parseResponse(headers['Content-Type'] || headers['content-type'], xhr.response);
            this.onCancelUpload(item, response, xhr.status, headers);
            this.onCompleteUpload(item, response, xhr.status, headers);
        };

        xhr.open(item.method, item.url, true);

        xhr.withCredentials = item.withCredentials;

        this.forEach(item.headers, (name: string, value: string) => {
            xhr.setRequestHeader(name, value);
        });

        xhr.send(form);
    }

    private isSuccessStatus(status: number) {
        return (status >= 200 && status < 300) || status === 304;
    }

    private forEach(obj: any, callback: any) {
        for (var i in obj) {
            if (obj.hasOwnProperty(i)) {
                callback(i, obj[i]);
            }
        }
    }

    private parseHeaders(headers: string) {
        let dict = {};
        let lines = headers.split('\n');
        for (let i = 0; i < lines.length; i++) {
            let entry = lines[i].split(': ');
            if(entry.length > 1) {
                dict[entry[0]] = entry[1];
            }
        }
        return dict;
    }

    private parseResponse(contentType: string, response: string) {
        let parsed = response;
        if(contentType && contentType.indexOf('application/json') === 0) {
            try {
                parsed = JSON.parse(response);
            } catch(e) {
            }
        }
        return parsed;
    }
}
