import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CommandPalette } from './command-palette';

describe('CommandPalette', () => {
  let component: CommandPalette;
  let fixture: ComponentFixture<CommandPalette>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommandPalette],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(CommandPalette);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
