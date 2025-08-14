import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { PDFWrapperService } from './pdf-wrapper.service';

describe('PDFWrapperService', () => {
  let service: PDFWrapperService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [],
      imports: [HttpClientTestingModule, MatSnackBarModule, MatDialogModule],
      providers: [],
    });
    service = TestBed.inject(PDFWrapperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
