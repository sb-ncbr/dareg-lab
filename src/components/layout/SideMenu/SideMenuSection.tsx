import SideMenuSectionItem, {SideMenuSectionItemType} from "./SideMenuSectionItem.tsx";
import Skeleton from "../../primitives/skeleton/Skeleton.tsx";

interface SideMenuSectionProps {
    title: string;
    items: SideMenuSectionItemType[];
}

const SideMenuSection = ({ title, items }: SideMenuSectionProps) => {
    return <div>
        <h2 className="text-xl font-extrabold">{title}</h2>
        <div className="flex flex-col gap-1">
            {items.map((item, index) => <SideMenuSectionItem item={item} key={index} /> )}
            {items.length === 0 && <Skeleton className="h-40" /> }
        </div>
    </div>
}

export default SideMenuSection;