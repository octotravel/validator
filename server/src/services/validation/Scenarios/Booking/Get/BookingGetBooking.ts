import { BookingContactSchema } from "https://esm.sh/@octocloud/types@1.3.1";
import { Scenario } from "../../Scenario.ts";
import { BookingGetScenarioHelper } from "../../../helpers/BookingGetScenarioHelper.ts";
import { Config } from "../../../config/Config.ts";
import descriptions from "../../../consts/descriptions.ts";
import { Booker } from "../../../Booker.ts";
import { ErrorType, ValidatorError } from "../../../../../validators/backendValidator/ValidatorHelpers.ts";
import { ScenarioHelper } from "../../../helpers/ScenarioHelper.ts";

export class BookingGetBookingScenario implements Scenario {
  private helper = new ScenarioHelper()
  private booker = new Booker();
  private config = Config.getInstance();
  private apiClient = this.config.getApiClient();

  private bookingGetScenarionHelper = new BookingGetScenarioHelper();

  public validate = async () => {
    const name = "Get Booking - Booking.ts";
    const description = descriptions.bookingGetBooking;
    const [bookableProduct] = this.config.productConfig.availableProducts;

    const resultReservation = await this.booker.createReservation(
      bookableProduct
    );

    if (resultReservation.data === null) {
      return this.helper.handleResult({
        result: resultReservation,
        name,
        description,
        errors: [new ValidatorError({type: ErrorType.CRITICAL, message: 'Reservation Creation Failed'})],
      })
    }

    const resultConfirmation = await this.apiClient.bookingConfirmation({
      uuid: resultReservation.data.uuid,
      contact: {} as BookingContactSchema,
    });

    if (resultConfirmation.data === null) {
      return this.helper.handleResult({
        result: resultConfirmation,
        name,
        description,
        errors: [new ValidatorError({type: ErrorType.CRITICAL, message: 'Reservation Confirm Failed'})],
      })
    }


    const result = await this.apiClient.getBooking({
      uuid: resultConfirmation.data.uuid,
    });


    return this.bookingGetScenarionHelper.validateBookingGet(
      {
        result,
        name,
        description,
      },
    );
  };
}
