import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppCascadeSelect } from './cascade-select';

describe('AppCascadeSelect', () => {
  let component: AppCascadeSelect;
  let fixture: ComponentFixture<AppCascadeSelect>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppCascadeSelect],
    }).compileComponents();

    fixture = TestBed.createComponent(AppCascadeSelect);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
