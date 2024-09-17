import {useSetDialog} from "../../contexts/DialogContextProvider.tsx";
import Button from "../primitives/buttons/Button.tsx";
import TextInput from "../primitives/form/TextInput.tsx";
import {useNavigate} from "react-router-dom";
import {Event} from "../blocks/Agenda/AgendaEvent.tsx";
import TimeSpan from "../blocks/TimeSpan/TimeSpan.tsx";
import User from "../blocks/User/User.tsx";
import BaseDialog from "./BaseDialog.tsx";
import {z} from "zod";
import {FormProvider, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";

const schema = z.object({
    code: z.string(),
})

type CodeFormValues = z.infer<typeof schema>;

const ConfirmIdentityDialog = ({reservation}: { reservation: Event }) => {
    const setDialog = useSetDialog();
    const navigate = useNavigate();
    const methods = useForm<CodeFormValues>({
        resolver: zodResolver(schema),
    })

    const onConfirm = () => {
        setDialog(null);
        navigate(`/reservation/${reservation.id}`,);
    }

    return (
        <BaseDialog
            title={reservation.title}
            content={
                <div>
                    <TimeSpan start={reservation.start} end={reservation.end}/>
                    <User name={reservation.user}/>
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
                <FormProvider {...methods}>
                    <form onSubmit={methods.handleSubmit(onConfirm)}>
                        <div className="flex flex-row-reverse gap-4">
                            <Button type="submit">
                                Confirm
                            </Button>
                            <TextInput<CodeFormValues> fieldName="code" autoFocus/>
                        </div>
                    </form>
                </FormProvider>
            }/>
    )
}

export default ConfirmIdentityDialog;