import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { AppSlider } from './slider';

describe('AppSlider', () => {
  let component: AppSlider;
  let fixture: ComponentFixture<AppSlider>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppSlider],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(AppSlider);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
