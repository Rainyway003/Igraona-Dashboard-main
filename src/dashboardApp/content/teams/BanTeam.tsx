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

    const { mutate: createBan } = useCreate({
        successNotification: false,
        errorNotification: false,
    });
    const { mutate: deleteTeam } = useDelete({
        successNotification: false,
        errorNotification: false,
    });

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
                message.error("Tim nije pronađen.");
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

            for (const player of players) {
                await new Promise((resolve, reject) => {
                    createBan(
                        {
                            resource: "banned",
                            values: {
                                faceit: player,
                                timestamp: Timestamp.fromDate(new Date()),
                                reason: banReason || "Nije naveden",
                            },
                        },
                        {
                            onSuccess: () => resolve(null),
                            onError: (error) => reject(error),
                            successNotification: false,
                            errorNotification: false,
                        }
                    );
                });
            }

            await new Promise((resolve, reject) => {
                deleteTeam(
                    {
                        resource: "participants",
                        id: teamId,
                        meta: { tournamentId: id },
                    },
                    {
                        onSuccess: () => resolve(null),
                        onError: (error) => reject(error),
                        successNotification: false,
                        errorNotification: false,
                    }
                );
            });

            message.success(`Tim ${teamName} je uspješno banan.`);
            setIsModalOpen(false);
            setBanReason("");
        } catch (error) {
            console.error("Greška pri banovanju:", error);
            message.error("Dogodila se greška pri banovanju tima.");
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
                title={`Banaj tim ${teamName} ?`}
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
                        Banaj tim
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