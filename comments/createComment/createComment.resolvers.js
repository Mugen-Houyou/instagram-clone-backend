import client from "../../client"
import { protectedResolver } from '../../users/users.utils'

export default {
  Mutation: {
    createComment: protectedResolver(async (_, { photoId, payload }, { loggedInUser }) => {
      const ok = await client.photo.findUnique({
        where: { id: photoId },
        select: { id: true }, // id만 로드함. 왜? 사진 찾는 거만 필요하니까. 나머지 정보는 필요 없음.
      });
      if (!ok) return { ok: false, error: "ERROR: FAILED TO FIND THE PHOTO" }
      await client.comment.create({
        data: {
          payload,
          photo: { connect: { id: photoId } },
          user: { connect: { id: loggedInUser.id } },
        }
      });
      return { ok: true }
    }),
  }
}