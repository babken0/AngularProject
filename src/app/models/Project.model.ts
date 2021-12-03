type InterventionCountry = {
  id: number,
  name: string
}

type WorkflowState = {
  id: number,
  name: string
}
type UpdatedUser = {
  id: number,
  name: string
}


export interface ProjectModel {
  InterventionCode: string,
  ShortName: string,
  Title: string,
  InterventionCountryID: number,
  workflowStateId: number,
  UpdatedUserID: number,
  Description: string,
  DateUpdated: number,
}
