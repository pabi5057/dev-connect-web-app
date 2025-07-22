export type Post = {
  _id: string
  title: string
  content: string
  image: string
  user: {
    username: string
    profilePicture?: string
  };
  likes?: string[]; // array of user IDs
  comments?: { text: string; userId: string; username: string }[];
}
