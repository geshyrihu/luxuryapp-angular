import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { AppDock } from './dock';

describe('AppDock', () => {
  let component: AppDock;
  let fixture: ComponentFixture<AppDock>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppDock],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(AppDock);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
