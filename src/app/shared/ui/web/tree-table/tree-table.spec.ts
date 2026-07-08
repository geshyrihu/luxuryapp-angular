import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TreeTable } from './tree-table';

describe('TreeTable', () => {
  let component: TreeTable;
  let fixture: ComponentFixture<TreeTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TreeTable],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(TreeTable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
