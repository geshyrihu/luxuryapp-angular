import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { DataGrid } from './data-grid';

describe('DataGrid', () => {
  let component: DataGrid;
  let fixture: ComponentFixture<DataGrid>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataGrid],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(DataGrid);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
