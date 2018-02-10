import { UserDocument } from "../user-document.interface";

export interface UserDataAggregatorService {
  getUserDocument(): Promise<UserDocument>;
}
