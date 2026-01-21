export class MenuItem {
    label: string;
    href?: string;       // For #section scrolling
    routerLink?: string; // For internal page navigation
    icon: string;
    expanded?: boolean;
    subMenu?: MenuItem[];

    constructor(options: {
        label: string;
        href?: string;
        routerLink?: string;
        icon: string;
        expanded?: boolean;
        subMenu?: MenuItem[];
    }) {
        this.label = options.label;
        this.href = options.href;
        this.routerLink = options.routerLink;
        this.icon = options.icon;
        this.expanded = options.expanded;
        this.subMenu = options.subMenu;
    }
}