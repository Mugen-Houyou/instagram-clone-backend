import bcrypt from "bcrypt";
import client from "../../client";

export default {
  Mutation: {
    createAccount: async (
      _,
      { firstName, lastName, username, email, password }
    ) => {
      try {
        const existingUser = await client.user.findFirst({
          where: {
            OR: [
              { username, }, { email, },
            ],
          },
        });

        if (existingUser) throw new Error("This username/password is already taken.");

        console.log("Generating the password hash...")
        // 주의: Increasing the cost factor by 1 doubles the necessary time. 
        const uglyPassword = await bcrypt.hash(password, 16); 
        console.log("Password hash done!")
        await client.user.create({
          data: {
            username,
            email,
            firstName,
            lastName,
            password: uglyPassword,
          },
        });
        // return client.user.create({
        //   data: {
        //     username,
        //     email,
        //     firstName,
        //     lastName,
        //     password: uglyPassword,
        //   },
        // });
        return {
          ok: true,
        };
      } catch (e) {
        return e;
      }
    },
  },
};
