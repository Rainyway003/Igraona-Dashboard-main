import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../dashboardApp/providers/firebase";

export const signUpTeam = async (name, number, player1, player2, player3, player4, player5, player6) => {
  const teamsRef = collection(db, "teams");
  const players = [player1, player2, player3, player4, player5];
  if (player6.length > 0) {
    players.push(player6);
  }
  if (hasDuplicates(players)) {
    throw new Error(`Igrači se ponavljaju.`);
  }
  for (const player of players) {
    const existing = await getDocs(query(teamsRef, where("players", "array-contains", player)));
    if (!existing.empty) {
      throw new Error(`Igrač ${player} je već registriran.`);
    }
  }
  await addDoc(teamsRef, {
    name,
    number,
    player1,
    player2,
    player3,
    player4,
    player5,
    player6,
    players,
    added: false,
  });
}

const hasDuplicates = (array) => {
  return (new Set(array)).size !== array.length;
}
