import { Router, Request, Response } from 'express';
import passport from 'passport';
import { IProfile } from "../models/profiles";
import { ProfileNotFoundError } from '../controllers/authentfication';


const router = Router();


router.post("/", (req: Request, res: Response) => {
  passport.authenticate("local", (err, profile: IProfile) => {
      if (err) {
        
      if (err instanceof ProfileNotFoundError) {
        return res.status(404).send("Profile not found");
      } else {
        return res.status(500).send("Il y a eu une erreur");
      }
    }
    if (profile) {
      // Creer une session avec req.logIn / express Session
      req.logIn(profile, (err) => {
        if (err) {
          console.error(err);
          return res.status(500).send("Erreur pendant la connexion");
          }
          console.log(req.body);
        return res.send(profile.getSafeProfile());
      })
    } else {
      return res.status(401).send("Il y a eu une erreur");
    }
  })(req, res);
});

router.get("/logout", (req: Request, res: Response) => {
  if (req.isAuthenticated()) req.logout();
  req.session?.destroy((error) => {
    if (error) {
      return res
        .status(200)
        .send("User logout success but session not destroy");
    } else {
      res.clearCookie("session_cookie_id");
      req.session = undefined;
      return res.status(200).send("User logout success");
    }
  });
});

export default router;