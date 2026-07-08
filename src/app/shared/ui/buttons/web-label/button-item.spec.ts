import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { WebButtonLabelItem } from './button-item';

describe('WebButtonLabelItem', () => {
  let component: WebButtonLabelItem;
  let fixture: ComponentFixture<WebButtonLabelItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WebButtonLabelItem],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(WebButtonLabelItem);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
