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