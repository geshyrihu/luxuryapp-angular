import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RichTextEditor } from './rich-text-editor';

describe('RichTextEditor', () => {
  let component: RichTextEditor;
  let fixture: ComponentFixture<RichTextEditor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RichTextEditor],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(RichTextEditor);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
