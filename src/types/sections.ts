import type { ReactElement } from "react";
import type { Role } from "./roles";

export interface SectionMenuType {
  id: string;
  name: string;
  link: string | ReactElement | null;
  icon?: string | null;
  isEnabled: boolean;
  iconPosition: 'left' | 'right';
  parentId: string | null;
  children?: SectionMenuType[] | null;
}
