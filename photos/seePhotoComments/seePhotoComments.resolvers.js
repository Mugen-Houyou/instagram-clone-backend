import client from "../../client";
import { protectedResolver } from '../../users/users.utils';
import { processHashtags } from "../photos.utils";

export default {
  Query: {
    seePhotoComments: async (_, { id }) => {
      const comments = await client.comment.findMany({
        where: { photoId: id },
        orderBy: { createdAt: "asc" },
      });
      return comments;
    }
  }
}