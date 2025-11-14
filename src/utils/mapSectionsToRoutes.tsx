import { Route } from "react-router-dom";
import type { ReactElement } from "react";

// Здесь можно указать дефолтный компонент для страниц,
// пока с бэка не будет приходить информация какой именно компонент грузить
import DynamicPage from "../pages/dashboard/DynamicPage";
import type { SectionMenuType } from "../types/sections";
import ContentEib from "../pages/dashboard/layout/ContentEib";

export function mapSectionsToRoutes(sections: SectionMenuType[] | null): ReactElement[] {
  if (!sections) return [];
  return sections.flatMap((section) => [
    <Route key={section.id} path={String(section.link).replace(/^\//, '')} element={<DynamicPage title={section.name}/>} />,
    ...(section.children?.length ? mapSectionsToRoutes(section.children) : []),
  ]);
}
