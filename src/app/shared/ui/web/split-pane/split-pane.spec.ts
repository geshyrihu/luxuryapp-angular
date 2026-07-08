import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { SplitPane } from './split-pane';

describe('SplitPane', () => {
  let component: SplitPane;
  let fixture: ComponentFixture<SplitPane>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SplitPane],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(SplitPane);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
