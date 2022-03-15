import client from "../../client";
import { protectedResolver } from '../../users/users.utils';
import { processHashtags } from "../photos.utils";

export default {
  Mutation: {
    toggleLike: protectedResolver(
      async (_, { id, caption }, { loggedInUser }) => {
        const photo = await client.photo.findUnique({
          where: { id },
        });
        if (!photo) return { ok: false, error: "ERROR: FAILED TO LIKE THE PHOTO" }

        const likeWhere = {
          photoId_userId: {
            userId: loggedInUser.id,
            photoId: id,
          },
        };

        const like = await client.like.findUnique({
          where: {
            photoId_userId: {
              userId: loggedInUser.id,
              photoId: id,
            }
          },  // "이게 바로 이전 영상에서 말했던 것처럼 두 필드를 합쳐서 unique한 값을 만드는 것이야"
        });   //  @@unique([photoId, userId]) 이거 연결하는 거.
        if (like) {
          await client.like.delete({
            where: likeWhere, // 이렇게 중복되는 부분을 대체할 수도 있음
          });
        } else {
          await client.like.create({
            data: {
              user: { connect: { id: loggedInUser.id } },
              photo: { connect: { id: photo.id } },
            }
          })
        }
        return { ok: true };
      }),
  },
}



// seePhoto: async (_, { id }) => client.photo.findUnique({ where: id, }) <== 왜 안되는가?