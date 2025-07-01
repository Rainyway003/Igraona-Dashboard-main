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
    if (resource === "participants") {
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
    await updateDoc(docRef, {...variables});

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
      resource === "reservations"
    ) {
      const docRef = doc(db, resource, id as string);
      await deleteDoc(docRef);

      return {
        data: {id} as TData,
      };
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
