import { Component } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormControl, ReactiveFormsModule, Validators } from "@angular/forms";
import { By } from "@angular/platform-browser";
import { SelectItemDto } from "@core/interfaces/select-item.dto";
import { NgSelectComponent } from "@ng-select/ng-select";
import { CustomInputSelectSignal } from "@ui/inputs/web/custom-input-select-signal";

@Component({
  selector: "repro-host",

  imports: [CustomInputSelectSignal, ReactiveFormsModule],
  template: `
    <lux-input-select-signal
      [control]="control"
      label="Estatus"
      [data]="data"
      [horizontal]="false"
      [filter]="true"
    />
  `,
})
class ReproHost {
  control = new FormControl<boolean | null>(null, [Validators.required]);
  data: SelectItemDto[] = [
    { label: "Activo", value: true },
    { label: "Inactivo", value: false },
  ];
}

describe("active boolean select repro", () => {
  let fixture: ComponentFixture<ReproHost>;
  let host: ReproHost;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReproHost],
    }).compileComponents();

    fixture = TestBed.createComponent(ReproHost);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("selecting Inactivo should set control to false", () => {
    const ngSelect = fixture.debugElement.query(By.directive(NgSelectComponent))
      .componentInstance as NgSelectComponent;
    ngSelect.open();
    fixture.detectChanges();
    const inactivo = ngSelect.itemsList.items.find(
      (i) => i.label === "Inactivo",
    )!;
    ngSelect.select(inactivo);
    fixture.detectChanges();
    expect(host.control.value).toBe(false);
  });
});
