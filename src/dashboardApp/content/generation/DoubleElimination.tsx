import React, {PropsWithChildren, useEffect, useRef, useState} from 'react';
import {Button, Form, Input, InputNumber, Modal, Spin} from 'antd';
import {useCreate, useList, useOne, useUpdate} from "@refinedev/core"
import {CreateButton} from '@refinedev/antd';
import {useParams} from 'react-router';
import {MinusCircleOutlined, PlusOutlined} from '@ant-design/icons';

const DoubleElimination: React.FC<PropsWithChildren> = ({children}) => {
  const [form] = Form.useForm();
  const [pairs, setPairs] = useState<any[]>([])
  const {mutate, isLoading} = useCreate()
  const {mutate: updateBracket} = useUpdate()
  const {id} = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentBracket, setCurrentBracket] = useState(null);

  const [skippedTeam, setSkippedTeam] = useState(null);
  const [skippedBracket, setSkippedBracket] = useState(0);
  const [shouldUpdateSkipped, setShouldUpdateSkipped] = useState(false);
  const {mutate: updatePair} = useUpdate();

  useEffect(() => {
    if (isModalOpen) {
      form.resetFields()
      if (!currentBracket?.results?.length) {
        form.setFieldsValue({results: [{}]})
      }
    }
  }, [isModalOpen, currentBracket]);

  useEffect(() => {
    if (currentBracket?.results?.length) {
      const parsedResults = currentBracket.results.map((r) => {
        const [first, second] = r.split("-").map(Number)
        return {first, second}
      });

      form.setFieldsValue({results: parsedResults})
    } else if (isModalOpen) {
      form.setFieldsValue({results: [{}]})
    }
  }, [currentBracket, isModalOpen])

  useEffect(() => {
    if (currentBracket?.results?.length) {
      const parsedResults = currentBracket.results.map((r) => {
        const [first, second] = r.split("-").map(Number);
        return {first, second};
      });

      form.setFieldsValue({results: parsedResults});
    }
  }, [currentBracket]);

  useEffect(() => {
    if (!shouldUpdateSkipped || !skippedTeam || !id || !skippedBracket) {
      console.log("Nema data");
      return;
    }

    updatePair({
      resource: 'brackets',
      id: String(id),
      values: {
        team1: skippedTeam,
      },
      meta: {
        number: Number(skippedBracket),
      }
    });

    setShouldUpdateSkipped(false);
  }, [skippedTeam, shouldUpdateSkipped]);

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

  const {data: tournamentData} = useOne({
    resource: "tournaments",
    id: id,
  })

  const tournament = tournamentData?.data;
  const maxNumberOfParticipants = tournament?.numberOfParticipants

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
  function groupLosersBracket(brackets: any[]) {
    const losers = brackets.filter(b => b.type === "losers");
    const rounds = [];

    const matchesPerRound = [2, 2, 1, 1];

    let index = 0;

    for (let i = 0; i < matchesPerRound.length && index < losers.length; i++) {
      const numMatches = matchesPerRound[i];
      const round = losers.slice(index, index + numMatches);
      if (round.length > 0) {
        rounds.push(round);
      }
      index += numMatches;
    }

    return rounds;
  }

  const handleModal = (bracket) => {
    if (!isModalOpen) {
      if (bracket.team1 && bracket.team2) {
        setIsModalOpen(!isModalOpen);
        setCurrentBracket(bracket);
        console.log(currentBracket)
      } else {
        return;
      }
    } else {
      setIsModalOpen(!isModalOpen);
    }
  }

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

      if (shuffled.length % 2 !== 0) {
        setSkippedTeam(team1)
        const bracketNumber = Math.ceil((shuffled.length + 1) / 2)
        const nextBracketNumber = getNextBracketNumber(bracketNumber, maxNumberOfParticipants);
        setSkippedBracket(nextBracketNumber)
        setShouldUpdateSkipped(true);
      }

      mutate({
        resource: "brackets",
        values: cleanObject({
          team1: team1,
          team2: team2,
          tournamentId: id,
          number: number++,
          type: 'winners'
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
            number: number++,
            type: 'winners'
          }),
          successNotification: false
        })
      }
    }

    const log2Teams = Math.log2(maxNumberOfParticipants)
    const lowerRounds = 2 * (log2Teams - 1)
    const matchCounts = []

    let matchCount = maxNumberOfParticipants / 4

    for (let i = 0; i < lowerRounds; i++) {
      matchCounts.push(matchCount)
      if (i % 2 === 1) {
        matchCount = matchCount / 2
      }
    }

    for (let i = 0; i < lowerRounds; i++) {
      for (let j = 0; j < matchCounts[i]; j++) {
        mutate({
          resource: "brackets",
          values: cleanObject({
            tournamentId: id,
            number: number++,
            type: 'losers',
          }),
          successNotification: false
        });
      }
    }


if(pairs.length > 0) {
    mutate({
      resource: "brackets",
      values: cleanObject({
        tournamentId: id,
        number: number++,
        type: 'final',
      }),
      successNotification: false
    })
}

    return pairs;
  }


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
    let team1Win = 0;
    let team2Win = 0;
    const results = values.results.map(result => `${result.first}-${result.second}`);

    updateBracket({
      resource: "brackets",
      id: currentBracket?.id,
      meta: {tournamentId: id},
      values: {results}
    });

    values.results.forEach(result => {
      const first = Number(result.first);
      const second = Number(result.second);

      if (first > second) {
        team1Win++;
      } else if (first < second) {
        team2Win++;
      }
    });

    let winner = null;
    let loser = null;
    if (team1Win > team2Win) {
      winner = participantsMap[currentBracket.team1?.id || currentBracket.team1];
      loser = participantsMap[currentBracket.team2?.id || currentBracket.team2];
    } else if (team2Win > team1Win) {
      winner = participantsMap[currentBracket.team2?.id || currentBracket.team2];
      loser = participantsMap[currentBracket.team1?.id || currentBracket.team1];
    }

    if (winner) {
      try {
        const nextBracketNumber = getNextBracketNumber(currentBracket.number, currentBracket.type);
console.log(nextBracketNumber)
        if (nextBracketNumber === null) {
          console.log(' Tournament winner:', winner.name);
        } else {
          const nextBracket = bracketsData?.data?.find(b => b.number === nextBracketNumber);

          if (nextBracket) {
            const isTeam1Position = currentBracket.number % 2 === 0;

            const updateValues = isTeam1Position
                ? {team1: {id: winner.id, name: winner.name}}
                : {team2: {id: winner.id, name: winner.name}};

            updateBracket({
              resource: "brackets",
              id: nextBracket.id,
              meta: {tournamentId: id},
              values: updateValues
            });

            console.log(`Winner ${winner.name} advanced to bracket ${nextBracketNumber}`);
          }
        }
      } catch (error) {
        console.error('Error advancing winner:', error);
      }
    }

    if (loser) {
      const nextBracketNumber = getNextLoserMatchNumber(currentBracket.number, currentBracket.type);

      const nextBracket = bracketsData?.data?.find(b => b.number === nextBracketNumber);

      if (nextBracket) {
        const isTeam1Position = currentBracket.number % 2 === 0;

        const updateValues = isTeam1Position
            ? {team1: {id: loser.id, name: loser.name}}
            : {team2: {id: loser.id, name: loser.name}};

        updateBracket({
          resource: "brackets",
          id: nextBracket.id,
          meta: {tournamentId: id},
          values: updateValues
        });

        console.log(`Loser ${loser.name} advanced to bracket ${nextBracketNumber}`);
      }
    }

    setIsModalOpen(false);
  };

  function getNextBracketNumber(currentBracketNumber, currentBracketType) {
    const losers = bracketsData?.data.filter(bracket => bracket.type === "losers").length;
    const winners2 = bracketsData?.data.filter(bracket => bracket.type === "winners").length;

    const srednjaRunda = winners2 + Math.round(losers * 0.5)
    const zadnjaRunda = winners2 + Math.round(losers * 0.9)

    console.log(srednjaRunda)

    if (currentBracketType === 'winners') {
      const rounds = [];
      let bracketIndex = 1;
      const maxParticipants = tournamentData?.data.numberOfParticipants
      let numMatches = maxParticipants / 2;

      while (numMatches >= 1) {
        const round = [];
        for (let i = 0; i < numMatches; i++) {
          round.push(bracketIndex++);
        }
        rounds.push(round);
        numMatches = numMatches / 2;
      }

      let currentRound = -1;
      let positionInRound = -1;

      for (let r = 0; r < rounds.length; r++) {
        const position = rounds[r].indexOf(currentBracketNumber);
        if (position !== -1) {
          currentRound = r;
          positionInRound = position;
          break;
        }
      }

      if (currentRound === -1) {
        throw new Error(`Bracket number ${currentBracketNumber} not found`);
      }

      if (currentRound === rounds.length - 1) {
        return null;
      }

      const nextRound = currentRound + 1;
      const nextPosition = Math.floor(positionInRound / 2);

      return rounds[nextRound][nextPosition];
  } else if (currentBracketType === 'losers' && currentBracketNumber !== srednjaRunda && currentBracketNumber !== zadnjaRunda) {
      const winners = bracketsData?.data.filter(bracket => bracket.type === "winners").length;

    const nextNumber = winners + Math.floor((currentBracketNumber - 1) / 2);

    return nextNumber
    } else if (currentBracketType === 'losers' && currentBracketNumber === srednjaRunda) {
      const winners = bracketsData?.data.filter(bracket => bracket.type === "winners").length;

      const nextNumber = winners + Math.floor((currentBracketNumber - 1) / 2) + 1;

      return nextNumber
    } else if (currentBracketType === 'losers' && currentBracketNumber === zadnjaRunda) {
      const winners = bracketsData?.data.filter(bracket => bracket.type === "winners").length;

      const nextNumber = winners + Math.floor((currentBracketNumber - 1) / 2) + 1;

      return nextNumber
    }
}

  function getNextLoserMatchNumber(currentBracketNumber, currentBracketType) {
    const winners = bracketsData?.data.filter(bracket => bracket.type === "winners").length;

    const drugaRunda = Math.round(winners * 0.7)
    const finalRunda = Math.round(winners * 0.9)

    if(currentBracketType === "winners" && currentBracketNumber <= drugaRunda) {
    const losersStart = winners + 1;

      const nextNumber = losersStart + Math.floor((currentBracketNumber - 1) / 2);


      return nextNumber

    } else if (currentBracketType === "winners" && currentBracketNumber > drugaRunda && currentBracketNumber <= finalRunda) {
      const losersStart = winners + 1;

      const nextNumber = losersStart + Math.floor((currentBracketNumber - 1) / 2) + 1;

      return nextNumber
    } else if (currentBracketType === "winners" && currentBracketNumber > drugaRunda && currentBracketNumber > finalRunda) {
      const losersStart = winners + 1;

      const nextNumber = losersStart + Math.floor((currentBracketNumber - 1) / 2) + 2;

      return nextNumber
    } else if (currentBracketType === "winners" && currentBracketNumber >= finalRunda) {
      const losersStart = winners + 1;

      const nextNumber = losersStart + Math.floor((currentBracketNumber - 1) / 2) + 2;

      return nextNumber
    } else {
      return null
    }
  }


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
        <Form form={form} onFinish={onFinish}>
          <div className="relative w-full mt-12 flex flex-col gap-1">
            <h1 className="font-bold text-5xl text-center justify-center mb-8">Rezultati</h1>
            <Form.List name="results">
              {(fields, {add, remove}) => (
                <>
                  <div className="flex flex-row gap-4 bg-red-900 w-full h-full p-6 rounded items-center">
                    <span className="font-black text-white text-3xl">1</span>
                    <p className="font-bold text-3xl text-white">{currentBracket?.team1?.name}</p>
                    <div className="flex flex-row gap-2 ml-auto items-center">
                      {fields.map(({key, name, ...restField}, index) => (
                        <div key={key} className="flex items-center gap-1">
                          <Form.Item
                            {...restField}
                            name={[name, "first"]}
                            noStyle
                            rules={[{required: true, message: "Unesite rezultat"}]}
                            initialValue={0}
                          >
                            <InputNumber
                              placeholder={`Rezultat ${name + 1}`}
                              min={0}
                              style={{width: 70, textAlign: "center"}}
                            />
                          </Form.Item>

                          {index === fields.length - 1 && fields.length > 0 && (
                            <MinusCircleOutlined
                              onClick={() => remove(name)}
                              className="text-white hover:text-red-600 cursor-pointer ml-1"
                              style={{fontSize: 20}}
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
                      {fields.map(({key, name, ...restField}, index) => (
                        <div key={key} className="flex items-center gap-1">
                          <Form.Item
                            {...restField}
                            name={[name, "second"]}
                            noStyle
                            rules={[{required: true, message: "Unesite rezultat"}]}
                            initialValue={0}
                          >
                            <InputNumber
                              placeholder={`Rezultat ${name + 1}`}
                              min={0}
                              style={{width: 70, textAlign: "center"}}
                            />
                          </Form.Item>

                          {index === fields.length - 1 && fields.length > 0 && (
                            <MinusCircleOutlined
                              onClick={() => remove(name)}
                              className="text-white hover:text-red-600 cursor-pointer ml-1"
                              style={{fontSize: 20}}
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
                      icon={<PlusOutlined/>}
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


      <div className="bg-gray-300 rounded-xl p-6">

        <div className="grid grid-cols-4 gap-8 min-h-screen items-start">
          {groupBracketsByRound(bracketsData?.data || [], maxNumberOfParticipants).map((round, roundIndex) => {

            return (
              <div
                key={roundIndex}
                className="flex flex-col justify-around items-center h-full"
              >


                {round.filter(round => round.type === 'winners').map((bracket, idx) => {
                  const team1 = participantsMap[bracket.team1?.id || bracket.team1];
                  const team2 = participantsMap[bracket.team2?.id || bracket.team2];

                  return (
                    <div
                      onClick={() => handleModal(bracket)}
                      key={bracket.id}
                      className="flex flex-col bg-black min-w-[280px] max-w-[300px] w-full font-bold border-2 border-black divide-y-2 divide-red-900 rounded items-center text-center cursor-pointer hover:shadow-xl hover:scale-105 transition-all duration-200"
                    >
                      <div
                        className="flex flex-row justify-between items-center w-full min-h-[50px] p-3 bg-red-900 text-white">
                    <span className="text-left flex-1  pr-2 text-sm font-semibold">
                   {team1?.name}
                    </span>
                        <div className="flex flex-row gap-1">
                          {bracket.results?.map((val, i) => (
                            <span
                              key={i}
                              className="w-7 h-7 text-xs text-white bg-gray-800 border border-gray-600 rounded flex items-center justify-center"
                            >
                          {val.split('-')[0]}
                        </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-row justify-between items-center w-full min-h-[50px] p-3">
                    <span className="text-left flex-1 text-white truncate pr-2 text-sm font-semibold">
                                     {team2?.name}
                    </span>
                        <div className="flex flex-row gap-1">
                          {bracket.results?.map((val, i) => (
                            <span
                              key={i}
                              className="w-7 h-7 text-xs text-white bg-gray-800 border border-gray-600 rounded flex items-center justify-center"
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

            );
          })}
        </div>

        <div className="grid grid-cols-4 gap-8 pb-20 items-start mt-20 justify-center">
          {groupLosersBracket(bracketsData?.data || [], maxNumberOfParticipants).map((round, roundIndex) => {
            return (
                <div
                    key={roundIndex}
                    className="flex flex-col gap-40 items-center h-full justify-center"
                >
                  {round.filter(round => round.type === 'losers').map((bracket, idx) => {
                    const team1 = participantsMap[bracket.team1?.id || bracket.team1];
                    const team2 = participantsMap[bracket.team2?.id || bracket.team2];

                    return (
                        <div
                            onClick={() => handleModal(bracket)}
                            key={bracket.id}
                            className="flex flex-col bg-black min-w-[280px] max-w-[300px] w-full font-bold border-2 border-black divide-y-2 divide-red-900 rounded items-center text-center cursor-pointer hover:shadow-xl hover:scale-105 transition-all duration-200"
                        >
                          <div className="flex flex-row justify-between items-center w-full min-h-[50px] p-3 bg-red-900 text-white">
                <span className="text-left flex-1 pr-2 text-sm font-semibold">
                  {team1?.name}
                </span>
                            <div className="flex flex-row gap-1">
                              {bracket.results?.map((val, i) => (
                                  <span
                                      key={i}
                                      className="w-7 h-7 text-xs text-white bg-gray-800 border border-gray-600 rounded flex items-center justify-center"
                                  >
                      {val.split('-')[0]}
                    </span>
                              ))}
                            </div>
                          </div>

                          <div className="flex flex-row justify-between items-center w-full min-h-[50px] p-3">
                <span className="text-left flex-1 text-white truncate pr-2 text-sm font-semibold">
                  {team2?.name}
                </span>
                            <div className="flex flex-row gap-1">
                              {bracket.results?.map((val, i) => (
                                  <span
                                      key={i}
                                      className="w-7 h-7 text-xs text-white bg-gray-800 border border-gray-600 rounded flex items-center justify-center"
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
            );
          })}
        </div>
      </div>
    </div>
  )
}

export default DoubleElimination;