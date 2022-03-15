import client from '../../client';
import { protectedResolver } from '../../users/users.utils';

export default {
  Mutation: {
    uploadPhoto: protectedResolver(async (_, { file, caption }, { loggedInUser }) => {
      let hashtagObj = [];
      if (caption) { hashtagObj = processHashtags(caption); }

      // 사진 저장
      return client.photo.create({
        data: {
          file,
          caption,
          user: {
            connect: {
              id: loggedInUser.id,
            }
          },
          ...(hashtagObj.length > 0 && {
            hashtags: { connectOrCreate: hashtagObj }
          }),
        }
      })
      // WITH the parsed hashtags

      // 해시태그에 해당 Photo 추가
    }),
  }
}