import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { PivotTable } from './pivot-table';

describe('PivotTable', () => {
  let component: PivotTable;
  let fixture: ComponentFixture<PivotTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PivotTable],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(PivotTable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
