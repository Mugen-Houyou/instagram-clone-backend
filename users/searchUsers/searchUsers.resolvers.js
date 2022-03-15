import client from "../../client";


export default {
    Query: {
        searchUsers: async (_, { keyword }) =>
            await client.user.findMany({
                where: { OR: [
                    { username: { startsWith: keyword.toLowerCase() } }, 
                    { username: { contains: keyword.toLowerCase() } }
                ] },
            })

    }
}
