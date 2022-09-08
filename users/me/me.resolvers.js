
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import client from "../../client";
import { protectedResolver } from "../users.utils";


export default {
  Query:{
    me: protectedResolver( (_,__,{loggedInUser})=> // No arguments, no parent to care.
      client.user.findUnique({where:{id:loggedInUser.id}})
    ),
  },
};