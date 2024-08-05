import {ReactNode} from "react";

export interface SideMenuSectionItemType { title: string, item: ReactNode }

interface SideMenuSectionItemProps {
    item: SideMenuSectionItemType;
}

const SideMenuSectionItem = ({item}: SideMenuSectionItemProps) => {
    return <div>
        <h3 className="text font-bold">{item.title}</h3>
        <div className="text-sm font-light">
            {item.item}
        </div>
    </div>
}

export default SideMenuSectionItem;