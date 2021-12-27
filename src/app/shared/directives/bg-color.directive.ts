import {Directive, ElementRef, HostListener, Renderer2} from '@angular/core';

@Directive({
  selector: '[appBgColor]'
})
export class BgColorDirective {

  constructor(private element: ElementRef,
              private render: Renderer2) {

  }

  @HostListener("mouseenter") changeMouseEnter() {
    this.render.setStyle(this.element.nativeElement, "background", "gray")
  }

  @HostListener("mouseleave") changeMouseLeave() {
    this.render.setStyle(this.element.nativeElement, "background", "white")
  }

}
