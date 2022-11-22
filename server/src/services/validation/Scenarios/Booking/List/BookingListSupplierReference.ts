import { Scenario } from "../../Scenario";
import { BookingListScenarioHelper } from "../../../helpers/BookingListScenarioHelper";
import { Config } from "../../../config/Config";
import descriptions from "../../../consts/descriptions";
import { ScenarioHelper } from "../../../helpers/ScenarioHelper";
import { Booker } from "../../../Booker";
import { ErrorType, ValidatorError } from "../../../../../validators/backendValidator/ValidatorHelpers";

export class BookingListSupplierReferenceScenario
  implements Scenario
{
  private helper = new ScenarioHelper()
  private booker = new Booker();
  private config = Config.getInstance();
  private apiClient = this.config.getApiClient();
  private bookingListScenarionHelper = new BookingListScenarioHelper();

  public validate = async () => {
    const name = "List Bookings - Supplier Reference";
    const description = descriptions.bookingListSupplierReference;
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
      contact: {
        fullName: "John Doe",
      },
    });

    if (resultConfirmation.data === null) {
      return this.helper.handleResult({
        result: resultConfirmation,
        name,
        description,
        errors: [new ValidatorError({type: ErrorType.CRITICAL, message: 'Reservation Confirm Failed'})],
      })
    }
    const result = await this.apiClient.getBookings({
      supplierReference: resultConfirmation.data.supplierReference as string,
    });

    return this.bookingListScenarionHelper.validateBookingList({
      result,
      name,
      description,
    });
  };
}
