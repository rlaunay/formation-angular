import { Directive } from '../framework/decorators/directive';
import { HostBinding } from '../framework/decorators/host-binding';
import { HostListener } from '../framework/decorators/host-listener';
import { Input } from '../framework/decorators/input';
import { Formatter } from "../services/formatter";


@Directive({
  selector: '[phone-number]',
})
export class PhoneNumberDirective {

  @Input('with-spaces')
  willHaveSpaces = true;

  @HostBinding('value')
  value = "";

  @Input('border-color')
  @HostBinding('style.borderColor')
  borderColor = "red";

  @HostBinding('placeholder')
  placeholderText = "Hello world";

  @HostListener('click')
  onCLick() {
    this.placeholderText = "Hello Rémi !"
  }

  constructor(public element: HTMLElement, private formatter: Formatter) {}


  @HostListener("input", ["event.target.value"])
  formatPhoneNumber(value: string) {
    this.value = this.formatter.formatNumber(
      value,
      10,
      2,
      this.willHaveSpaces
    );
  }
}