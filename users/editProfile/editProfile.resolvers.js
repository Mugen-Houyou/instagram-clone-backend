import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import fs, { createWriteStream } from 'fs';

import client from "../../client"; 
import { protectedResolver } from "../users.utils";



export default {
  Mutation: {
    editProfile: protectedResolver( async (
      _,
      { firstName, lastName, username, email, password: newPassword, bio , avatar },
      { loggedInUser, protectResolver } //"context에 넣어놓는 건 모든 resolver에서 접근 가능. "
    ) => {
      let avatarUrl = null;
      if(avatar){
        console.log(avatar);
        const {filename, createReadStream} =  await avatar;
        const newFilename=`${loggedInUser.id}-${Date.now()}-${filename}`;
        const readStream = createReadStream();
        const writeSteam = fs.createWriteStream(process.cwd()+"/uploads/"+ newFilename);
        readStream.pipe(writeSteam);
        avatarUrl = `http://localhost:4000/static/${newFilename}`;
      }
      let uglyPassword = null;
      if (newPassword) {
        uglyPassword = await bcrypt.hash(newPassword, 10);
      }
      const updatedUser = await client.user.update({
        where: {
          id:loggedInUser.id, 
        },
        data: {
          firstName,
          lastName,
          username,
          email,
          bio,
          ...(uglyPassword && { password: uglyPassword }),  //만약 uglyPassword 존재 시 password에 uglyPassword를 넣음.
          ...(avatarUrl && { avatar: avatarUrl }), 
        },
      });
      if (updatedUser.id) {
        return {
          ok: true,
        };
      } else {
        return {
          ok: false,
          error: "Could not update profile.",
        };
      }
    },)
  },
};
