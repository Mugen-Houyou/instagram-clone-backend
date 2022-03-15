import client from "../../client";
import { protectedResolver } from '../../users/users.utils';
import { processHashtags } from "../photos.utils";

export default {
  Mutation: {
    deletePhoto: protectedResolver(
      async (_, { id, }, { loggedInUser }) => {
        const photo = await client.photo.findUnique({
          where: { id, },
          select: { userId: true },
        });
        if (!photo) {
          return { ok: false, error: "ERROR: FAILED TO DELETE THE PHOTO" };
        } else if (photo.userId !== loggedInUser.id) {
          return { ok: false, error: "ERROR: FAILED TO DELETE THE PHOTO" };
        } else {
          await client.photo.delete({ where: { id }, })
          return { ok: true, }
        }
      })
  }
}

// seePhoto: async (_, { id }) => client.photo.findUnique({ where: id, }) <== 왜 안되는가?