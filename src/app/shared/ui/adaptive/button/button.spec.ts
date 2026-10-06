import { signal, type WritableSignal } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { PlatformService } from "@core/services/platform.service";
import { ButtonMobile } from "@ui/buttons/mobile";
import { ButtonWeb } from "@ui/buttons/web";
import { vi } from "vitest";
import { LuxButton } from "./button";

describe("LuxButton (adaptive)", () => {
  let fixture: ComponentFixture<LuxButton>;
  let component: LuxButton;
  let isMobile: WritableSignal<boolean>;

  const webChild = (): ButtonWeb | undefined =>
    fixture.debugElement.query(By.directive(ButtonWeb))?.componentInstance as
      | ButtonWeb
      | undefined;

  const mobileChild = (): ButtonMobile | undefined =>
    fixture.debugElement.query(By.directive(ButtonMobile))?.componentInstance as
      | ButtonMobile
      | undefined;

  beforeEach(async () => {
    isMobile = signal(false);
    await TestBed.configureTestingModule({
      imports: [LuxButton],
      providers: [{ provide: PlatformService, useValue: { isMobile } }],
    }).compileComponents();

    fixture = TestBed.createComponent(LuxButton);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("renders the web implementation on desktop", () => {
    expect(webChild()).toBeTruthy();
    expect(mobileChild()).toBeUndefined();
  });

  it("renders the mobile implementation on mobile", () => {
    isMobile.set(true);
    fixture.detectChanges();
    expect(mobileChild()).toBeTruthy();
    expect(webChild()).toBeUndefined();
  });

  it("switches implementation reactively when platform changes", () => {
    expect(webChild()).toBeTruthy();
    isMobile.set(true);
    fixture.detectChanges();
    expect(mobileChild()).toBeTruthy();
    isMobile.set(false);
    fixture.detectChanges();
    expect(webChild()).toBeTruthy();
  });

  it("forwards the approved inputs to the web child", () => {
    fixture.componentRef.setInput("kind", "edit");
    fixture.componentRef.setInput("displayMode", "icon");
    fixture.componentRef.setInput("label", "Editar");
    fixture.componentRef.setInput("icon", "material-symbols-light:edit");
    fixture.componentRef.setInput("iconClass", "material-symbols-light:edit");
    fixture.componentRef.setInput("disabled", true);
    fixture.componentRef.setInput("loading", true);
    fixture.componentRef.setInput("type", "submit");
    fixture.componentRef.setInput("ariaLabel", "Editar registro");
    fixture.detectChanges();

    const child = webChild()!;
    expect(child.kind()).toBe("edit");
    expect(child.displayMode()).toBe("icon");
    expect(child.label()).toBe("Editar");
    expect(child.icon()).toBe("material-symbols-light:edit");
    expect(child.iconClass()).toBe("material-symbols-light:edit");
    expect(child.disabled()).toBe(true);
    expect(child.loading()).toBe(true);
    expect(child.type()).toBe("submit");
    expect(child.ariaLabel()).toBe("Editar registro");
  });

  it("forwards the approved inputs to the mobile child", () => {
    isMobile.set(true);
    fixture.detectChanges();
    fixture.componentRef.setInput("kind", "save");
    fixture.componentRef.setInput("displayMode", "label");
    fixture.componentRef.setInput("ariaLabel", "Guardar");
    fixture.detectChanges();

    const child = mobileChild()!;
    expect(child.kind()).toBe("save");
    expect(child.displayMode()).toBe("label");
    expect(child.ariaLabel()).toBe("Guardar");
  });

  it("re-emits clicked exactly once from the web child", () => {
    const spy = vi.fn();
    component.clicked.subscribe(spy);
    const button = fixture.nativeElement.querySelector(
      "button",
    ) as HTMLButtonElement;
    button.click();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it("does not emit clicked when disabled", () => {
    fixture.componentRef.setInput("disabled", true);
    fixture.detectChanges();
    const spy = vi.fn();
    component.clicked.subscribe(spy);
    const button = fixture.nativeElement.querySelector(
      "button",
    ) as HTMLButtonElement;
    button.click();
    expect(spy).not.toHaveBeenCalled();
  });

  it("does not emit clicked when loading", () => {
    fixture.componentRef.setInput("loading", true);
    fixture.detectChanges();
    const spy = vi.fn();
    component.clicked.subscribe(spy);
    const button = fixture.nativeElement.querySelector(
      "button",
    ) as HTMLButtonElement;
    button.click();
    expect(spy).not.toHaveBeenCalled();
  });

  it("exposes a concrete accessible name for custom icon-only", () => {
    fixture.componentRef.setInput("kind", "custom");
    fixture.componentRef.setInput("displayMode", "icon");
    fixture.componentRef.setInput("ariaLabel", "Editar");
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector(
      "button",
    ) as HTMLButtonElement;
    expect(button.getAttribute("aria-label")).toBe("Editar");
  });
});
