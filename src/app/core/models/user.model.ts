import { BaseModel } from './base.model';

export interface User extends BaseModel {
  firstName: string;
  lastName: string;
  email: string;
  createDate: Date;
  updateDate: Date;
}
