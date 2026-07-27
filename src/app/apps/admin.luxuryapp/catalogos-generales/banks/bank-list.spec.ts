import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { of } from 'rxjs';
import { Platform } from '@ionic/angular';
import { BankList } from './bank-list';
import { TableScrollHeightService } from 'src/app/core/services/table-scroll-height.service';

describe('BankList', () => {
  let component: BankList;
  let fixture: ComponentFixture<BankList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BankList, RouterModule.forRoot([])],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: MessageService, useValue: { add: vi.fn(), clear: vi.fn() } },
        { provide: DialogService, useValue: { open: vi.fn().mockReturnValue({ onClose: { subscribe: vi.fn() } }) } },
        { provide: DynamicDialogConfig, useValue: { data: {} } },
        { provide: DynamicDialogRef, useValue: { close: vi.fn() } },
        { provide: ActivatedRoute, useValue: { snapshot: { data: {}, params: {}, queryParams: {} }, params: of({}), queryParams: of({}) } },
        { provide: 'HttpClientWithoutInterceptors', useValue: (globalThis as any).__mockHttpClient },
        { provide: Platform, useValue: { is: vi.fn().mockReturnValue(false) } },
        TableScrollHeightService,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BankList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
