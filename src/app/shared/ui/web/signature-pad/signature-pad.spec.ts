import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { AppSignaturePad } from './signature-pad';

describe('AppSignaturePad', () => {
  let component: AppSignaturePad;
  let fixture: ComponentFixture<AppSignaturePad>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppSignaturePad],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(AppSignaturePad);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
