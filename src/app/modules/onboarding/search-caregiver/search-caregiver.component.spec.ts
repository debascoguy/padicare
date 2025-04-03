import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchCaregiverComponent } from './search-caregiver.component';

describe('SearchCaregiverComponent', () => {
  let component: SearchCaregiverComponent;
  let fixture: ComponentFixture<SearchCaregiverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchCaregiverComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchCaregiverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
