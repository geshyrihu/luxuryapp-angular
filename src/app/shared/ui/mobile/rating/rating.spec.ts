import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MobileRating } from './rating';

describe('MobileRating', () => {
  let component: MobileRating;
  let fixture: ComponentFixture<MobileRating>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MobileRating],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(MobileRating);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
