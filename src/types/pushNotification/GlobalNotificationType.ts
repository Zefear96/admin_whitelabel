export interface GlobalNotificationType {
  title: string;
  body: string;
  category: NotificationTemplateCategoryEnum;
}

export enum NotificationTemplateCategoryEnum {
  NEWS = "NEWS",
  SYSTEM = "SYSTEM",
}