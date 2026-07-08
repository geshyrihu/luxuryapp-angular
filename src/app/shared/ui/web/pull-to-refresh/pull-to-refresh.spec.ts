import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { PullToRefresh } from './pull-to-refresh';

describe('PullToRefresh', () => {
  let component: PullToRefresh;
  let fixture: ComponentFixture<PullToRefresh>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PullToRefresh],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(PullToRefresh);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
