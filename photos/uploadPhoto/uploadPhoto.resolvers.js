import client from '../../client';
import { uploadToS3 } from "../../shared/shared.utils";
import { protectedResolver } from '../../users/users.utils';
import { processHashtags } from "../photos.utils";
import { GraphQLUpload } from 'graphql-upload';

export default {

  Upload: GraphQLUpload,
  Mutation: {
    uploadPhoto: protectedResolver(async (_, { file, caption }, { loggedInUser }) => {
      let hashtagObj = [];
      if (caption) { hashtagObj = processHashtags(caption); }
      const fileUrl = await uploadToS3(file, loggedInUser.id, "uploads");
      // 사진 저장
      return client.photo.create({
        data: {
          file: fileUrl,
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