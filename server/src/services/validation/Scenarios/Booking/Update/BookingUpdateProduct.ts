import { Scenario } from "../../Scenario.ts";
import { BookingUpdateScenarioHelper } from "../../../helpers/BookingUpdateScenarioHelper.ts";
import { Config } from "../../../config/Config.ts";
import descriptions from "../../../consts/descriptions.ts";
import { ScenarioHelper } from "../../../helpers/ScenarioHelper.ts";
import { Booker } from "../../../Booker.ts";
import { ErrorType, ValidatorError } from "../../../../../validators/backendValidator/ValidatorHelpers.ts";

export class BookingUpdateProductScenario implements Scenario {
  private helper = new ScenarioHelper()
  private booker = new Booker();
  private config = Config.getInstance();
  private apiClient = this.config.getApiClient();
  private bookingUpdateScenarioHelper = new BookingUpdateScenarioHelper();

  public validate = async () => {
    const name = `Booking Update - Change Product`;
    const description = descriptions.bookingUpdateProduct;
    const [bookableProduct1, bookableProduct2] =
    this.config.productConfig.availableProducts;

    const resultReservation = await this.booker.createReservation(
      bookableProduct1
    );

    if (resultReservation.data === null) {
      return this.helper.handleResult({
        result: resultReservation,
        name,
        description,
        errors: [new ValidatorError({type: ErrorType.CRITICAL, message: 'Reservation Creation Failed'})],
      })
    }
    const result = await this.apiClient.bookingUpdate({
      uuid: resultReservation.data.uuid,
      productId: bookableProduct2.product.id,
      optionId: bookableProduct2.getOption().id,
      unitItems: bookableProduct2.getValidUnitItems(),
      availabilityId: bookableProduct2.randomAvailabilityID,
    });


    return this.bookingUpdateScenarioHelper.validateBookingUpdate(
      {
        result,
        name,
        description,
      },
      resultReservation.data
    );
  };
}
