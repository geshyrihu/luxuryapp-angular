import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MobilePullToRefresh } from './pull-to-refresh';

describe('MobilePullToRefresh', () => {
  let component: MobilePullToRefresh;
  let fixture: ComponentFixture<MobilePullToRefresh>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MobilePullToRefresh],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(MobilePullToRefresh);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
