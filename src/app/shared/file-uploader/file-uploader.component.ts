import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { CommonModule } from '@angular/common';
import { DragAndDropDirective } from './DragAndDropDirective';
import { FormatFileSizePipe } from '@app/core/pipes/format-file-size.pipe';


/**
 * HTML:
 * ==================
<app-file-uploader
    [config]="file_upload_config">
</app-file-uploader>

TS:
===================
file_upload_config = {
    API: this.global_utilities.getAPI('file_upload'),
    MIME_types_accepted: "application/pdf",
    is_multiple_selection_allowed: true,
    data: null
};
  * =================
 */
@Component({
  selector: 'app-file-uploader',
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    MatExpansionModule, 
    MatProgressBarModule, 
    DragAndDropDirective, 
    FormatFileSizePipe
  ],
  templateUrl: './file-uploader.component.html',
  styleUrl: './file-uploader.component.scss'
})
export class FileUploaderComponent implements OnInit, OnDestroy {

  @Input() config!: {
    API: string,
    MIME_types_accepted: string,
    maximum_allowed_file_size: number,
    is_multiple_selection_allowed: boolean,
    data: any,
    uploadFile: Function
  };

  @Output() fileUploadError = new EventEmitter<{[key: string]: any}>();

  @Output() filesUploaded = new EventEmitter<{
    file: any,
    is_upload_in_progress: boolean,
    upload_result: any
  }>();

  public selected_files: {
    file: any,
    is_upload_in_progress: boolean,
    upload_result: any
  }[] = [];

  @ViewChild("fileSelector", {static: false}) file_selector!: ElementRef;

  file_selection_form: FormGroup;

  // Subscriptions
  private file_selection_sub!: Subscription;
  private file_upload_sub!: Subscription;

  constructor() {
      this.file_selection_form = new FormGroup({
        file_selection: new FormControl()
      });
  }

  ngOnInit(): void {
    this.trackFileSelection();
  }

  openFileSelector(){
    const file_selection = this.file_selector.nativeElement;
    file_selection.click();
  }

  trackFileSelection(){
    this.file_selection_sub = this.file_selection_form.get('file_selection')?.valueChanges.subscribe(
      () => {
        const file_selection = this.file_selector.nativeElement;
        this.selectFiles(file_selection.files);
        this.file_selector.nativeElement.value = '';
      }
    ) as Subscription;
  }

  selectFiles(incoming_files: any[]){
    let incoming_file_count  = incoming_files.length;
    const FormatFileSizePipe_ = new FormatFileSizePipe();
    for(let i = 0; i < incoming_file_count; i++) {
      let incoming_file = incoming_files[i];
      if (incoming_file.size > this.config.maximum_allowed_file_size) {
        const fileSize = FormatFileSizePipe_.transform(this.config.maximum_allowed_file_size, 0);
        this.fileUploadError.emit({message: "File size exceeds the maximum allowed size of " + fileSize, file: incoming_file});
        continue;
      }
      // Checking if MIME type is acceptable
      if(!!!this.config.MIME_types_accepted || this.config.MIME_types_accepted.indexOf(incoming_file.type) >= 0){
        let selected_file = {
          file: incoming_file,
          is_upload_in_progress: false,
          upload_result: null
        };
        this.selected_files.push(selected_file);
      } else {
        this.fileUploadError.emit({message: "Only files of the following MIME types are allowed: " + this.config.MIME_types_accepted, file: incoming_file});
      }
    }
  }

  cancelFile(index: number) {
    this.selected_files.splice(index, 1);
  }

  uploadAll() {
    this.selected_files.forEach(file => {
      if (!file.is_upload_in_progress) {
        this.uploadFile(file);
      }
    });
  }

  uploadFile(file: any) {
    const fileIndex = this.selected_files.findIndex(selectedFile => selectedFile.file === file.file);
    if (fileIndex !== -1) {
      this.selected_files[fileIndex].is_upload_in_progress = true;
      this.config.uploadFile(file.file).subscribe(
        (response: any) => {
          this.selected_files[fileIndex].is_upload_in_progress = false;
          this.selected_files[fileIndex].upload_result = response;
          this.filesUploaded.emit(this.selected_files[fileIndex]);
        },
        (error: any) => {
          this.selected_files[fileIndex].is_upload_in_progress = false;
          this.selected_files[fileIndex].upload_result = error;
          this.filesUploaded.emit(this.selected_files[fileIndex]);
          this.fileUploadError.emit({message: error, file: file.file});
        });
    }
  }

  isAnyUplaodInProgress() {
    return this.selected_files.some(file => file.is_upload_in_progress);
  }

  initiateCancelAll() {
    this.cancelAll();
  }

  cancelAll(){
    let selected_file_count  = this.selected_files.length;
    for(let i = 0; i < selected_file_count; i++){
      this.selected_files.splice(0, 1);
    }
    this.fileUploadError.emit(new Set(["All files have been cancelled."]));
  }

  ngOnDestroy(): void {
    this.file_selection_sub.unsubscribe();
    this.file_upload_sub.unsubscribe();
  }
}
