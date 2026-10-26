export type AuditTransferTeacherData = {
  classIds: string[];
  fromTeacherId: string;
  toTeacherId: string;
};

export type AuditPermanentDeletionUserSnapshot = {
  userId: string;
  name: string;
  email: string;
  type: string;
};

export type AuditPermanentDeletion = {
  changes: AuditPermanentDeletionUserSnapshot;
  reason: string;
};
