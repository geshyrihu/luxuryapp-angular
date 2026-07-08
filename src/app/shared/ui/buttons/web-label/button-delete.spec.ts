import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { WebButtonLabelDelete } from './button-delete';

describe('WebButtonLabelDelete', () => {
  let component: WebButtonLabelDelete;
  let fixture: ComponentFixture<WebButtonLabelDelete>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WebButtonLabelDelete],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(WebButtonLabelDelete);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
