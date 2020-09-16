import { Document, Schema, model, Model } from 'mongoose';

import { SHA256 } from 'crypto-js';



export interface IProfile extends Document {
  email: string;
  lastname: string;
  firstname: string;
  getFullName: () => string;
  setPassword: (password: string) => void;
  verifyPassword: (password: string) => boolean;
  getSafeProfile: () => ISafeProfile;
}

export type ISafeProfile = Pick<
  IProfile,
  "_id" | "email" | "lastname" | "firstname"
>;

const profileSchema = new Schema({
  email: { type: String, require: true, unique: true },
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  password: { type: String, required: true}


}); 

profileSchema.methods.getSafeProfile = function (): ISafeProfile {
  const { _id, email, lastname, firstname } = this;
  return { _id, email, lastname, firstname };
};


// profileSchema.methods.get = function () {
//    return this.find();
// }

profileSchema.methods.getFullName = function () {
    return `${this.lastname} ${this.firstname}`
}
profileSchema.methods.setPassword = function (password: string) {
  this.password = SHA256(password).toString();
};

profileSchema.methods.verifyPassword = function (password: string) {
  return this.password === SHA256(password).toString();
};
export const Profile = model<IProfile, Model<IProfile>>("Profile", profileSchema);

export default Profile;