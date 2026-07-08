import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { InputFile } from './input-file';

describe('InputFile', () => {
  let component: InputFile;
  let fixture: ComponentFixture<InputFile>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputFile],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(InputFile);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
