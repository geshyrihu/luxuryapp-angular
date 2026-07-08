import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { WebButtonLabelTracking } from './button-tracking';

describe('WebButtonLabelTracking', () => {
  let component: WebButtonLabelTracking;
  let fixture: ComponentFixture<WebButtonLabelTracking>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WebButtonLabelTracking],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(WebButtonLabelTracking);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
