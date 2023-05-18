import { Scenario } from "../../Scenario";
import { BookingUpdateScenarioHelper } from "../../../helpers/BookingUpdateScenarioHelper";
import descriptions from "../../../consts/descriptions";
import { ScenarioHelper } from "../../../helpers/ScenarioHelper";
import { Booker } from "../../../Booker";
import { ErrorType, ValidatorError } from "../../../../../validators/backendValidator/ValidatorHelpers";
import { Context } from "../../../context/Context";

export class BookingUpdateContactScenario implements Scenario {
  private helper = new ScenarioHelper()
  private booker = new Booker();
  private bookingUpdateScenarioHelper = new BookingUpdateScenarioHelper();

  public validate = async (context: Context) => {
    const apiClient = context.getApiClient();
    const name = `Booking Update - Contact`;
    const description = descriptions.bookingUpdateContact;
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

    const result = await apiClient.bookingUpdate({
      uuid: resultReservation.data.uuid,
      contact: {
        fullName: "John Doe",
        firstName: "John",
        lastName: "Doe",
        emailAddress: "johndoe@email.com",
        phoneNumber: "+00000000",
        country: "GB",
        notes: "Test notes contact",
        locales: ["en"],
      },
      notes: "Test note",
    }, context);
    
    return this.bookingUpdateScenarioHelper.validateBookingUpdate(
      {
        result,
        name,
        description,
      },
      resultReservation.data,
      context
    );
  };
}
