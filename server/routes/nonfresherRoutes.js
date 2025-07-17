import express from "express";
import nonfresherController from "../controller/nonfresherController.js";
const router = express.Router();
import jwt from "jsonwebtoken";
import emailmap from "../../data-gen/email_map.json" with { type: "json" };

router.use(async (req, res, next) => {
  const token = req.get("X-Alloc8-IDToken");
  if (token == undefined) {
    res.sendStatus(401);
    return;
  }

  const keys = req.app.get("keys");
  const pems = req.app.get("pems");
  const myjwt = jwt.decode(token, { complete: true })
  if (myjwt == null) {
    res.sendStatus(401);
  }
  const kid = myjwt.header.kid;
  let i;
  for (i = 0; i < keys.length; i++) {
    if (keys[i].kid == kid) break;
  }
  try {
    res.locals.jwt = jwt.verify(token, pems[i], {
      algorithms: "RS256",
      /* TODO: add these to config.json - pranjal */
      audience: process.env.AUDIENCE,
      issuer:
        "https://login.microsoftonline.com/a57f7d92-038e-4d4c-8265-7cd2beb33b34/v2.0",
    });

    let email = res.locals.jwt.email;
    if (!Object.keys(emailmap).includes(email)) {
        console.error("Invalid email: ", email);
        res.sendStatus(401);
        return;
    }
    res.locals.batch = emailmap[email]["batch"]
    res.locals.gender = emailmap[email]["gender"]
    res.locals.rollNumber = emailmap[email]["rollNumber"]
    res.locals.name = res.locals.jwt.name;
    next();
  } catch (e) {
    res.sendStatus(401);
  }
});

//if allocated then get this and show to client
router.get("/allocated-details", nonfresherController.showDetails);
//apis needed
// - get the detail of the hostel one is eligible for , the live real time status of the rooms vacancy
// -  post self willingness choice of the hostel

router.post("/room-status", nonfresherController.getRoom);
router.post("/room-booking", nonfresherController.roomBooking);

export default router;
/* vi: set et sw=2: */
