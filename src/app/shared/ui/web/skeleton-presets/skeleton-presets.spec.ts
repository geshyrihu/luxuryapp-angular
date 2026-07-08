import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { WebSkeletonPresets } from './skeleton-presets';

describe('WebSkeletonPresets', () => {
  let component: WebSkeletonPresets;
  let fixture: ComponentFixture<WebSkeletonPresets>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WebSkeletonPresets],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(WebSkeletonPresets);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
