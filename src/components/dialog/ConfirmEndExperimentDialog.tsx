import {useSetDialog} from "../../contexts/DialogContextProvider.tsx";
import Button from "../primitives/buttons/Button.tsx";
import {useNavigate} from "react-router-dom";
import BaseDialog from "./BaseDialog.tsx";
import {DatasetResponse} from "../../api.ts";

const ConfirmEndExperimentDialog = ({dataset}: { dataset: DatasetResponse }) => {
    const setDialog = useSetDialog();
    const navigate = useNavigate();

    const onConfirm = () => {
        setDialog(null);
        navigate("/agenda");
    }

    return (
        <BaseDialog
            title={`End ${dataset.name}?`}
            content={
                <div>
                    {/*<TimeSpan start={reservation.start} end={reservation.end}/>*/}
                    {/*<User name={reservation.user}/>*/}
                    <div className="mt-4">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean mollis felis urna, a luctus ex
                        egestas
                        mollis. Mauris at purus tempus risus interdum euismod. Sed mauris turpis, molestie ut tristique
                        sed,
                        aliquet pulvinar est. Sed mauris lectus, imperdiet ut commodo vel, mattis in ex. Suspendisse
                        eget
                        purus
                        sed nulla lacinia fringilla. Ut vestibulum odio nulla, in euismod sem tincidunt rutrum. Nunc
                        iaculis
                        risus at urna mollis, non vehicula risus sagittis.
                    </div>
                </div>}
            buttons={
                <Button type="button" onClick={onConfirm}>
                    Confirm
                </Button>
            }/>
    )
}

export default ConfirmEndExperimentDialog;