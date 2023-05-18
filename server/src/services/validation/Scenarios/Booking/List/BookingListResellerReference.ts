import { Scenario } from "../../Scenario";
import { BookingListScenarioHelper } from "../../../helpers/BookingListScenarioHelper";
import descriptions from "../../../consts/descriptions";
import { ScenarioHelper } from "../../../helpers/ScenarioHelper";
import { Booker } from "../../../Booker";
import { ErrorType, ValidatorError } from "../../../../../validators/backendValidator/ValidatorHelpers";
import { Context } from "../../../context/Context";

export class BookingListResellerReferenceScenario
  implements Scenario
{
  private helper = new ScenarioHelper()
  private booker = new Booker();
  private bookingListScenarionHelper = new BookingListScenarioHelper();

  public validate = async (context: Context) => {
    const apiClient = context.getApiClient();
    const name = "List Bookings - Reseller Reference";
    const description = descriptions.bookingListResellerReference;
    const [bookableProduct] = context.productConfig.availableProducts;

    

    const resultReservation = await this.booker.createReservation(
      bookableProduct,
      context
    );

    if (resultReservation.data === null) {
      return this.helper.handleResult({
        result: resultReservation,
        name,
        description,
        errors: [new ValidatorError({type: ErrorType.CRITICAL, message: 'Reservation Creation Failed'})],
      })
    }

    const resellerReference = `RESREF${resultReservation.data.resellerReference}`;
    const resultConfirmation = await apiClient.bookingConfirmation({
      uuid: resultReservation.data.uuid,
      contact: {
        fullName: "John Doe",
      },
      resellerReference,
    }, context);

    if (resultConfirmation.data === null) {
      return this.helper.handleResult({
        result: resultConfirmation,
        name,
        description,
        errors: [new ValidatorError({type: ErrorType.CRITICAL, message: 'Reservation Confirm Failed'})],
      })
    }
    const result = await apiClient.getBookings({
      resellerReference,
    }, context); 

    return this.bookingListScenarionHelper.validateBookingList({
      result,
      name,
      description,
    }, context);
  };
}
