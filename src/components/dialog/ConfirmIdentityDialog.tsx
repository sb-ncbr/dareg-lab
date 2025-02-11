import {useSetDialog} from "../../contexts/DialogContextProvider.tsx";
import Button from "../primitives/buttons/Button.tsx";
import {useNavigate} from "react-router-dom";
import TimeSpan from "../blocks/TimeSpan/TimeSpan.tsx";
import User from "../blocks/User/User.tsx";
import BaseDialog from "./BaseDialog.tsx";
import { z } from "zod";
import {FormProvider, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {
    DatasetResponse,
    Reservation,
    useApiV1DatasetsCreate,
    useApiV1DatasetsGetByReservationIdRetrieve
} from "../../api.ts";
import {toast} from "react-toastify";

const schema = z.object({
    code: z.string(),
})

type CodeFormValues = z.infer<typeof schema>;

const ConfirmIdentityDialog = ({reservation}: { reservation: Reservation }) => {
    const setDialog = useSetDialog();
    const navigate = useNavigate();
    const methods = useForm<CodeFormValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            code: "",
        }
    })

    const {
        mutate: createDataset,
        isPending: isDatasetCreating
    } = useApiV1DatasetsCreate({
        mutation: {
            onSuccess: data => {
                toast("Dataset created successfully", {type: "success"});
                navigateToDataset(data.data);
            },
            onError: error => {
                toast("Failed to create dataset", {type: "error"});
                console.log(error)
            }
        }
    })

    const {data: datasetData, isPending: isDatasetLoading} = useApiV1DatasetsGetByReservationIdRetrieve(reservation.id, {
        query: {
            retry: false
        }
    });
    const dataset = datasetData?.data

    const navigateToDataset = (dataset: DatasetResponse) => {
        navigate(`/reservation/${dataset.id}`);
        setDialog(null);
    }

    const onConfirm = async () => {
        if (dataset) {
            return navigateToDataset(dataset);
        }

        createDataset({
            data: {
                name: reservation.name,
                description: reservation.description,
                project: "8c718e41-c460-491e-bcb5-44e6179c0874",
                schema: "6947c715-22d4-4704-b652-f6817d89755e",
                reservationId: reservation.id
            }
        })
    }

    return (
        <BaseDialog
            title={reservation.name}
            content={
                <div>
                    <TimeSpan start={reservation.from_date} end={reservation.to_date} showDate/>
                    <User name={reservation.user}/>
                    <div className="mt-4">
                        {reservation.description}
                    </div>
                </div>}
            buttons={
                <FormProvider {...methods}>
                    <form onSubmit={methods.handleSubmit(onConfirm)}>
                        <div className="flex flex-row-reverse gap-4">
                            <Button type="submit" loading={isDatasetCreating} disabled={isDatasetLoading}>
                                Confirm
                            </Button>
                            {/*<TextInput<CodeFormValues> fieldName="code" autoFocus/>*/}
                        </div>
                    </form>
                </FormProvider>
            }/>
    )
}

export default ConfirmIdentityDialog;