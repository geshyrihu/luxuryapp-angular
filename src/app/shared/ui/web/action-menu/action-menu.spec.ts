import { Component } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { OverlayModule } from "@angular/cdk/overlay";
import { vi } from "vitest";
import { ActionMenu } from "./action-menu";

@Component({
  selector: "test-action-menu-host",
  standalone: true,
  imports: [ActionMenu],
  template: `
    <app-action-menu>
      <button type="button" class="projected-action">Editar</button>
    </app-action-menu>
  `,
})
class TestHost {}

describe("ActionMenu", () => {
  let fixture: ComponentFixture<TestHost>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHost, OverlayModule],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
  });

  afterEach(() => {
    vi.useRealTimers();
    document.querySelectorAll(".cdk-overlay-container").forEach((element) => element.remove());
  });

  it("debe crearse correctamente", () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it("debe conservar boton aria-label Opciones y abrir contenido proyectado", () => {
    const trigger = fixture.nativeElement.querySelector(".action-menu-button");

    expect(trigger.getAttribute("aria-label")).toBe("Opciones");
    trigger.click();
    fixture.detectChanges();

    expect(document.querySelector(".menu-container .projected-action")).not.toBeNull();
  });

  it("debe cerrar 60ms despues del clic interno", () => {
    vi.useFakeTimers();
    const trigger = fixture.nativeElement.querySelector(".action-menu-button");
    trigger.click();
    fixture.detectChanges();

    const action = document.querySelector<HTMLButtonElement>(".projected-action");
    action?.click();
    fixture.detectChanges();

    expect(document.querySelector(".menu-container")).not.toBeNull();
    vi.advanceTimersByTime(59);
    expect(document.querySelector(".menu-container")).not.toBeNull();
    vi.advanceTimersByTime(1);
    expect(document.querySelector(".menu-container")).toBeNull();
  });
});
