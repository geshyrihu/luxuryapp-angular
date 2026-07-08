import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { WebButtonIconDownload } from './button-download';

describe('WebButtonIconDownload', () => {
  let component: WebButtonIconDownload;
  let fixture: ComponentFixture<WebButtonIconDownload>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WebButtonIconDownload],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(WebButtonIconDownload);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
