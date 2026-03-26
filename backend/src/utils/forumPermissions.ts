export enum TopicStatus {
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
}

export interface ForumContextUser {
  id: string;
  isTeacher: boolean;
  isStudent: boolean;
}

export interface TopicContext {
  authorId: string;
  status: TopicStatus;
}

export function canCreateTopic(
  user: ForumContextUser,
  isStudentInClass: boolean,
): boolean {
  if (!user.isStudent) {
    return false;
  }

  return isStudentInClass;
}

export function canAnswer(
  user: ForumContextUser,
  topic: TopicContext,
  isUserInClass: boolean,
): boolean {
  if (topic.status === TopicStatus.CLOSED) {
    return false;
  }

  if (user.isTeacher) {
    return true;
  }

  if (user.isStudent && isUserInClass) {
    return true;
  }

  return false;
}

export function canClose(user: ForumContextUser, topic: TopicContext): boolean {
  if (user.isTeacher) {
    return true;
  }

  return user.id === topic.authorId;
}
