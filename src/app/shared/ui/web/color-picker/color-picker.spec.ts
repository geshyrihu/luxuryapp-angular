import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppColorPicker } from './color-picker';

describe('AppColorPicker', () => {
  let component: AppColorPicker;
  let fixture: ComponentFixture<AppColorPicker>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppColorPicker],
    }).compileComponents();

    fixture = TestBed.createComponent(AppColorPicker);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
