import { ComponentFixture, TestBed } from '@angular/core/testing';
import { JsPdfExportComponent } from './js-pdf-export.component';

describe('JsPdfExportComponent', () => {
  let component: JsPdfExportComponent;
  let fixture: ComponentFixture<JsPdfExportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [JsPdfExportComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JsPdfExportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
