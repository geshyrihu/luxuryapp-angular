import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MobileCarousel } from './carousel';

describe('MobileCarousel', () => {
  let component: MobileCarousel;
  let fixture: ComponentFixture<MobileCarousel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MobileCarousel],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(MobileCarousel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
