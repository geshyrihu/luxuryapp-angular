import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { AppFluid } from './fluid';

describe('AppFluid', () => {
  let component: AppFluid;
  let fixture: ComponentFixture<AppFluid>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppFluid],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(AppFluid);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
