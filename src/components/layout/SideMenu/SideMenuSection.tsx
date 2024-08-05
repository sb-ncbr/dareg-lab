import SideMenuSectionItem, {SideMenuSectionItemType} from "./SideMenuSectionItem.tsx";

interface SideMenuSectionProps {
    title: string;
    items: SideMenuSectionItemType[];
}

const SideMenuSection = ({ title, items }: SideMenuSectionProps) => {
    return <div>
        <h2 className="text-xl font-extrabold">{title}</h2>
        <div className="flex flex-col gap-1">
            {items.map((item, index) => <SideMenuSectionItem item={item} key={index} /> )}
        </div>
    </div>
}

export default SideMenuSection;