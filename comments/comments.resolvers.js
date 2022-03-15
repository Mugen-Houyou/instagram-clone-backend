
export default {
  Comment: {
    isMine: ({ userId }, _, { loggedInUser }) => {
      if (loggedInUser) return userId === loggedInUser.id;
      else return false
    }
  }
}