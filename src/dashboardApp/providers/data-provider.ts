import {
  CreateParams,
  CreateResponse,
  DataProvider,
  DeleteOneParams,
  DeleteOneResponse,
  UpdateParams
} from "@refinedev/core";

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  DocumentData,
  getDoc,
  setDoc,
  getDocs,
  query,
  orderBy,
  updateDoc,
  WithFieldValue,
  increment,
  where, deleteField
} from "firebase/firestore";

import {db} from "./firebase";

const dataProvider: DataProvider = {
  getList: async ({
    resource,
    meta,
    sorters,
    filters
  }: {
    resource: string,
    meta?: any,
    sorters?: any,
    filters?: any
  }): Promise<{ data: any, total: number }> => {
    if (resource === "participants" && meta?.id) {
      const teamsCollection = collection(db, "tournaments", String(meta.id), resource);

      const constraints: any[] = [];

      if (filters && filters.length > 0) {
        filters.forEach((filter: any) => {
          const {field, operator, value} = filter;

          if (operator === "contains") {
            constraints.push(where(field, ">=", value));
            constraints.push(where(field, "<=", value + "\uf8ff"));
          } else if (operator === "eq") {
            constraints.push(where(field, "==", value));
          }
        });
      }

      if (sorters && sorters.length > 0) {
        sorters.forEach((sorter: any) => {
          constraints.push(orderBy(sorter.field, sorter.order || "asc"));
        });
      }

      const teamsQuery = constraints.length > 0 ? query(teamsCollection, ...constraints) : teamsCollection;
      const teamsSnap = await getDocs(teamsQuery);

      const teams = teamsSnap.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));

      return {data: teams, total: teams.length};
    }

    if (resource === "brackets") {
      const bracketsCollection = collection(db, "brackets", meta?.tournamentId, "pairs");

      const constraints: any[] = [];

      if (filters && filters.length > 0) {
        filters.forEach((filter: any) => {
          const {field, operator, value} = filter;

          if (operator === "contains") {
            constraints.push(where(field, ">=", value));
            constraints.push(where(field, "<=", value + "\uf8ff"));
          } else if (operator === "eq") {
            constraints.push(where(field, "==", value));
          }
        });
      }

      if (sorters && sorters.length > 0) {
        sorters.forEach((sorter: any) => {
          constraints.push(orderBy(sorter.field, sorter.order || "asc"));
        });
      }

      const bracketsQuery = constraints.length > 0 ? query(bracketsCollection, ...constraints) : bracketsCollection;
      const bracketsSnap = await getDocs(bracketsQuery);

      const brackets = bracketsSnap.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));

      return {data: brackets, total: brackets.length};
    }

    if (resource === "plays") {
      if (meta?.monthId) {
        const playsCollection = collection(db, "plays", meta.monthId, "submissions");

        const constraints: any[] = [];

        if (filters && filters.length > 0) {
          filters.forEach((filter: any) => {
            const {field, operator, value} = filter;

            if (operator === "contains") {
              constraints.push(where(field, ">=", value));
              constraints.push(where(field, "<=", value + "\uf8ff"));
            } else if (operator === "eq") {
              constraints.push(where(field, "==", value));
            }
          });
        }

        if (sorters && sorters.length > 0) {
          sorters.forEach((sorter: any) => {
            constraints.push(orderBy(sorter.field, sorter.order || "asc"));
          });
        }

        const playsQuery = constraints.length > 0 ? query(playsCollection, ...constraints) : playsCollection;
        const playsSnap = await getDocs(playsQuery);

        const plays = playsSnap.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));

        return {data: plays, total: plays.length};
      } else {
        const playsCollection = collection(db, "plays");
        const playsSnap = await getDocs(playsCollection);

        let months = playsSnap.docs.map((doc) => ({
          id: doc.id,
          name: doc.id,
          ...doc.data(),
        }));

        if (sorters && sorters.length > 0) {
          sorters.forEach((sorter: any) => {
            if (sorter.field === "id" || sorter.field === "date") {
              months.sort((a, b) => {
                const dateA = new Date(a.id + '-01');
                const dateB = new Date(b.id + '-01');

                if (sorter.order === "desc") {
                  return dateB.getTime() - dateA.getTime();
                } else {
                  return dateA.getTime() - dateB.getTime();
                }
              });
            }
          });
        } else {
          months.sort((a, b) => {
            const dateA = new Date(a.id + '-01');
            const dateB = new Date(b.id + '-01');
            return dateB.getTime() - dateA.getTime();
          });
        }

        return {data: months, total: months.length};
      }
    }
    if (resource === "submissions") {
      const monthId = meta?.monthId;

      if (!monthId) {
        return {data: [], total: 0};
      }

      const submissionsCollection = collection(db, "plays", monthId, "submissions");
      const submissionsSnap = await getDocs(submissionsCollection);

      const submissions = submissionsSnap.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));

      return {data: submissions, total: submissions.length};
    }

    const turnirDoc = collection(db, resource);

    const constraints: any[] = [];

    if (filters && filters.length > 0) {
      filters.forEach((filter: any) => {
        const {field, operator, value} = filter;

        if (operator === "contains") {
          constraints.push(where(field, ">=", value));
          constraints.push(where(field, "<=", value + "\uf8ff"));
        } else if (operator === "eq") {
          constraints.push(where(field, "==", value));
        }
      });
    }

    if (sorters && sorters.length > 0) {
      sorters.forEach((sorter: any) => {
        constraints.push(orderBy(sorter.field, sorter.order || "asc"));
      });
    }

    const turnirQuery = query(turnirDoc, ...constraints);
    const turnirSnap = await getDocs(turnirQuery);

    const data = turnirSnap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return {data, total: data.length};
  },

  create: async <TData = any, TVariables = DocumentData>(
    {resource, variables, meta}: CreateParams<TVariables>
  ): Promise<CreateResponse<TData>> => {
    if (
      resource === "tournaments" ||
      resource === "blog" ||
      resource === "rules" ||
      resource === "banned" ||
      resource === "games"
    ) {
      const docRef = await addDoc(
        collection(db, resource),
        variables as WithFieldValue<DocumentData>
      );

      return {
        data: {
          id: docRef.id,
          ...variables,
        } as TData,
      };
    }

    if (resource === "participants") {
      const docRef = await addDoc(
        collection(db, "tournaments", variables.tournamentId, resource),
        variables as WithFieldValue<DocumentData>
      );

      const turnirDoc = doc(db, "tournaments", variables.tournamentId);
      await updateDoc(turnirDoc, {
        numberOfParticipants: increment(1),
      });

      return {
        data: {
          id: docRef.id,
          ...variables,
        } as TData,
      };
    }
    if (resource === "brackets") {
      const docRef = await addDoc(
        collection(db, resource, variables.tournamentId, "pairs"),
        variables as WithFieldValue<DocumentData>
      );

      return {
        data: {
          id: docRef.id,
          ...variables,
        } as TData,
      };
    }

    if (resource === "reservations") {
      const id = meta?.id || (variables as any).id;

      await setDoc(doc(db, resource, id), variables as WithFieldValue<DocumentData>);

      return {
        data: {
          id,
          ...variables,
        } as TData,
      };
    }

    throw new Error(`Unsupported resource type: ${resource}`);
  },

  update: async <TData = any, TVariables = DocumentData>(
    {resource, id, variables, meta}: UpdateParams<TVariables>
  ): Promise<CreateResponse<TData>> => {

    if (resource === "brackets" && meta?.number) {
      const bracketRef = collection(db, "brackets", String(id), "pairs");
      const pairNumber = meta.number;
      const bracketQuery = query(
        bracketRef,
        where("number", "==", pairNumber)
      );

      const participantsSnap = await getDocs(bracketQuery);

      participantsSnap.forEach(async (pairDoc) => {
        const pairRef = doc(db, "brackets", String(id), "pairs", pairDoc.id);
        await updateDoc(pairRef, variables);
      });

      return {
        data: {
          id,
          ...variables,
        } as TData,
      };
    }

    if (resource === "brackets") {
      const docRef = doc(db, resource, meta?.tournamentId, "pairs", String(id));
      await updateDoc(docRef, {...variables});

      return {
        data: {
          id,
          ...variables,
        } as TData,
      };
    }
    if (resource === "submissions") {
      const docRef = doc(db, "plays", meta?.monthId, "submissions", String(id));
      await updateDoc(docRef, {...variables});
    }

    if (resource === "participants") {
      console.log("PARTICIPANTS - update");
      const teamRef = doc(db, "tournaments", String(meta?.tournamentId), "participants", String(id));
      const teamSnap = await getDoc(teamRef);
      const oldData = teamSnap.data();

      const updates: any = {};
      for (let i = 1; i <= 5; i++) {
        const key = `player${i}`;
        if (key in variables && variables[key] === "" && oldData?.[key]) {
          const bannedRef = collection(db, "banned");

          const existingBans = await getDocs(query(bannedRef, where("faceit", "==", oldData[key])));
          if (existingBans.empty) {
            await addDoc(bannedRef, {
              faceit: oldData[key],
              timestamp: new Date()
            });
          }

          updates[key] = deleteField();
        }
      }

      Object.assign(updates, variables);
      await updateDoc(teamRef, updates);

      return {
        data: {
          id,
          ...updates,
        } as TData,
      };
    }

    const docRef = doc(db, resource, String(id));
    await updateDoc(docRef, variables);

    return {
      data: {
        id,
        ...variables,
      } as TData,
    };
  },

  deleteOne: async <TData = any, TVariables = {}>(
    {resource, id, meta}: DeleteOneParams<TVariables>
  ): Promise<DeleteOneResponse<TData>> => {
    if (
      resource === "tournaments" ||
      resource === "games" ||
      resource === "blog" ||
      resource === "reservations" ||
      resource === "plays"
    ) {
      const docRef = doc(db, resource, id as string);
      await deleteDoc(docRef);

      return {
        data: {id} as TData,
      };
    }
    if (resource === "submissions") {
      const docRef = doc(db, "plays", meta?.monthId, "submissions", id as string);
      await deleteDoc(docRef);
    }

    if (resource === "participants" && meta?.fieldToDelete && meta?.tournamentId) {
      const docRef = doc(db, "tournaments", String(meta.tournamentId), resource, String(id));
      await updateDoc(docRef, {
        [meta.fieldToDelete]: deleteField(),
      });
      return {data: null};
    }


    if (resource === "participants" && !meta?.doNotDelete && meta?.tournamentId) {
      const docRef = doc(db, "tournaments", String(meta?.tournamentId), resource, String(id));
      const tournamentRef = doc(db, "tournaments", String(meta?.tournamentId));
      await updateDoc(tournamentRef, {
        numberOfParticipants: increment(-1),
      })
      await deleteDoc(docRef);
      return {data: {id} as TData};
    }

    if (resource === "rules") {
      const bannedRef = doc(db, resource, String(meta.bannedId));
      await deleteDoc(bannedRef);

      return {
        data: {id} as TData,
      };
    }

    if (resource === "banned") {
      const docRef = doc(db, "tournaments", String(id), "participants", String(meta?.teamId));
      await deleteDoc(docRef);

      if (meta?.bannedId) {
        const bannedRef = doc(db, resource, String(meta.bannedId));
        await deleteDoc(bannedRef);
      }


      return {
        data: {id} as TData,
      };
    }
  },
  getOne: async ({
    resource,
    id,
    meta
  }: {
    resource: string,
    id: any,
    meta?: any
  }): Promise<{ data: any }> => {
    if (resource === "participants") {
      if (!meta?.tournamentId) {
        throw new Error("Missing meta.tournamentId for participants resource");
      }

      const teamRef = doc(db, "tournaments", String(meta.tournamentId), "participants", String(id));

      const teamSnap = await getDoc(teamRef);

      const data = {
        id: teamSnap.id,
        ...(teamSnap.data() as DocumentData),
      };

      return {data};
    }

    const docRef = doc(db, resource, String(id));
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      throw new Error(`Document with id ${id} not found`);
    }

    const data: any = {
      id: docSnap.id,
      ...(docSnap.data() as DocumentData),
    };

    if (resource === "tournaments") {
      const participantRef = doc(db, resource, String(id), "participants", String(id));
      const participantSnap = await getDoc(participantRef);

      if (participantSnap.exists()) {
        const teamsMap = participantSnap.data().teams;

        if (teamsMap) {
          const teams = Object.keys(teamsMap).map((teamKey) => {
            const team = teamsMap[teamKey];

            return {
              id: teamKey,
              name: team.name,
              players: [
                team.player1,
                team.player2,
                team.player3,
                team.player4,
              ],
            };
          });

          data.teams = teams;
        }
      } else {
        data.teams = [];
      }
    }

    return {data};
  },

  getApiUrl: () => "",
};

export default dataProvider;