import {
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  inject,
  Output,
} from "@angular/core";
@Directive({
  selector: "[clickOutside]",
})
export class ClickOutsideDirective {
  @Output() clickOutside = new EventEmitter<Event>();
  elementRef = inject(ElementRef);

  @HostListener("document:click", ["$event", "$event.target"])
  onClick(event: MouseEvent, targetElement: HTMLElement): void {
    if (!targetElement) {
      return;
    }
    const clickedInside = this.elementRef.nativeElement.contains(targetElement);
    if (!clickedInside) {
      this.clickOutside.emit(event);
    }
  }
}









