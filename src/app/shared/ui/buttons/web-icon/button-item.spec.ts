import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { WebButtonIconItem } from './button-item';

describe('WebButtonIconItem', () => {
  let component: WebButtonIconItem;
  let fixture: ComponentFixture<WebButtonIconItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WebButtonIconItem],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(WebButtonIconItem);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
