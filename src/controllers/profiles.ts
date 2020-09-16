import { Query } from "mongoose";
import { Profile, IProfile } from "../models/profiles";
import profilesController from "./profilesController";
// import profilesController from "./profilesController";

export function getProfile(profileId: string): Promise<IProfile | null> {
  return Profile.findById(profileId).then((profile) => profile);
}

export function getAllProfiles(): Promise<IProfile[]> {
  return Profile.find({}).then((profiles) => profiles);
}
export function updateProfile(profile: IProfile, email: string, firstname: string, lastname: string, password?: string): Promise<any>{
  // profile.email = email;
  // profile.firstname = firstname;
  // profile.lastname = lastname;
  // profile.save();
  if(password) profile.setPassword(password)
  return Profile.findByIdAndUpdate(profile._id, { email, firstname, lastname }).then(profile => profile);
  

}