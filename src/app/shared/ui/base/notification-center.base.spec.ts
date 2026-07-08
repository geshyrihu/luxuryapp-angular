import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { NotificationCenterBase } from "./notification-center.base";

@Component({ selector: "test-notification-center", template: "" })
class Host extends NotificationCenterBase {}

describe("NotificationCenterBase", () => {
  it("should instantiate", () => {
    TestBed.configureTestingModule({ imports: [Host] });
    expect(TestBed.createComponent(Host).componentInstance).toBeTruthy();
  });
});
