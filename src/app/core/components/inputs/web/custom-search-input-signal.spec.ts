import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CustomSearchInput } from './custom-search-input-signal';

describe('CustomSearchInput', () => {
  let component: CustomSearchInput;
  let fixture: ComponentFixture<CustomSearchInput>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomSearchInput],
    }).compileComponents();

    fixture = TestBed.createComponent(CustomSearchInput);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
