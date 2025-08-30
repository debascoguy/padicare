import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcceptOrRejectAppointmentComponent } from './accept-or-reject-appointment.component';

describe('AcceptOrRejectAppointmentComponent', () => {
  let component: AcceptOrRejectAppointmentComponent;
  let fixture: ComponentFixture<AcceptOrRejectAppointmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AcceptOrRejectAppointmentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AcceptOrRejectAppointmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
