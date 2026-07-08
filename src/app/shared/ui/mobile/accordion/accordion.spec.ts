import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MobileAccordion } from './accordion';

describe('MobileAccordion', () => {
  let component: MobileAccordion;
  let fixture: ComponentFixture<MobileAccordion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MobileAccordion],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(MobileAccordion);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
