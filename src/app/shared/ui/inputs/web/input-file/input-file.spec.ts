import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { WebInputFile } from './input-file';

describe('WebInputFile', () => {
  let component: WebInputFile;
  let fixture: ComponentFixture<WebInputFile>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WebInputFile],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(WebInputFile);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
