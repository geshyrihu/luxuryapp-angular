import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { WebButtonLabelEdit } from './button-edit';

describe('WebButtonLabelEdit', () => {
  let component: WebButtonLabelEdit;
  let fixture: ComponentFixture<WebButtonLabelEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WebButtonLabelEdit],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(WebButtonLabelEdit);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
