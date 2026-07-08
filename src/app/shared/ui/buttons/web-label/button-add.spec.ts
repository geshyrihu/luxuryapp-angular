import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { WebButtonLabelAdd } from './button-add';

describe('WebButtonLabelAdd', () => {
  let component: WebButtonLabelAdd;
  let fixture: ComponentFixture<WebButtonLabelAdd>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WebButtonLabelAdd],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(WebButtonLabelAdd);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
