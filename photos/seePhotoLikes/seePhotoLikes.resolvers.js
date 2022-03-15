import client from "../../client";
import { protectedResolver } from '../../users/users.utils';
import { processHashtags } from "../photos.utils";

export default {
  Query: {
    seePhotoLikes:
      async (_, { id }) => {
        const likes = await client.user.findMany({
          where: { photoId: id },
          select: { user: { select: { username: true } } }, // "이렇게 하면 likes에서 select한 user에서 username만 select하는 거야."
          // include: { photo: {include: {hashtags:true}}} "hashtags가 있는 photo 배열을 받을 수 있음."
        }); // 중요) select와 include는 같은 레벨에서 동시에 쓸 수 없음.
        return likes.map((like) => like.user); // ==> likes는 an object that contains a user, 그러므로 user만 추출 후 그것들의 배열을 리턴.
      }
  }
}

// seePhoto: async (_, { id }) => client.photo.findUnique({ where: id, }) <== 왜 안되는가?