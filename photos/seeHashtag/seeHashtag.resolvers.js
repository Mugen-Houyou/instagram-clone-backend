import client from "../../client";

export default {
  Query: {
    seeHashtag: async (_, { hashtag }) => client.hashtag.findUnique({ where: { hashtag }, })
  }
}

// seePhoto: async (_, { id }) => client.photo.findUnique({ where: id, }) <== 왜 안되는가?