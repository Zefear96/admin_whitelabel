import type { Role } from "../types/roles";
import type { SectionMenuType } from "../types/sections";

export function filterEnabledSections(sections : SectionMenuType[]): SectionMenuType[] {
  return sections
    .filter((section) => section.isEnabled)
    .map(section => ({
        ...section,
        children: section.children ? filterEnabledSections(section.children) : undefined,
    }))
    // .filter(section => section.children?.length || !section.children); // убираем пустых родителей
}