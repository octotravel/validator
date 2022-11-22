import { BookingContactSchema } from "@octocloud/types";
import { Scenario } from "../../Scenario";
import { BookingGetScenarioHelper } from "../../../helpers/BookingGetScenarioHelper";
import { Config } from "../../../config/Config";
import descriptions from "../../../consts/descriptions";
import { Booker } from "../../../Booker";
import { ErrorType, ValidatorError } from "../../../../../validators/backendValidator/ValidatorHelpers";
import { ScenarioHelper } from "../../../helpers/ScenarioHelper";

export class BookingGetBookingScenario implements Scenario {
  private helper = new ScenarioHelper()
  private booker = new Booker();
  private config = Config.getInstance();
  private apiClient = this.config.getApiClient();

  private bookingGetScenarionHelper = new BookingGetScenarioHelper();

  public validate = async () => {
    const name = "Get Booking - Booking";
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
