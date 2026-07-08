import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Tree } from './tree';

describe('Tree', () => {
  let component: Tree;
  let fixture: ComponentFixture<Tree>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Tree],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(Tree);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
