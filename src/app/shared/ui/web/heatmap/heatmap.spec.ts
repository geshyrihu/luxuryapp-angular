import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppHeatmap } from './heatmap';

describe('AppHeatmap', () => {
  let component: AppHeatmap;
  let fixture: ComponentFixture<AppHeatmap>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppHeatmap],
    }).compileComponents();

    fixture = TestBed.createComponent(AppHeatmap);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
