import {useSetDialog} from "../../contexts/DialogContextProvider.tsx";
import Button from "../primitives/buttons/Button.tsx";
import {useNavigate} from "react-router-dom";
import TimeSpan from "../blocks/TimeSpan/TimeSpan.tsx";
import User from "../blocks/User/User.tsx";
import BaseDialog from "./BaseDialog.tsx";
import {z} from "zod";
import {FormProvider, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {
    apiV1DatasetsGetByReservationIdRetrieve,
    apiV1ProjectsRetrieve,
    DatasetResponse,
    Reservation, StatusF38Enum,
    useApiV1DatasetsCreate,
} from "../../api.ts";
import {toast} from "react-toastify";
import Alert from "../primitives/alert/Alert.tsx";

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
    const isPast = new Date() > new Date(reservation.to_date);
    const isFuture = new Date() < new Date(reservation.from_date);

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

    const onConfirm = async () => {
        const datasetResponse = await apiV1DatasetsGetByReservationIdRetrieve(reservation.id, {validateStatus: () => true});

        const forbiddenStatuses: StatusF38Enum[] = [StatusF38Enum.finished, StatusF38Enum.discarded];
        if (datasetResponse.status === 200 && forbiddenStatuses.includes(datasetResponse.data!.status!)) {
            return toast("This reservation has already been completed", {type: "error"});
        }
        if (datasetResponse.status === 200) {
            return navigateToDataset(datasetResponse.data);
        }
        if (datasetResponse.status !== 404) {
            console.log(datasetResponse)
            return toast("Failed to retrieve dataset", {type: "error"});
        }

        const projectResponse = await apiV1ProjectsRetrieve(reservation.project_id, {validateStatus: () => true});
        if (projectResponse.status !== 200) {
            console.log(projectResponse);
            return toast("Failed to retrieve project", {type: "error"});
        }
        createDataset({
            data: {
                name: reservation.name,
                description: reservation.description,
                project: reservation.project_id,
                schema: projectResponse.data.default_dataset_schema.id,
                reservationId: reservation.id,
            }
        })
    }

    const navigateToDataset = (dataset: DatasetResponse) => {
        navigate(`/reservation/${dataset.reservationId}`);
        setDialog(null);
    }

    return (
        <BaseDialog
            title={reservation.name}
            content={
                <div>
                    <TimeSpan start={reservation.from_date} end={reservation.to_date} showDate/>
                    <User name={reservation.user}/>
                    <div className="my-2">
                        {reservation.description}
                    </div>
                    {isPast && <Alert severity="warning">This reservation slot already ended!</Alert>}
                    {isFuture && <Alert severity="warning">This reservation slot did not started yet!</Alert>}
                </div>}
            buttons={
                <FormProvider {...methods}>
                    <form onSubmit={methods.handleSubmit(onConfirm)}>
                        <div className="flex flex-row-reverse gap-4">
                            <Button type="submit" loading={isDatasetCreating}>
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