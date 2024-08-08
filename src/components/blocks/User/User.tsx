import {UserIcon} from "@heroicons/react/24/solid";

interface UserProps {
    name: string;
}

const User = ({name}: UserProps) => {
    return (
        <div className="flex flex-row items-center gap-2">
            <UserIcon className="h-6 w-6"/>
            <span className="font-bold">{name}</span>
        </div>
    )
}

export default User;