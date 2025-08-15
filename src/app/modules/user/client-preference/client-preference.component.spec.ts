import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientPreferenceComponent } from './client-preference.component';

describe('ClientPreferenceComponent', () => {
  let component: ClientPreferenceComponent;
  let fixture: ComponentFixture<ClientPreferenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientPreferenceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientPreferenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
