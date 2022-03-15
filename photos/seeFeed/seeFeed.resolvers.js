import client from "../../client";
import { protectedResolver } from '../../users/users.utils';
import { processHashtags } from "../photos.utils";

export default {
  Query: {
    seeFeed: protectedResolver(
      async (_, __, { loggedInUser }) => {
        return client.photo.findMany({
          where: {
            OR: [
              { user: { followers: { some: { id: loggedInUser.id, }, }, }, }, // 나를 팔로우하는 유저의 사진들.
              { userId: loggedInUser.id }, // 내 사진들
            ]
          },
          orderBy: { createdAt: "desc" },
        })
      }),
  },
}

// seePhoto: async (_, { id }) => client.photo.findUnique({ where: id, }) <== 왜 안되는가?