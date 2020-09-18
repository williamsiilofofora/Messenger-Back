import { Router, Request, Response } from 'express';
import { IProfile, Profile  } from '../models/profiles';
import { authenticationRequired } from '../middlewares/authenticationRequired';
import { getAllProfiles, getProfile, updateProfile } from "../controllers/profiles";
const router = Router();

// route profil user
router.get("/me", authenticationRequired,
  (request: Request, response: Response) => {
    if (!request.user) {
      return response.status(401).send();
    }
    return response.json((request.user as IProfile).getSafeProfile());
  }
);

// route pour tout les profils
router.get("/", authenticationRequired, (req: Request, res: Response) => {
      getAllProfiles()
        .then((profiles) => profiles.map((profile) => profile.getSafeProfile()))
        .then((safeProfiles) => {
          return res.status(200).send(safeProfiles);
        })
          .catch((error) => {
                  console.error(error);
          return res.status(500).send();
        });
})

// route profil ID
router.get('/:id', authenticationRequired, (req: Request, res: Response) => {
    const profileId = req.params['id'];

     getProfile(profileId)
       .then((profile) => {
         if (profile === null) {
           return res.status(404).send("Profile not found");
         }
         return res.send(profile.getSafeProfile());
       })
       .catch((error) => {
         console.error(error);
         return res.status(500).send();
       });
});

// route création profil
router.post('/', (req: Request, res: Response) => {
    const { email, firstname, lastname, password } = req.body;

    const newProfile = new Profile({ email: email, firstname: firstname, lastname: lastname })
    newProfile.setPassword(password);
     newProfile
       .save()
       .then((profile) => {
         return res.send(profile.getSafeProfile());
       })
       .catch((error) => {
         console.error(error);
         return res.status(500).send();
       });

    // res.status(200).send('Utimlisateur crée !');7
});
// route modifier profil
router.patch('/', authenticationRequired ,(req: Request, res: Response) => {
  
    if (!req.user) {
      return res.status(401).send();
    }
    
  
const { email, firstname, lastname, password } = req.body;

updateProfile(req.user as IProfile, email, firstname, lastname, password)
  .then(profile => {
    if (!profile) {
      res.status(404).send("Profile non trouvé");
      return res.status(200).send(profile.getSafeProfile());
    }
  })
  .catch(error => {
    console.error(error);
    return res.status(500).send();
   })
})

// route delete profil
router.delete('/',authenticationRequired, (req: Request, res: Response) => {
    if (!req.user) {
      return res.status(401).send();
    }
    (req.user as IProfile)
      .deleteOne()
      .then((_profile) => res.status(200).send("Utilisateur supprimé"))
      .catch((error) => {
        console.error(error);
        return res.status(500).send();
      });
});
router.patch(
  "/conversation-seen/:conversationId",
  authenticationRequired,
  async (req: Request, res: Response) => {
    const user = req.user as IProfile;
    const conversationId = req.params["conversationId"];

    user.updateSeen(conversationId, new Date().toISOString());
    const savedUser = await user.save();
    return res.status(200).send(savedUser);
  }
);


export default router;