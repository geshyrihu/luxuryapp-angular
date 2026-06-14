import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { vi } from 'vitest';

@Component({
  selector: 'app-presentacion-contable',
  template: '<div>Mock</div>',
  standalone: true,
})
class MockPresentacionContable {}

describe('PresentacionContable', () => {
  let component: MockPresentacionContable;
  let fixture: ComponentFixture<MockPresentacionContable>;

  beforeEach(() => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [MockPresentacionContable],
      schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(MockPresentacionContable);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
