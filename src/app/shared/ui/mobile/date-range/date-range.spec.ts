import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MobileDateRange } from './date-range';

describe('MobileDateRange', () => {
  let component: MobileDateRange;
  let fixture: ComponentFixture<MobileDateRange>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MobileDateRange],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(MobileDateRange);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
