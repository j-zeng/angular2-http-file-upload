export class UploadItem {
    method: string = 'POST';
    url: string = '';
    headers: any = {};
    formData: any = {};
    withCredentials = false;
    alias: string = 'file';
    file: any = {};
}