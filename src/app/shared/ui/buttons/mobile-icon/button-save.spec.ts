import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MobileButtonIconSave } from './button-save';

describe('MobileButtonIconSave', () => {
  let component: MobileButtonIconSave;
  let fixture: ComponentFixture<MobileButtonIconSave>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MobileButtonIconSave],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(MobileButtonIconSave);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
