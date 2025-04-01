import { IMaster } from '../master/model';
import { IOrganization } from '../organization/model';

export interface IProfile {
  _id: string
  user: {
    titleId: string;
    genderId: string;
    nationalityId: string;
    idNumber: string;
    idTypeId: string;
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    password: string;
    phoneNumber: string;
    dateOfBirth: string;
    title: IMaster;
    idType: IMaster;
    gender: IMaster
    nationality: IMaster
  };
  invitationId: string;
  officeNumber: string;
  service: string;
  residenceStatusId: string;
  organizationId: string;
  designationId: string;
  researchClusterIds: string[];
  sections: IProfileSection[];
  researchClusters: IMaster[];
  residenceStatus: IMaster;
  designation: IMaster;
  organization: IOrganization;
}

export interface IProfileSection {
  name: string;
  role: string;
  institution: string;
  qualification: string;
  fieldOfStudy: string;
  description: string;
  fromDate: number;
  toDate: number;
  kind: string;
  contractType?: IMaster
}

export enum ProfileSectionKind {
  ACADEMIC = "ACADEMIC",
  QUALIFICATION = "QUALIFICATION",
  EXPERIENCE = "EXPERIENCE",
  AWARDS = "AWARDS",
  EXPERTISE = "EXPERTISE",
  CONTRACT = "CONTRACT",
}
