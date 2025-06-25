import React, {useState} from "react";
import {useCreate, useDelete} from "@refinedev/core";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../dashboardApp/providers/firebase";
import {Button, Input, message, Modal} from "antd";
import {UsergroupDeleteOutlined} from "@ant-design/icons";
import { Timestamp } from "firebase/firestore";
import {useParams} from "react-router";
import {CreateButton} from "@refinedev/antd";

interface BanTeamButtonProps {
    teamId: string;
    resource: string;
}

const BanTeamButton: React.FC<BanTeamButtonProps> = ({ teamId, resource}) => {
    const {id} = useParams()

    const { mutate: createBan } = useCreate();
    const { mutate: deleteTeam } = useDelete();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [banReason, setBanReason] = useState("");
    const [teamName, setTeamName] = useState("");

    const getTeamName = async () => {
        const teamRef = doc(db, "tournaments", id, "participants", teamId);
        const teamSnap = await getDoc(teamRef);

        if (teamSnap.exists()) {
            const teamName = teamSnap.data().name
            setTeamName(teamName)
        }
    }

    const handleBanTeam = async () => {
        try {
            const teamRef = doc(db, "tournaments", id, "participants", teamId);
            const teamSnap = await getDoc(teamRef);

            if (!teamSnap.exists()) {
                message.error("Nema");
                return;
            }

            const teamData = teamSnap.data();
            const players: string[] = [];

            for (let i = 1; i <= 10; i++) {
                const key = `player${i}`;
                if (teamData[key]) {
                    players.push(teamData[key]);
                }
            }

            await Promise.all(
                players.map((player) =>
                    new Promise((resolve, reject) => {
                        createBan(
                            {
                                resource: "banned",
                                values: {
                                    faceit: player,
                                    timestamp: Timestamp.fromDate(new Date()),
                                    reason: banReason || 'Nije naveden',
                                },
                            },
                            {
                                onSuccess: () => resolve(null),
                                onError: (error) => reject(error),
                            }
                        );
                        deleteTeam(
                            {
                                resource: "banned",
                                id: id,
                                meta: {
                                    teamId: teamId
                                }
                            },
                            {
                                onSuccess: () => resolve(null),
                                onError: (error) => reject(error),
                            }
                        );
                    })
                )
            );

            message.success(`Tim ${teamName} je izbačen.`);
            setIsModalOpen(false);
            setBanReason("");
        } catch (error) {
            console.error("Neće :", error);
        }
    };

    return (
        <>
            <CreateButton
                hideText
                icon={<UsergroupDeleteOutlined />}
                onClick={() => {
                    getTeamName();
                    setIsModalOpen(true);
                }}
                size="small"
                className="text-red-400 hover:!text-red-300 border border-red-500 hover:!border-red-300 bg-transparent transition"
                style={{ background: 'transparent' }}
            />

            <Modal
                title={`Izbaciti tim ${teamName} ?`}
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={[
                    <Button key="cancel" onClick={() => setIsModalOpen(false)}>
                        Odustani
                    </Button>,
                    <Button key="submit" type="primary" danger onClick={() => {
                        handleBanTeam();
                        setIsModalOpen(false);
                    }}>
                        Izbaci tim
                    </Button>,
                ]}
            >
                <p>Unesi razlog bana (opcionalno) :</p>
                <Input.TextArea
                    rows={4}
                    value={banReason}
                    onChange={(e) => setBanReason(e.target.value)}
                    placeholder="Npr. pravio se pametan..."
                />
            </Modal>
        </>
    );
};

export default BanTeamButton;