import { ErrorType, ValidatorError } from './../../../../../validators/backendValidator/ValidatorHelpers';
import { Scenario } from "../../Scenario";
import { BookingUpdateScenarioHelper } from "../../../helpers/BookingUpdateScenarioHelper";
import descriptions from "../../../consts/descriptions";
import { ScenarioHelper } from "../../../helpers/ScenarioHelper";
import { Booker } from "../../../Booker";
import { Context } from '../../../context/Context';
import { SubRequestMapper } from '../../../../logging/SubRequestMapper';

export class BookingUpdateDateScenario implements Scenario {
  private helper = new ScenarioHelper()
  private booker = new Booker();

  private bookingUpdateScenarioHelper = new BookingUpdateScenarioHelper();

  public validate = async (context: Context) => {
    const apiClient = context.getApiClient();
    const name = `Booking Update - Change Date`;
    const description = descriptions.bookingUpdateDate;
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
      availabilityId: bookableProduct.getAvialabilityID({
        omitID: resultReservation.data.availabilityId,
      }),
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
