import client from "../../client";

export default {
  Query: {
    seePhoto: async (_, { id }) => client.photo.findUnique({ where: { id }, })
  }
}

// seePhoto: async (_, { id }) => client.photo.findUnique({ where: id, }) <== 왜 안되는가?