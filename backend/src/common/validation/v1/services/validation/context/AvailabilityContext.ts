export class AvailabilityContext {
  private _skipAvailabilityCalendarChecks = true;
  private _skipAvailabilityIdsChecks = true;

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
