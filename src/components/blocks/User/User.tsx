import {UserIcon} from "@heroicons/react/24/solid";


const User = () => {
    return (
        <div className="flex flex-row items-center gap-4">
            <UserIcon className="h-6 w-6"/>
            <span>David Konečný</span>
        </div>
    )
}

export default User;