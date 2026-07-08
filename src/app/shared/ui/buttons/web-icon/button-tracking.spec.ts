import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { WebButtonIconTracking } from './button-tracking';

describe('WebButtonIconTracking', () => {
  let component: WebButtonIconTracking;
  let fixture: ComponentFixture<WebButtonIconTracking>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WebButtonIconTracking],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(WebButtonIconTracking);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
