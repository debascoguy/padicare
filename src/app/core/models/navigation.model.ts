export interface RouteData {
    title?: string;
    status?: boolean;
    breadcrumbs: Breadcrumb[];
    pageAuthorities?: string[],
    extraParameter?: {};
}

export interface Breadcrumb {
    text: string;
    link?: string;
    active?: boolean;
}

export interface SideNavItems {
    [index: number]: SideNavItem;
}

export interface SideNavItem {
    icon?: string;
    text: string;
    link?: string;
    submenu?: SideNavItem[];
}

export interface SideNavSection {
    text?: string;
    items: string[];
}
