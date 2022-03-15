import client from "../../client";
import { protectedResolver } from '../../users/users.utils';
import { processHashtags } from "../photos.utils";

export default {
  Mutation: {
    editPhoto: protectedResolver(
      async (_, { id, caption }, { loggedInUser }) => {
        const photo = await client.photo.findFirst({
          where: { id, userId: loggedInUser.id },
          include: { hashtags: { select: { hashtag: true, }, }, },
        });
        if (!photo)
          return { ok: false, error: "ERROR: FAILED TO EDIT THE PHOTO" }
        const updatedPhoto = await client.photo.update({
          where: { id },
          data: {
            caption,
            hashtags: {
              disconnect: photo.hashtags,
              connectOrCreate: processHashtags(caption),
            },
          }
        });
        return { ok: true, }
      })
  }
}

// seePhoto: async (_, { id }) => client.photo.findUnique({ where: id, }) <== 왜 안되는가?