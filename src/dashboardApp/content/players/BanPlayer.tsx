import React from "react";
import { useCreate, useDelete } from "@refinedev/core";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../dashboardApp/providers/firebase";
import {Timestamp} from 'firebase/firestore';

interface BanPlayerProps {
  player: string;
  teamId?: string;
  tournamentId?: string;
}

const BanPlayer: React.FC<BanPlayerProps> = ({ player, teamId, tournamentId }) => {
  const { mutate: createBan } = useCreate();
  const { mutate: deleteFieldInTeam } = useDelete();

  console.log(player, teamId, tournamentId, 'ENOOGAA')

  const handleBan = async () => {

    try {
      createBan({
        resource: "banned",
        values: {
          faceit: player,
          timestamp: Timestamp.fromDate(new Date()),
        },
      });

      const teamRef = doc(db, "tournaments", tournamentId, "participants", teamId);
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

      if (!fieldToDelete) {
        console.warn("Nema.");
        return;
      }

      deleteFieldInTeam({
        resource: "participants",
        id: teamId,
        meta: {
          tournamentId,
          fieldToDelete,
        },
      });

      console.log(`Igrač ${player} banovan i polje ${fieldToDelete} obrisano.`);
    } catch (error) {
      console.error("Greška:", error);
    }
  };

  return (
    <button onClick={handleBan} style={{ color: "red" }}>
      Ban Player
    </button>
  );
};

export default BanPlayer;
