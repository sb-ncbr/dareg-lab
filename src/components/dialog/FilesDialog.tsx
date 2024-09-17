import Button from "../primitives/buttons/Button.tsx";
import BaseDialog from "./BaseDialog.tsx";
import FileCard from "../blocks/File/FileCard.tsx";

const ConfirmIdentityDialog = () => {

    return (
        <BaseDialog
            title="Files"
            content={
                <div className="flex flex-col gap-2">
                    <FileCard />
                    <FileCard />
                    <FileCard />
                    <FileCard />
                    <FileCard />
                    <FileCard />
                    <FileCard />
                    <FileCard />
                </div>}
            buttons={
                <div className="flex flex-row-reverse gap-4">
                    <Button type="submit">
                        Close
                    </Button>
                </div>
            }/>
    )
}

export default ConfirmIdentityDialog;