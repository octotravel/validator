export class AvailabilityContext {
  private _skipAvailabilityCalendarChecks = false;
  private _skipAvailabilityIdsChecks = false;

  public set skipAvailabilityCalendarChecks(skipAvailabilityCalendarChecks: boolean) {
    this._skipAvailabilityCalendarChecks = skipAvailabilityCalendarChecks;
  }

  public get skipAvailabilityCalendarChecks(): boolean {
    return this._skipAvailabilityCalendarChecks;
  }

  public set skipAvailabilityIdsChecks(skipAvailabilityIdsChecks: boolean) {
    this._skipAvailabilityIdsChecks = skipAvailabilityIdsChecks;
  }

  public get skipAvailabilityIdsChecks(): boolean {
    return this._skipAvailabilityIdsChecks;
  }
}
