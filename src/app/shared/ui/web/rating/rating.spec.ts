import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { AppRating } from './rating';

describe('AppRating', () => {
  let component: AppRating;
  let fixture: ComponentFixture<AppRating>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppRating],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(AppRating);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
