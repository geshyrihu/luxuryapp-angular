import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { AppVirtualScroller } from './virtual-scroller';

describe('AppVirtualScroller', () => {
  let component: AppVirtualScroller;
  let fixture: ComponentFixture<AppVirtualScroller>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppVirtualScroller],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(AppVirtualScroller);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
