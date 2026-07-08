import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ComparisonTable } from './comparison-table';

describe('ComparisonTable', () => {
  let component: ComparisonTable;
  let fixture: ComponentFixture<ComparisonTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComparisonTable],
    }).compileComponents();

    fixture = TestBed.createComponent(ComparisonTable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
