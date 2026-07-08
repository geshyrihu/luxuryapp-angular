import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { AppGantt } from './gantt';

describe('AppGantt', () => {
  let component: AppGantt;
  let fixture: ComponentFixture<AppGantt>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppGantt],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(AppGantt);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
