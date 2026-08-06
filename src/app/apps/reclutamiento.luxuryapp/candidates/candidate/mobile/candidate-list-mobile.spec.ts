import { NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { vi } from "vitest";
import { CandidateListMobile } from "./candidate-list-mobile";
import { CandidateListItem } from "../interfaces/candidate.dto";

const mockCandidateList: CandidateListItem[] = [
  {
    id: "1",
    fullName: "Juan Pérez",
    phoneNumber: "555-1234",
    email: "juan@example.com",
    status: 0,
    activeApplicationsCount: 2,
    lastUpdatedAt: "2026-01-15T10:00:00Z",
  },
  {
    id: "2",
    fullName: "María García",
    phoneNumber: "555-5678",
    email: "maria@example.com",
    status: 1,
    activeApplicationsCount: 0,
    lastUpdatedAt: "2026-01-14T10:00:00Z",
  },
];

describe("CandidateListMobile", () => {
  let component: CandidateListMobile;
  let fixture: ComponentFixture<CandidateListMobile>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CandidateListMobile],
      schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(CandidateListMobile);
    component = fixture.componentInstance;

    fixture.componentRef.setInput("data", mockCandidateList);
    fixture.componentRef.setInput("globalFilterFields", ["fullName", "email", "phoneNumber"]);
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should emit add event", () => {
    const emitSpy = vi.spyOn(component.add, "emit");
    component.add.emit({ id: "new", title: "Nuevo candidato" });
    expect(emitSpy).toHaveBeenCalledWith({ id: "new", title: "Nuevo candidato" });
  });

  it("should emit edit event", () => {
    const emitSpy = vi.spyOn(component.edit, "emit");
    component.edit.emit({ id: "1", title: "Editar candidato" });
    expect(emitSpy).toHaveBeenCalledWith({ id: "1", title: "Editar candidato" });
  });

  it("should emit archive event", () => {
    const emitSpy = vi.spyOn(component.archive, "emit");
    component.archive.emit("1");
    expect(emitSpy).toHaveBeenCalledWith("1");
  });

  it("should emit detail event", () => {
    const emitSpy = vi.spyOn(component.detail, "emit");
    component.detail.emit("1");
    expect(emitSpy).toHaveBeenCalledWith("1");
  });

  it("should have required inputs", () => {
    expect(component.data()).toEqual(mockCandidateList);
    expect(component.globalFilterFields()).toEqual(["fullName", "email", "phoneNumber"]);
  });
});