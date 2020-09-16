import Profile from "../models/profiles";

const find = async () => {
    try {
        const profiles = await Profile.find({}).exec();
        return profiles;
    } catch (err) {
        return 'error occured';
    }
}

const findByIdAndDelete = (id: string) => {
    try {
        Profile.findByIdAndDelete(id, (err, res) => {
            console.log('res', res);
            return res;
        })
    } catch (error) {
        return 'error occured';
    }
}

const findByIdAndUpdate = (id: string,) => {
    // try {
    //   Profile.findByIdAndUpdate(id, (err, res) => {
    //     console.log('res', res);
    //     return res;
    //   })
    // } catch (error) {
    //   return 'error occured';
    // }
}

// function createUser(prenom: string, nom: string, email: string){
//   const user = new User(prenom, nom, email);
//   userExistants.push(user);
// }

// function deleteUser(userToDelete: User){
//   userExistants = userExistants.filter((user) => {
//     return user.id != userToDelete.id
//   });
// }

export = {
    find,
    findByIdAndDelete,
    findByIdAndUpdate
}