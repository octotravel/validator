import { Scenario } from "../../Scenario.ts";
import { BookingUpdateScenarioHelper } from "../../../helpers/BookingUpdateScenarioHelper.ts";
import { Config } from "../../../config/Config.ts";
import descriptions from "../../../consts/descriptions.ts";
import { ScenarioHelper } from "../../../helpers/ScenarioHelper.ts";
import { Booker } from "../../../Booker.ts";
import { ErrorType, ValidatorError } from "../../../../../validators/backendValidator/ValidatorHelpers.ts";

export class BookingUpdateContactScenario implements Scenario {
  private helper = new ScenarioHelper()
  private booker = new Booker();
  private config = Config.getInstance();
  private apiClient = this.config.getApiClient();

  private bookingUpdateScenarioHelper = new BookingUpdateScenarioHelper();

  public validate = async () => {
    const name = `Booking Update - Contact`;
    const description = descriptions.bookingUpdateContact;
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

    const result = await this.apiClient.bookingUpdate({
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
