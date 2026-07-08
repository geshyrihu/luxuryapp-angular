import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { WebButtonIconEdit } from './button-edit';

describe('WebButtonIconEdit', () => {
  let component: WebButtonIconEdit;
  let fixture: ComponentFixture<WebButtonIconEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WebButtonIconEdit],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(WebButtonIconEdit);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
