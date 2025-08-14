import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentsTableViewComponent } from './appointments-table-view.component';

describe('AppointmentsTableViewComponent', () => {
  let component: AppointmentsTableViewComponent;
  let fixture: ComponentFixture<AppointmentsTableViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppointmentsTableViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppointmentsTableViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
