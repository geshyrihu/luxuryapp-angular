import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MobileButtonIcon } from './button';

describe('MobileButtonIcon', () => {
  let component: MobileButtonIcon;
  let fixture: ComponentFixture<MobileButtonIcon>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MobileButtonIcon],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(MobileButtonIcon);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
