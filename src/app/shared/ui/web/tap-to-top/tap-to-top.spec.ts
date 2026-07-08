import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ScrollTop } from './tap-to-top';

describe('ScrollTop', () => {
  let component: ScrollTop;
  let fixture: ComponentFixture<ScrollTop>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScrollTop],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ScrollTop);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
