import Section from "../components/layout/Section/Section.tsx";
import ReservationInfo from "../components/blocks/Reservation/ReservationInfo.tsx";
import Experiments from "../components/blocks/Reservation/Experiments/Experiments.tsx";

const ReservationPage = () => {
    return (
        <Section title="Reservation">
            <ReservationInfo />
            <Experiments />
        </Section>
    )
}

export default ReservationPage;