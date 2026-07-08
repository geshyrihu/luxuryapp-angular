import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Menubar } from './menubar';

describe('Menubar', () => {
  let component: Menubar;
  let fixture: ComponentFixture<Menubar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Menubar],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(Menubar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
