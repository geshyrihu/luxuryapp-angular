import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MobileColorPicker } from './color-picker';

describe('MobileColorPicker', () => {
  let component: MobileColorPicker;
  let fixture: ComponentFixture<MobileColorPicker>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MobileColorPicker],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(MobileColorPicker);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
