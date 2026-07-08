import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MobileButtonIconViewPdf } from './button-view-pdf';

describe('MobileButtonIconViewPdf', () => {
  let component: MobileButtonIconViewPdf;
  let fixture: ComponentFixture<MobileButtonIconViewPdf>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MobileButtonIconViewPdf],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(MobileButtonIconViewPdf);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
