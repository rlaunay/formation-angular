import { Directive } from '../framework/decorators/directive';
import { HostBinding } from '../framework/decorators/host-binding';
import { HostListener } from '../framework/decorators/host-listener';
import { Formatter } from "../services/formatter";
@Directive({
  selector: "[credit-card]"
})
export class CreditCardDirective {
  constructor(
    public element: HTMLElement,
    private formatter: Formatter
  ) {}

  @HostBinding('style.borderColor')
  borderColor = "blue";

  @HostListener('input', ['event.target'])
  formatCreditCardNumber(element: HTMLInputElement) {
    element.value = this.formatter.formatNumber(element.value, 16, 4);
  }
}