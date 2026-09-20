import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { vi } from 'vitest';
import { DiagramGantt } from './diagram-gantt-chart';

describe('DiagramGantt', () => {
  let component: DiagramGantt;
  let fixture: ComponentFixture<DiagramGantt>;

  beforeEach(() => {
    TestBed.resetTestingModule();
    TestBed.overrideComponent(DiagramGantt, {
      set: { template: '<div>Mock</div>', imports: [] },
    });
    TestBed.configureTestingModule({
      imports: [DiagramGantt],
      schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(DiagramGantt);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call ngOnInit without errors', () => {
    expect(() => component.ngOnInit()).not.toThrow();
  });
});
