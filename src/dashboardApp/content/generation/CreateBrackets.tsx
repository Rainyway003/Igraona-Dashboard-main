import React, {PropsWithChildren, useEffect, useRef, useState} from 'react';
import {Button, Form, Input, InputNumber, Modal, Spin} from 'antd';
import {useCreate, useList, useOne, useUpdate} from "@refinedev/core"
import {CreateButton} from '@refinedev/antd';
import {useParams} from 'react-router';
import {MinusCircleOutlined, PlusOutlined} from '@ant-design/icons';

const CreateBrackets: React.FC<PropsWithChildren> = ({children}) => {
  const [pairs, setPairs] = useState<any[]>([])
  const {mutate, isLoading} = useCreate()
  const {mutate: updateBracket} = useUpdate()
  const {id} = useParams();
  const [results, setResults] = useState({});
  const [winners, setWinners] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentBracket, setCurrentBracket] = useState(null);
  const formRef = useRef();

  useEffect(() => {
    if (isModalOpen) {
      formRef.current?.resetFields();
    }
  }, [isModalOpen, currentBracket]);

  const maxNumberOfParticipants = 16

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

  function groupBracketsByRound(brackets: any[], maxTeams: number) {
    const rounds = [];
    let index = 0;
    let numMatches = maxTeams / 2;

    while (numMatches >= 1) {
      const round = brackets.slice(index, index + numMatches);
      rounds.push(round);
      index += numMatches;
      numMatches = numMatches / 2;
    }

    return rounds;
  }

  const handleModal = (bracket) => {
    setIsModalOpen(!isModalOpen);
    setCurrentBracket(bracket);
    console.log(currentBracket)
  }

  const checkWinner = (pairIndex) => {
    const newWinner = teamData?.data[pairIndex];
    setWinners(prevWinners => [...prevWinners, newWinner])
  }

  const handleChange = (pairIndex, team, game, value) => {
    const updated = {...results};
    if (!updated[pairIndex]) updated[pairIndex] = [[], []];
    updated[pairIndex][team][game] = value;
    setResults(updated);

    const t1 = updated[pairIndex][0];
    const t2 = updated[pairIndex][1];

    if (t1.length === numberOfGames && t2.length === numberOfGames &&
      !t1.includes(undefined) && !t2.includes(undefined)) {

      const sum1 = t1.reduce((a, b) => a + b, 0);
      const sum2 = t2.reduce((a, b) => a + b, 0);
      if (sum1 > sum2) {
        console.log(`Par ${pairIndex}: Team 1 pobjednik`);
        checkWinner(pairIndex);
      } else if (sum2 > sum1) {
        console.log(`Par ${pairIndex}: Team 2 pobjednik`);
        checkWinner(pairIndex);
      } else {
        console.log(`Par ${pairIndex}: Neriješeno`);
      }
    }
  };

  const {data: tournamentData} = useOne({
    resource: "tournaments",
    id: id,
  })

  const tournament = tournamentData?.data;

  const cleanObject = (obj: Record<string, any>) =>
    Object.fromEntries(Object.entries(obj).filter(([_, v]) => v !== undefined));

  function createPairs(teams) {
    const shuffled = [...teams];
    const pairs = [];
    let number = 1;
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    for (let i = 0; i < shuffled.length; i += 2) {
      const team1 = shuffled[i];
      const team2 = shuffled[i + 1] || null;
      mutate({
        resource: "brackets",
        values: cleanObject({
          team1: team1,
          team2: team2,
          tournamentId: id,
          number: number++
        }),
        successNotification: false
      })
      pairs.push([team1, team2]);
    }
    for (let i = 0; i < Math.log2(maxNumberOfParticipants); i++) {
      if (i === 0) continue;
      for (let j = 0; j < maxNumberOfParticipants >> (i + 1); j++) {
        mutate({
          resource: "brackets",
          values: cleanObject({
            tournamentId: id,
            number: number++
          }),
          successNotification: false
        })
      }
    }


    return pairs;
  }

  const numberOfGames = 3

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
    const results = values.results.map(result => `${result.first}-${result.second}`);
    console.log(results);
    console.log(currentBracket)

    updateBracket({
      resource: "brackets",
      id: currentBracket?.id,
      meta: {
        tournamentId: id,
      },
      values: {results}
    })
    setIsModalOpen(false);
  };

  return (
    <div className={'flex flex-col gap-6'}>
      <CreateButton
        resource="tournaments"
        onClick={() => setPairs(createPairs(teamData?.data || []))}
        className="antbutton"
        disabled={isLoading}
      >Stvori</CreateButton>
      <Modal
          open={isModalOpen}
          onCancel={handleModal}
          footer={null}
          width={700}
      >
        <Form ref={formRef} onFinish={onFinish}>
          <div className="relative w-full mt-12 flex flex-col gap-1">
            <h1 className="font-bold text-5xl text-center justify-center mb-8">Rezultati</h1>
            <Form.List name="results">
              {(fields, { add, remove }) => (
                  <>
                    <div className="flex flex-row gap-4 bg-red-900 w-full h-full p-6 rounded items-center">
                      <span className="font-black text-white text-3xl">1</span>
                      <p className="font-bold text-3xl text-white">{currentBracket?.team1?.name}</p>
                      <div className="flex flex-row gap-2 ml-auto items-center">
                        {fields.map(({ key, name, ...restField }, index) => (
                            <div key={key} className="flex items-center gap-1">
                              <Form.Item
                                  {...restField}
                                  name={[name, "first"]}
                                  noStyle
                                  rules={[{ required: true, message: "Unesite rezultat" }]}
                              >
                                <Input
                                    placeholder={`Rezultat ${name + 1}`}
                                    type="number"
                                    style={{ width: 70, textAlign: "center" }}
                                />
                              </Form.Item>

                              {index === fields.length - 1 && fields.length > 0 && (
                                  <MinusCircleOutlined
                                      onClick={() => remove(name)}
                                      className="text-white hover:text-red-600 cursor-pointer ml-1"
                                      style={{ fontSize: 20 }}
                                  />
                              )}
                            </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-row gap-4 bg-black w-full p-6 rounded items-center">
                      <span className="font-black text-white text-3xl">2</span>
                      <p className="font-bold text-white text-3xl">{currentBracket?.team2?.name}</p>
                      <div className="flex flex-row gap-2 ml-auto items-center">
                        {fields.map(({ key, name, ...restField }, index) => (
                            <div key={key} className="flex items-center gap-1">
                              <Form.Item
                                  {...restField}
                                  name={[name, "second"]}
                                  noStyle
                                  rules={[{ required: true, message: "Unesite rezultat" }]}
                              >
                                <Input
                                    placeholder={`Rezultat ${name + 1}`}
                                    type="number"
                                    style={{ width: 70, textAlign: "center" }}
                                />
                              </Form.Item>

                              {index === fields.length - 1 && fields.length > 0 && (
                                  <MinusCircleOutlined
                                      onClick={() => remove(name)}
                                      className="text-white hover:text-red-600 cursor-pointer ml-1"
                                      style={{ fontSize: 20 }}
                                  />
                              )}
                            </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-end">
                    <Button
                        type="dashed"
                        onClick={() => add()}
                        icon={<PlusOutlined />}
                        className="font-bold ml-4 mb-2 mt-2 w-40 flex justify-end"
                        style={{
                          borderColor: "#7f1d1d",
                          color: "#7f1d1d",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = "#7f1d1d";
                          e.currentTarget.style.color = "white";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "transparent";
                          e.currentTarget.style.color = "#7f1d1d";
                        }}
                    >
                      Dodaj rezultat
                    </Button>
                      </div>
                  </>
              )}
            </Form.List>


            <Form.Item className="text-center justify-center">
              <Button
                  type="primary"
                  htmlType="submit"
                  className="font-bold !bg-red-900 !hover:bg-red-950 w-60 h-12 text-xl"
              >
                Potvrdi
              </Button>
            </Form.Item>
          </div>
        </Form>
      </Modal>

      <div className="bg-gray-300 flex flex-row rounded-xl">
        {groupBracketsByRound(bracketsData?.data || [], maxNumberOfParticipants).map((round, roundIndex) => (
          <div key={roundIndex} className="flex flex-col items-center justify-center ">
            {round.map((bracket, idx) => {
              const team1 = participantsMap[bracket.team1?.id || bracket.team1];
              const team2 = participantsMap[bracket.team2?.id || bracket.team2];

              return (
                  <div
                      onClick={() => handleModal(bracket)}
                      key={bracket.id}
                      className="flex flex-col bg-black m-4 ml-12 p-0 min-w-[300px] font-bold border-2 border-black divide-y-2 divide-red-900 rounded items-center text-center"
                  >


                    <div className="flex flex-row justify-between items-center w-full min-h-12 p-2 bg-red-900 text-white">
                      <span className="text-left flex-1">{team1?.name || "Pobjednik prošle runde"}</span>
                      <div className="flex flex-row gap-2">
                        {bracket.results?.map((val, i) => (
                            <span
                                key={i}
                                className="w-12 text-white bg-gray-800 border border-gray-600 rounded text-center p-1"
                            >
    {val.split('-')[0]}
  </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-row justify-between items-center w-full min-h-12 p-2">
                      <span className="text-left flex-1 text-white">{team2?.name || "Pobjednik prošle runde"}</span>
                      <div className="flex flex-row gap-2">
                        {bracket.results?.map((val, i) => (
                            <span
                                key={i}
                                className="w-12 text-white bg-gray-800 border border-gray-600 rounded text-center p-1"
                            >
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
  )
}

export default CreateBrackets;