import { ErrorType, ValidatorError } from './../../../../../validators/backendValidator/ValidatorHelpers.ts';
import { Scenario } from "../../Scenario.ts";
import { BookingUpdateScenarioHelper } from "../../../helpers/BookingUpdateScenarioHelper.ts";
import descriptions from "../../../consts/descriptions.ts";
import { ScenarioHelper } from "../../../helpers/ScenarioHelper.ts";
import { Booker } from "../../../Booker.ts";
import { Context } from '../../../context/Context.ts';
import { SubRequestMapper } from '../../../../logging/SubRequestMapper.ts';

export class BookingUpdateDateScenario implements Scenario {
  private helper = new ScenarioHelper()
  private booker = new Booker();

  private bookingUpdateScenarioHelper = new BookingUpdateScenarioHelper();

  public validate = async (context: Context) => {
    const apiClient = context.getApiClient();
    const name = `Booking Update - Change Date`;
    const description = descriptions.bookingUpdateDate;
    const [bookableProduct] = context.productConfig.availableProducts;
    const date = new Date();
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
    });

    context.subrequestMapper.map(result, context, date);

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
