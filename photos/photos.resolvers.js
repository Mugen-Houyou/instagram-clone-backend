import client from "../client"

export default {
  Photo: {
    user: (parent) => client.user.findUnique({ where: { id: parent.userId } }),
    hashtags: ({ id }) => client.hashtag.findMany({
      where: {
        photos: { some: { id } }
      }
    }),
    likes: ({ id }) => client.like.count({ where: { photoId: id } }),
    comments: ({ id }) => client.comment.count({ where: { photoId: id } }),
    isMine: ({ userId }, _, { loggedInUser }) => {
      if (loggedInUser) return userId === loggedInUser.id;
      else return false
    },
    isLiked: async ({ id }, _, { loggedInUser }) => {
      if (!loggedInUser) return false;

      const ok = await client.like.findUnique({
        where:{photoId_userId:{ photoId:id, userId:loggedInUser.id}},
        select:{ id:true } // id가 존재하는지만 체크하므로.
      });
      if (ok) return true;
      return false
    }
    
  },
  Hashtag: {
    photos: ({ id }, { page }) => {
      return client.hashtag
        .findUnique({
          where: { id, },
        })
        .photos();
    },
    totalPhotos: ({ id }) => {
      console.log({ id });
      return client.photo.count({
        where: {
          hashtags: { some: { id }, },
        },
      })
    }
  },
}