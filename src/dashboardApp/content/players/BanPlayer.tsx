import React, { useState } from "react";
import { useCreate, useDelete } from "@refinedev/core";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../dashboardApp/providers/firebase";
import { Timestamp } from "firebase/firestore";
import {CreateButton, DeleteButton} from "@refinedev/antd";
import { Modal, Input, Button, message } from "antd";
import {UserDeleteOutlined, UsergroupDeleteOutlined} from "@ant-design/icons";

interface BanPlayerProps {
  player: string;
  teamId?: string;
  tournamentId?: string;
}

const BanPlayer: React.FC<BanPlayerProps> = ({ player, teamId, tournamentId }) => {
  const { mutate: createBan } = useCreate({
      successNotification: false,
  });
  const { mutate: deleteFieldInTeam } = useDelete({
      successNotification: false,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [banReason, setBanReason] = useState("");

  const handleBan = async () => {
    try {
      await new Promise((resolve, reject) => {
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
      });

      const teamRef = doc(db, "tournaments", tournamentId!, "participants", teamId!);
      const teamSnap = await getDoc(teamRef);
      const teamData = teamSnap.data();

      if (!teamData) {
        console.warn("Tim nije pronađen");
        return;
      }

      let fieldToDelete: string | null = null;
      for (let i = 1; i <= 10; i++) {
        const key = `player${i}`;
        if (teamData[key] === player) {
          fieldToDelete = key;
          break;
        }
      }

      await deleteFieldInTeam({
        resource: "participants",
        id: teamId!,
        meta: {
          tournamentId,
          fieldToDelete,
        },
          successNotification: () => ({
              message: "Igrač je uspješno banan.",
              description: "Uspješno!",
              type: "success",
          }),
          errorNotification: (error) => ({
              message: "Došlo je do greške pri bananju igrača.",
              description: "Greška!",
              type: "error",
          }),
      });

      message.success(`Igrač ${player} je banan.`);
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
            icon={<UserDeleteOutlined />}
            onClick={() => setIsModalOpen(true)}
            size="small"
            className="text-red-400 hover:!text-red-300 border border-red-500 hover:!border-red-300 bg-transparent transition"
            style={{ background: 'transparent' }}
        />

        <Modal
            title={`Banaj igrača : ${player}`}
            open={isModalOpen}
            onCancel={() => setIsModalOpen(false)}
            footer={[
              <Button key="cancel" onClick={() => setIsModalOpen(false)}>
                Odustani
              </Button>,
              <Button key="submit" type="primary" danger onClick={handleBan}>
                Banaj igrača
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

export default BanPlayer;
