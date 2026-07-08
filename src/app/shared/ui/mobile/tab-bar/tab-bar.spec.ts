import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AppTabBar } from './tab-bar';

describe('AppTabBar', () => {
  let component: AppTabBar;
  let fixture: ComponentFixture<AppTabBar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppTabBar],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(AppTabBar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
