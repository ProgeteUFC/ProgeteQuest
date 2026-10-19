export const isForumManager = (role: string | null) => role === "admin" || role === "teacher";

export const canCloseForumTopic = (role: string | null, userId: string, authorId: string) =>
  isForumManager(role) || (!!userId && userId === authorId);
