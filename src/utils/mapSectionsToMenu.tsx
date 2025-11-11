import type { MenuProps } from 'antd';
import type { Section } from '../types/sections';
import { Link } from 'react-router-dom';  // <-- вот здесь

type MenuItem = Required<MenuProps>['items'][number];

export function mapSectionsToMenuItems(sections:Section[]): MenuItem[] {
  return sections.map((section) => ({
    key: section.id,
    label: typeof section.link === 'string' ? (
      <Link to={section.link}>{section.name}</Link>
    ) : (
      section.name
    ),
    icon: section.icon,
    children: section.children?.length ? mapSectionsToMenuItems(section.children) : undefined,
  }));
}

