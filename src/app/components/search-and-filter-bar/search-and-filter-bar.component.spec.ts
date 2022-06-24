import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchAndFilterBarComponent } from './search-and-filter-bar.component';

describe('SearchAndFilterBarComponent', () => {
  let component: SearchAndFilterBarComponent;
  let fixture: ComponentFixture<SearchAndFilterBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchAndFilterBarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchAndFilterBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
