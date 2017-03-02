export class UploadItem {
    public method: string = 'POST';
    public url: string = '';
    public headers: any = {};
    public formData: any = {};
    public withCredentials = false;
    public alias: string = 'file';
    public file: any = {};
}
