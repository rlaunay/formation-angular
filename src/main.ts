import { ChronoDirective } from './directives/chrono.directive';
import { CreditCardDirective } from "./directives/credit-card.directive";
import { PhoneNumberDirective } from "./directives/phone-number.directive";
import { UserProfileDirective } from './directives/user-profile.directive';
import { Angular } from "./framework";
import { CreditCardVerifier } from "./services/credit-card-verifier";
import { Formatter } from "./services/formatter";

Angular.bootstrapApplication({
  declarations: [
    PhoneNumberDirective, 
    CreditCardDirective,
    ChronoDirective,
    UserProfileDirective
  ],
  providers: [
    {
      provide: "formatter",
      construct: () => new Formatter("global"),
    },
    {
      provide: "verifier",
      construct: () => new CreditCardVerifier(),
    },
  ],
});
