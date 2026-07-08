import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MobileButtonIconDownload } from './button-download';

describe('MobileButtonIconDownload', () => {
  let component: MobileButtonIconDownload;
  let fixture: ComponentFixture<MobileButtonIconDownload>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MobileButtonIconDownload],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(MobileButtonIconDownload);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
