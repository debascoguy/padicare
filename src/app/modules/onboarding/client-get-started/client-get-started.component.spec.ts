import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientGetStartedComponent } from './client-get-started.component';

describe('ClientGetStartedComponent', () => {
  let component: ClientGetStartedComponent;
  let fixture: ComponentFixture<ClientGetStartedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientGetStartedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientGetStartedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
