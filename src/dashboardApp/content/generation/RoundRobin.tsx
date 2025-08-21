import React, {PropsWithChildren, useEffect, useRef, useState} from 'react';
import {Button, Form, Input, InputNumber, Modal, Spin} from 'antd';
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
        let team1Win = 0;
        let team2Win = 0;
        const results = values.results.map(result => `${result.first}-${result.second}`);

        updateBracket({
            resource: "brackets",
            id: currentBracket?.id,
            meta: {tournamentId: id},
            values: {results}
        });

        values.results.forEach(result => {
            const first = Number(result.first);
            const second = Number(result.second);

            if (first > second) {
                team1Win++;
            } else if (first < second) {
                team2Win++;
            }
        });

        let winner = null;
        if (team1Win > team2Win) {
            winner = participantsMap[currentBracket.team1?.id || currentBracket.team1];
            console.log('Team1 je pobjednik:', winner?.name);
        } else if (team2Win > team1Win) {
            winner = participantsMap[currentBracket.team2?.id || currentBracket.team2];
            console.log('Team2 je pobjednik:', winner?.name);
        }

        if (winner) {
            try {
                const nextBracketNumber = getNextBracketNumber(currentBracket.number, maxNumberOfParticipants);

                if (nextBracketNumber === null) {
                    console.log(' Tournament winner:', winner.name);
                } else {
                    const nextBracket = bracketsData?.data?.find(b => b.number === nextBracketNumber);

                    if (nextBracket) {
                        const isTeam1Position = currentBracket.number % 2 === 1;

                        const updateValues = isTeam1Position
                            ? {team1: {id: winner.id, name: winner.name}}
                            : {team2: {id: winner.id, name: winner.name}};

                        updateBracket({
                            resource: "brackets",
                            id: nextBracket.id,
                            meta: {tournamentId: id},
                            values: updateValues
                        });

                        console.log(`Winner ${winner.name} advanced to bracket ${nextBracketNumber}`);
                    }
                }
            } catch (error) {
                console.error('Error advancing winner:', error);
            }
        }

        setIsModalOpen(false);
    };

    const rounds = getRounds();

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