import { Directive, ElementRef, HostListener } from "@angular/core";

@Directive({
  selector: "[appPrintable]",
})
export class PrintableDirective {
  constructor(private el: ElementRef) {}

  @HostListener("click")
  onPrint() {
    this.el.nativeElement.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
    setTimeout(() => {
      window.print();
    }, 300);
  }
}
