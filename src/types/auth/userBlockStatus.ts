export type UserBlockStatus = {
  blocked: boolean;
};

export function normalizeUserBlockStatus(data: unknown): UserBlockStatus {
  if (typeof data === "boolean") {
    return { blocked: data };
  }

  if (data && typeof data === "object") {
    const record = data as Record<string, unknown>;

    if (typeof record.blocked === "boolean") {
      return { blocked: record.blocked };
    }

    if (typeof record.isBlocked === "boolean") {
      return { blocked: record.isBlocked };
    }

    if (typeof record.status === "string") {
      return { blocked: record.status.toUpperCase() === "BLOCKED" };
    }
  }

  return { blocked: false };
}
