import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MobileButtonBase } from './mobile-button-base';

describe('MobileButtonBase', () => {
  let component: MobileButtonBase;
  let fixture: ComponentFixture<MobileButtonBase>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MobileButtonBase],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(MobileButtonBase);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
