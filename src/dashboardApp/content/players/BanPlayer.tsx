import React from "react";
import { useCreate, useUpdate } from "@refinedev/core";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../dashboardApp/providers/firebase";

interface BanPlayerProps {
  player: string; // faceit ID
  teamId?: string;
  tournamentId?: string;
}

const BanPlayer: React.FC<BanPlayerProps> = ({ player, teamId, tournamentId }) => {
  const { mutate: createBan } = useCreate();
  const { mutate: updateTeam } = useUpdate();

  console.log(tournamentId, 'lmaoo')

  const handleBan = async () => {
    if (!player || !teamId || !tournamentId) {
      alert("Nedostaju podaci za banovanje.");
      return;
    }

    try {
      // 1. Dohvati tim da vidiš gdje je igrač
      const teamRef = doc(db, "tournaments", tournamentId, "participants", teamId);
      const teamSnap = await getDoc(teamRef);
      const teamData = teamSnap.data();

      if (!teamData) return;

      // 2. Nađi koji je slot player-a (npr. player3)
      let foundKey: string | null = null;
      for (let i = 1; i <= 10; i++) {
        const key = `player${i}`;
        if (teamData[key] === player) {
          foundKey = key;
          break;
        }
      }

      if (!foundKey) {
        console.warn("Igrač nije pronađen u timu.");
        return;
      }
      console.log(player,'PLEJEERERE')

      // 3. Ručno banuj igrača (ako želiš da bude i van dataProvidera)
      createBan({
        resource: "banned",
        values: {
          faceit: player,
          reason: "Banovan ručno",
          timestamp: new Date().toISOString(),
        },
      });

      // 4. Pokreni update kroz Refine → automatski briše polje i banovaće unutar dataProvidera
      updateTeam({
        resource: "participants",
        id: tournamentId,
        values: {
          [foundKey]: "", // Ovo će `dataProvider.update` prepoznati i zamijeniti sa `deleteField()`
        },
        meta: {
          teamId,
        },
      });

      console.log(`Igrač ${player} izbrisan iz tima i banovan.`);
    } catch (err) {
      console.error("Greška prilikom banovanja:", err);
    }
  };

  return (
    <button onClick={handleBan} style={{ color: "red" }}>
      Ban Player
    </button>
  );
};

export default BanPlayer;
