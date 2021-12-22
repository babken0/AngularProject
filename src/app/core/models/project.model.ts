export interface ProjectModel {
  InterventionID
  InterventionCode: string,
  ShortName: string,
  Title: string,
  InterventionCountryID: number,
  workflowStateId: number,
  UpdatedUserID: number,
  Description: string,
  DateUpdated: number,
  ActualStartDate: string;
}
