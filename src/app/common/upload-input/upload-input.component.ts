import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { uploadImgField, uploadImgURL } from '../../config';

@Component({
  selector: 'app-upload-input',
  templateUrl: './upload-input.component.html',
  styleUrls: ['./upload-input.component.css']
})
export class UploadInputComponent implements OnInit {

  @Output() uploadImgSuccess = new EventEmitter<string>();

  public inputValue: string = "";

  public uploadImgField: string = uploadImgField;

  public uploadImgURL: string = uploadImgURL;

  constructor() { }

  ngOnInit() {
  }

  public handleUploadImg(dataInfo) {
    const { response, status } = dataInfo.file;
    if (status === 'done' && response && response.status === 200) {
      this.inputValue = response.data[0];
      this.uploadImgSuccess.emit(this.inputValue);
    }
  }
}
