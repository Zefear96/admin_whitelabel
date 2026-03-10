export interface RequestBodyNotificationType {
  notificationType: "GLOBAL_EIB_NEWS";
  title: string;
  body: string;
  imageUrl: string | null;
}