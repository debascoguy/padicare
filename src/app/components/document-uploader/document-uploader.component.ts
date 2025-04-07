import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormatFileSizePipe } from '@app/core/pipes/format-file-size.pipe';
import { DragAndDropDirective } from '../file-uploader/DragAndDropDirective';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-document-uploader',
  imports: [
    CommonModule,
    MatIconModule,
    MatProgressBarModule,
    MatCardModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    FormatFileSizePipe,
    DragAndDropDirective
  ],
  templateUrl: './document-uploader.component.html',
  styleUrl: './document-uploader.component.scss'
})
export class DocumentUploaderComponent {

  @Output() documentUploaded = new EventEmitter<{ fileBase64: string | null, fileInfo: File|null }>();
  
  @Output() fileErrorMessage = new EventEmitter<string|null>();

  @Input() maxFileSizeSupported: number = 1048576 * 10; // 10MB

  @Input() supportedFileType: string = 'image/jpg,image/jpeg,image/gif,application/pdf';

  fileInfo: File|null = null;
  fileName: string = '';
  uploadInProgress: boolean = false;
  fileError: string|null = null;

  onFileDropped(files: FileList) {
    this.cancelUpload();
    this.fileInfo = files[0];
    this.uploadInProgress = true;
    let isError = false;
    if (this.fileInfo.size > this.maxFileSizeSupported) {
      isError = true;
      this.fileError = 'File size exceeds 10MB';
      this.fileErrorMessage.emit(this.fileError);
    }
    if (!this.supportedFileType.split(',').includes(this.fileInfo.type)) {
      isError = true;
      this.fileError = 'Invalid file type. Only jpg, jpeg, gif, and pdf are allowed.';
      this.fileErrorMessage.emit(this.fileError);
    }
    if (isError) {
      this.uploadInProgress = false;
      this.documentUploaded.emit({ fileBase64: null, fileInfo: null });
      return;
    }

    this.fileName = this.fileInfo.name;
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64String = (e.target?.result as string).replace(/^data:.+;base64,/, '');
      this.documentUploaded.emit({ fileBase64: base64String, fileInfo: this.fileInfo });
      this.uploadInProgress = false;
    }
    reader.readAsDataURL(this.fileInfo);
    this.uploadInProgress = false;
  }

  onFileSelected(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      this.onFileDropped(fileInput.files);
    }
  }

  cancelUpload() {
    this.fileError = null;
    this.fileInfo = null;
    this.fileName = '';
    this.uploadInProgress = false;
    this.fileErrorMessage.emit(null);
    this.documentUploaded.emit({ fileBase64: null, fileInfo: null });
  }

}
