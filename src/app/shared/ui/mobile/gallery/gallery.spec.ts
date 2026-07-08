import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MobileGallery } from './gallery';

describe('MobileGallery', () => {
  let component: MobileGallery;
  let fixture: ComponentFixture<MobileGallery>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MobileGallery],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(MobileGallery);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
