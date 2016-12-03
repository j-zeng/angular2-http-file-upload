# angular2-http-file-upload
Library to support http file uploads for Angular 2


// my-upload-item.ts
```
import { UploadItem }    from 'angular2-http-file-upload';

export class MyUploadItem extends UploadItem {
    constructor(file: any) {
        super();
        this.url = 'https://your.domain.here/your.endpoint';
        this.headers = { HeaderName: 'Header Value', AnotherHeaderName: 'Another Header Value' };
        this.file = file;
    }
}
```


// example.component.ts
```
import { Uploader }      from 'angular2-http-file-upload';
import { MyUploadItem }  from './my-upload-item';

@Component({
    // your component meta data here...
})
export class ExampleComponent {
    constructor(public uploaderService: Uploader) { }

    submit() {
        let myUploadItem = new MyUploadItem((<HTMLInputElement>window.document.getElementById('myFileInputField')).files[0]);
        this.uploaderService.onSuccessUpload = () => {
             // success callback
        }
        this.uploaderService.onError = () => {
             // error callback
        }
        this.uploaderService.onCompleteUpload = () => {
             // complete callback, called regardless of success or failure
        }
        this.uploaderService.upload(myUploadItem);
    }
}
```