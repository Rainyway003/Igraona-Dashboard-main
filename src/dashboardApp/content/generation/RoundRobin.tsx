import React, {PropsWithChildren, useEffect, useRef, useState} from 'react';
import {Button, Form, Input, InputNumber, Modal, Spin, Table} from 'antd';
import {useCreate, useList, useOne, useUpdate} from "@refinedev/core"
import {CreateButton} from '@refinedev/antd';
import {useParams} from 'react-router';
import {MinusCircleOutlined, PlusOutlined} from '@ant-design/icons';

const RoundRobin: React.FC<PropsWithChildren> = ({children}) => {
    const [form] = Form.useForm();
    const [pairs, setPairs] = useState<any[]>([])
    const {mutate, isLoading} = useCreate()
    const {mutate: updateBracket} = useUpdate()
    const {id} = useParams();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentBracket, setCurrentBracket] = useState<any>(null);

    useEffect(() => {
        if (isModalOpen) {
            form.resetFields()
            if (!currentBracket?.results?.length) {
                form.setFieldsValue({results: [{}]})
            }
        }
    }, [isModalOpen, currentBracket]);

    useEffect(() => {
        if (currentBracket?.results?.length) {
            const parsedResults = currentBracket.results.map((r) => {
                const [first, second] = r.split("-").map(Number)
                return {first, second}
            });

            form.setFieldsValue({results: parsedResults})
        } else if (isModalOpen) {
            form.setFieldsValue({results: [{}]})
        }
    }, [currentBracket, isModalOpen])

    const {data: tournamentData} = useOne({
        resource: "tournaments",
        id: id,
    })

    const {data: teamData} = useList({
        resource: "participants",
        meta: {
            tournamentId: id,
        },
    });

    const {data: bracketsData} = useList({
        resource: "brackets",
        meta: {
            tournamentId: id,
        },
        sorters: [
            {
                field: "number",
                order: "asc",
            },
        ],
    });

    const tournament = tournamentData?.data;
    const maxNumberOfParticipants = tournament?.numberOfParticipants

    const cleanObject = (obj: Record<string, any>) =>
        Object.fromEntries(Object.entries(obj).filter(([_, v]) => v !== undefined));

    function createPairs(teams) {
        const players = [...teams];
        let number = 1;
        const round = []

        const rounds = maxNumberOfParticipants - 1
        const roundBrackets = maxNumberOfParticipants / 2

        if (players.length % 2 !== 0) {
            players.push(null);
        }

        for (let r = 1; r <= rounds; r++) {
            for (let i = 0; i < roundBrackets; i++) {
                const team1 = players[i];
                const team2 = players[players.length - 1 - i] || null;

                mutate({
                    resource: "brackets",
                    values: cleanObject({
                        team1: team1,
                        team2: team2,
                        tournamentId: id,
                        number: number++,
                        round: r
                    }),
                    successNotification: false
                })
                round.push([team1, team2]);
            }
            players.splice(1, 0, players.pop());
        }

        return round;
    }

    const getRounds = () => {
        const brackets = bracketsData?.data || [];
        const rounds = {};

        brackets.forEach(bracket => {
            const round = bracket.round || 1;
            if (!rounds[round]) rounds[round] = [];
            rounds[round].push(bracket);
        });

        return rounds;
    };

    const createStandingsTable = () => {
        const participants = teamData?.data || [];
        const brackets = bracketsData?.data || [];

        const standings = participants.map(participant => {
            let pobjede = 0;
            let gubitci = 0;
            let neriješeno = 0
            let odigrane = 0;

            brackets.forEach(bracket => {
                if (bracket.results && bracket.results.length > 0) {
                    const isTeam1 = bracket.team1?.id === participant.id || bracket.team1 === participant.id;
                    const isTeam2 = bracket.team2?.id === participant.id || bracket.team2 === participant.id;

                    if (isTeam1 || isTeam2) {
                        let team1TotalScore = 0;
                        let team2TotalScore = 0;

                        bracket.results.forEach(result => {
                            const [score1, score2] = result.split('-').map(Number);
                            team1TotalScore += score1;
                            team2TotalScore += score2;
                        });

                        if (isTeam1) {
                            if (team1TotalScore > team2TotalScore) pobjede++;
                            else if (team1TotalScore < team2TotalScore) gubitci++;
                            else neriješeno++;
                        } else if (isTeam2) {
                            if (team2TotalScore > team1TotalScore) pobjede++;
                            else if (team2TotalScore < team1TotalScore) gubitci++;
                            else neriješeno++;
                        }
                        odigrane++;
                    }
                }
            });

            return {
                key: participant.id,
                name: participant.name,
                odigrane,
                pobjede,
                neriješeno,
                gubitci,
            };
        });

        return standings.sort((a, b) => {
            if (b.pobjede !== a.pobjede) return b.pobjede - a.pobjede;
        });
    };

    const tableColumns = [
        {
            title: 'Pozicija',
            key: 'position',
            render: (text, record, index) => index + 1,
            width: 80,
        },
        {
            title: 'Tim',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Pobjede',
            dataIndex: 'pobjede',
            key: 'pobjede',
            width: 80,
        },
        {
            title: 'Neriješeno',
            dataIndex: 'neriješeno',
            key: 'neriješeno',
            width: 80,
        },
        {
            title: 'Porazi',
            dataIndex: 'gubitci',
            key: 'gubitci',
            width: 80,
        },
        {
            title: 'Odigrano',
            dataIndex: 'odigrane',
            key: 'odigrane',
            width: 100,
        },
    ];

    if (isLoading) {
        return (
            <div className={'bg-gray-300 flex flex-col justify-center items-center w-full h-full'}>
                <Spin size={'large'}/>
            </div>
        )
    }

    const participantsMap = (teamData?.data || []).reduce((acc, participant) => {
        acc[participant.id] = participant;
        return acc;
    }, {});

    const onFinish = (values) => {
        const results = values.results.map(result => `${result.first}-${result.second}`);

        updateBracket({
            resource: "brackets",
            id: currentBracket?.id,
            meta: {tournamentId: id},
            values: {results}
        });

        setIsModalOpen(false);
    };

    const rounds = getRounds();

    const handleModal = (bracket) => {
        if (!isModalOpen) {
            if (bracket.team1 && bracket.team2) {
                setIsModalOpen(true);
                setCurrentBracket(bracket);
            }
        } else {
            setIsModalOpen(false);
        }
    };

    const standingsData = createStandingsTable();

    return (
        <div className="flex flex-col gap-6">
            <CreateButton
                resource="tournaments"
                onClick={() => setPairs(createPairs(teamData?.data || []))}
                className="antbutton"
                disabled={bracketsData?.data?.length > 0}
            >
                Stvori
            </CreateButton>

            <Modal
                open={isModalOpen}
                onCancel={handleModal}
                footer={null}
                width={700}
            >
                <Form form={form} onFinish={onFinish}>
                    <div className="relative w-full mt-12 flex flex-col gap-1">
                        <h1 className="font-bold text-5xl text-center justify-center mb-8">Rezultati</h1>
                        <Form.List name="results">
                            {(fields, {add, remove}) => (
                                <>
                                    <div className="flex flex-row gap-4 bg-red-900 w-full h-full p-6 rounded items-center">
                                        <span className="font-black text-white text-3xl">1</span>
                                        <p className="font-bold text-3xl text-white">{currentBracket?.team1?.name}</p>
                                        <div className="flex flex-row gap-2 ml-auto items-center">
                                            {fields.map(({key, name, ...restField}, index) => (
                                                <div key={key} className="flex items-center gap-1">
                                                    <Form.Item
                                                        {...restField}
                                                        name={[name, "first"]}
                                                        noStyle
                                                        rules={[{required: true, message: "Unesite rezultat"}]}
                                                        initialValue={0}
                                                    >
                                                        <InputNumber
                                                            placeholder={`Rezultat ${name + 1}`}
                                                            min={0}
                                                            style={{width: 70, textAlign: "center"}}
                                                        />
                                                    </Form.Item>

                                                    {index === fields.length - 1 && fields.length > 0 && (
                                                        <MinusCircleOutlined
                                                            onClick={() => remove(name)}
                                                            className="text-white hover:text-red-600 cursor-pointer ml-1"
                                                            style={{fontSize: 20}}
                                                        />
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex flex-row gap-4 bg-black w-full p-6 rounded items-center">
                                        <span className="font-black text-white text-3xl">2</span>
                                        <p className="font-bold text-white text-3xl">{currentBracket?.team2?.name}</p>
                                        <div className="flex flex-row gap-2 ml-auto items-center">
                                            {fields.map(({key, name, ...restField}, index) => (
                                                <div key={key} className="flex items-center gap-1">
                                                    <Form.Item
                                                        {...restField}
                                                        name={[name, "second"]}
                                                        noStyle
                                                        rules={[{required: true, message: "Unesite rezultat"}]}
                                                        initialValue={0}
                                                    >
                                                        <InputNumber
                                                            placeholder={`Rezultat ${name + 1}`}
                                                            min={0}
                                                            style={{width: 70, textAlign: "center"}}
                                                        />
                                                    </Form.Item>

                                                    {index === fields.length - 1 && fields.length > 0 && (
                                                        <MinusCircleOutlined
                                                            onClick={() => remove(name)}
                                                            className="text-white hover:text-red-600 cursor-pointer ml-1"
                                                            style={{fontSize: 20}}
                                                        />
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex justify-end">
                                        <Button
                                            type="dashed"
                                            onClick={() => add()}
                                            icon={<PlusOutlined/>}
                                            className="font-bold ml-4 mb-2 mt-2 w-40 flex justify-end"
                                            style={{
                                                borderColor: "#7f1d1d",
                                                color: "#7f1d1d",
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.backgroundColor = "#7f1d1d";
                                                e.currentTarget.style.color = "white";
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.backgroundColor = "transparent";
                                                e.currentTarget.style.color = "#7f1d1d";
                                            }}
                                        >
                                            Dodaj rezultat
                                        </Button>
                                    </div>
                                </>
                            )}
                        </Form.List>

                        <Form.Item className="text-center justify-center">
                            <Button
                                type="primary"
                                htmlType="submit"
                                className="font-bold !bg-red-900 !hover:bg-red-950 w-60 h-12 text-xl"
                            >
                                Potvrdi
                            </Button>
                        </Form.Item>
                    </div>
                </Form>
            </Modal>

            {bracketsData?.data?.length > 0 && (
                <div className="bg-white rounded-xl p-6">
                    <h2 className="text-2xl font-bold mb-4 text-center">Tablica rezultata</h2>
                    <Table
                        columns={tableColumns}
                        dataSource={standingsData}
                        pagination={false}
                        size="small"
                        className="rounded-lg"
                    />
                </div>
            )}

            <div className="bg-gray-300 rounded-xl p-6 flex gap-6 overflow-x-auto">
                {Object.keys(rounds).map(roundNum => (
                    <div key={roundNum} className="flex flex-col gap-3">
                        {rounds[roundNum].map((bracket) => {
                            const team1 = participantsMap[bracket.team1?.id || bracket.team1];
                            const team2 = participantsMap[bracket.team2?.id || bracket.team2];

                            return (
                                <div
                                    onClick={() => handleModal(bracket)}
                                    key={bracket.id}
                                    className="flex flex-col bg-black min-w-[200px] font-bold border-2 border-black divide-y-2 divide-red-900 rounded cursor-pointer hover:shadow-xl hover:scale-105 transition-all duration-200"
                                >
                                    <div className="flex justify-between items-center w-full min-h-[50px] p-3 bg-red-900 text-white">
                                        <span className="text-sm font-semibold">
                                            {team1?.name}
                                        </span>
                                        <div className="flex gap-1">
                                            {bracket.results?.map((val, i) => (
                                                <span key={i} className="w-7 h-7 text-xs bg-gray-800 border rounded flex items-center justify-center">
                                                    {val.split('-')[0]}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center w-full min-h-[50px] p-3">
                                        <span className="text-sm font-semibold text-white">
                                            {team2?.name}
                                        </span>
                                        <div className="flex gap-1">
                                            {bracket.results?.map((val, i) => (
                                                <span key={i} className="w-7 h-7 text-xs text-white bg-gray-800 border rounded flex items-center justify-center">
                                                    {val.split('-')[1]}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default RoundRobin;