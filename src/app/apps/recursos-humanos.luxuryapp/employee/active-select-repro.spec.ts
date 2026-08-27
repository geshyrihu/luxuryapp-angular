import { Component } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormControl, ReactiveFormsModule, Validators } from "@angular/forms";
import { CustomInputSelectSignal } from "@ui/inputs/web/custom-input-select-signal";
import { SelectItemDto } from "src/app/core/interfaces/select-item.dto";

@Component({
  selector: "repro-host",

  imports: [CustomInputSelectSignal, ReactiveFormsModule],
  template: `
    <custom-input-select-signal
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

  function openAndSelect() {
    const panel = document.querySelector(
      ".p-select-overlay, .p-select-panel, .p-overlay",
    ) as HTMLElement | null;
    if (panel) {
      const items = panel.querySelectorAll('p-select-item, li[role="option"]');
      if (items.length) {
        (items[items.length - 1] as HTMLElement).click();
        fixture.detectChanges();
        return;
      }
    }
    const comp = document.querySelector("custom-input-select-signal") as any;
    const web = document.querySelector("web-input-select") as any;
  }

  it("clicking Inactivo should set control to false", () => {
    // open overlay
    const select = document.querySelector("p-select") as HTMLElement;
    (select as any).click();
    fixture.detectChanges();
    openAndSelect();
    console.log("CONTROL VALUE AFTER CLICK:", host.control.value);
    expect(host.control.value).toBe(false);
  });
});
