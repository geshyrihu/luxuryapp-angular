import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { WebButtonIconDelete } from './button-delete';
import { ConfirmService } from '../shared/confirm.service';

describe('WebButtonIconDelete', () => {
  let component: WebButtonIconDelete;
  let fixture: ComponentFixture<WebButtonIconDelete>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WebButtonIconDelete],
      providers: [
        { provide: ConfirmService, useValue: { confirm: () => Promise.resolve(true) } },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(WebButtonIconDelete);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
