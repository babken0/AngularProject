import {stringify} from "querystring";

type InterventionCountry = {
  id:number,
  name:string
}

type WorkflowState = {
  id:number,
  name:string
}
type UpdatedUser = {
  id:number,
  name:string
}


class ProjectModel{

  constructor(
    private interventionCode:string,
    private shortName:string,
    private title:string,
    private interventionCountryId:number,
    private workflowStateId:number,
    private updatedUserId:number,
    private description:string,
  ) {}
}
