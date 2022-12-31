import { Directive } from '../framework/decorators/directive';
import { HostBinding } from '../framework/decorators/host-binding';
import { HostListener } from '../framework/decorators/host-listener';

@Directive({
  selector: '[chrono]'
})
export class ChronoDirective {
  
  @HostBinding('textContent')
  count = 0;

  intervalId: number | undefined;

  constructor(public element: HTMLElement) {}

  @HostListener('click')
  onClick() {
    if (this.intervalId) {
      window.clearInterval(this.intervalId);
      this.intervalId = undefined;
      this.count = 0;
      return;
    }

    this.intervalId = window.setInterval(() => this.count++, 1000);
  }

  init() {
    this.intervalId = window.setInterval(() => this.count++, 1000);
  }
}