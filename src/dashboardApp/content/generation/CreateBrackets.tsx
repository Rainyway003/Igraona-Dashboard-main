import React, {PropsWithChildren, useState} from 'react';
import {Table, Avatar, Space, Progress, Input, notification} from 'antd';
import {AntDesignOutlined, EyeOutlined} from '@ant-design/icons';

import {useCreate, useList, useOne, useUpdate} from "@refinedev/core"
import {CreateButton, DeleteButton, EditButton, useSelect} from '@refinedev/antd';
import {useNavigate, useOutletContext, useParams} from 'react-router';
import ShowPlayers from "../players/ShowPlayers";
import {dividerClasses} from "@mui/material";

const CreateBrackets: React.FC<PropsWithChildren> = ({children}) => {
    const [searchTerm, setSearchTerm] = useState('')
    const navigate = useNavigate()
    const {id} = useParams();

    const {data: tournamentData} = useOne({
        resource: "tournaments",
        id: id,
    })

    const tournament = tournamentData?.data;

    const {data: teamData} = useList({
        resource: "participants",
        meta: {
            tournamentId: id,
        },
    });

    const {setHeaderActions} = useOutletContext<{ setHeaderActions: (node: React.ReactNode) => void }>();

    React.useEffect(() => {
        setHeaderActions(
            <div className="flex justify-between w-full">
                <Input
                    placeholder="Pretraži turnire"
                    allowClear
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-96 shadow-md"
                />
                <CreateButton
                    resource="tournaments"
                    onClick={() => navigate('/tournaments/new')}
                    className="antbutton"
                >Stvori</CreateButton>
            </div>
        );

        return () => setHeaderActions(null);
    }, [searchTerm]);

const maxNumberOfParticipants = 16



   const teamsMap =  teamData?.data?.map((_, team: any) => {
       return(
           <div>{team}</div>
       )
   })

console.log(teamData?.data[0].name)

    const createPair = (team) => {
    const pairs = []

        for(let i = 0; i < team.length; i+= 2) {
            const team1 = team[i]
            const team2 = team[i + 1] || "";
            pairs.push([ team1, team2])
        }
        return pairs;
    }

    const pairs = createPair(teamData?.data || [])

const pairsMapped = pairs.map(([team1, team2], index) => {
    return(
        <div key={index} className={'bg-red-400 gap-4 m-4 h-auto w-auto'}>{team1.name || ""} vs {team2.name || ""}</div>
    )
})

    return (
        <>
            <div className={'bg-red-200 flex flex-row'}>
                {Array.from({ length: Math.floor(Math.log2(maxNumberOfParticipants)) }).map((_, runda) => (
                    <div key={runda} className={'bg-blue-300 w-full'}>
                        <div className={'flex flex-col bg-blue-500 w-full h-full text-center justify-center'}>
                            {runda === 0
                                ? pairsMapped
                                : Array.from({ length: Math.floor(maxNumberOfParticipants / Math.pow(2, runda + 1)) }).map((_, timovi) => (
                                    <div key={`${runda + 1}-${timovi + 1}`} className={'flex bg-red-800 m-4'}>
                                        {`Winner of Match ${timovi * 2 + 1} vs Match ${timovi * 2 + 2}`}
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                ))}
            </div>

        </>
    )
}

export default CreateBrackets;