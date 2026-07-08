import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MobileButtonLabelViewPdf } from './button-view-pdf';

describe('MobileButtonLabelViewPdf', () => {
  let component: MobileButtonLabelViewPdf;
  let fixture: ComponentFixture<MobileButtonLabelViewPdf>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MobileButtonLabelViewPdf],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(MobileButtonLabelViewPdf);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
