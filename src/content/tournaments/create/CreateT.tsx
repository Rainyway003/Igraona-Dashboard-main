import { Modal, Tabs } from 'antd'
import { useNavigate } from 'react-router'
import { useState } from 'react';
import MultiDayForm from './MultiDayForm';
import OneDayForm from './OneDayForm';
import { useCreate } from '@refinedev/core';
import ShowTournaments from '../ShowTournaments';

const { TabPane } = Tabs

type MultiDayFormValues = {
    tournamentName: string
    game: string
    prize: string
    numOfPlayersPerT: number
    numOfTeams: number
    lastsFrom: string
    lastsUntil: string
}

type OneDayFormValues = {
    tournamentName: string
    game: string
    prize: string
    numOfPlayersPerT: number
    numOfTeams: number
    dateOfT: string
}

const CreateTournament = () => {
    const { mutate, isLoading, isSuccess, error } = useCreate();

    const [isModalVisible, setIsModalVisible] = useState(true);
    const navigate = useNavigate();

    const goToListPage = () => {
        setIsModalVisible(false)
        navigate('/tournaments');
    };

    const onFinishMulti = (values: MultiDayFormValues) => {
        mutate({
            resource: "tournaments",
            values: {
                tournamentName: values.tournamentName,
                game: values.game,
                typeOfT: "MultiDay",
                prize: values.prize,
                numOfPlayersPerT: values.numOfPlayersPerT,
                numOfTeams: values.numOfTeams,
                lastsFrom: values.lastsFrom,
                lastsUntil: values.lastsUntil,
            },
        });
        navigate('/tournaments');
    }

    const onFinishOne = (values: OneDayFormValues) => {
        mutate({
            resource: "tournaments",
            values: {
                tournamentName: values.tournamentName,
                game: values.game,
                typeOfT: "OneDay",
                prize: values.prize,
                numOfPlayersPerT: values.numOfPlayersPerT,
                numOfTeams: values.numOfTeams,
                dateOfT: values.dateOfT,
            },
        });
        navigate('/tournaments');
    }

    return (
        <ShowTournaments>
            <Modal
                open={isModalVisible}
                mask={true}
                onCancel={goToListPage}
                title="Napravi Turnir"
                width={512}
                footer={null}
            >
                <Tabs defaultActiveKey="1" centered>
                    <TabPane tab="MultiDay" key="1">
                        <MultiDayForm onFinish={onFinishMulti} />
                    </TabPane>
                    <TabPane tab="OneDay" key="2">
                        <OneDayForm onFinish={onFinishOne} />
                    </TabPane>
                </Tabs>
            </Modal>
        </ShowTournaments>
    )
}

export default CreateTournament