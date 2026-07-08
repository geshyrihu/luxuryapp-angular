import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { AppEmailPreview } from './email-preview';

describe('AppEmailPreview', () => {
  let component: AppEmailPreview;
  let fixture: ComponentFixture<AppEmailPreview>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppEmailPreview],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(AppEmailPreview);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
