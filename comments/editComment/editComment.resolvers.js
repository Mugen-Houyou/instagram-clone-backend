import client from "../../client";
import { protectedResolver } from '../../users/users.utils';

export default {
  Mutation: {
    editComment: protectedResolver(
      async (_, { id, payload }, { loggedInUser }) => {
        const comment = await client.comment.findUnique({
          where: { id, },
          select: { userId: true },
        });
        if (!comment) {
          return { ok: false, error: "ERROR: FAILED TO EDIT THE COMMENT" };
        } else if (comment.userId !== loggedInUser.id) {
          return { ok: false, error: "ERROR: FAILED TO EDIT THE COMMENT" };
        } else {
          await client.comment.update({
            where: { id },
            data: { payload, },
          })
          return { ok: true, }
        }
      })
  }
}

// seePhoto: async (_, { id }) => client.photo.findUnique({ where: id, }) <== 왜 안되는가?