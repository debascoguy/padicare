import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaregiverPreferenceComponent } from './caregiver-preference.component';

describe('CaregiverPreferenceComponent', () => {
  let component: CaregiverPreferenceComponent;
  let fixture: ComponentFixture<CaregiverPreferenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaregiverPreferenceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaregiverPreferenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
