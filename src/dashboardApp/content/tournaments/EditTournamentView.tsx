import {useForm, useSelect} from "@refinedev/antd";
import {Button, DatePicker, Form, Input, Layout, Select, Space, theme} from "antd";
import {ArrowLeftOutlined, MinusCircleOutlined, PlusOutlined, PlusSquareOutlined} from "@ant-design/icons";
import React from "react";
import {useNavigate} from "react-router";
import dayjs from "dayjs";
import {useOutletContext} from "react-router-dom";

const {RangePicker} = DatePicker;

const EditTournament = () => {
  const navigate = useNavigate();

  const { setHeaderActions } = useOutletContext<{ setHeaderActions: (node: React.ReactNode) => void }>();

  React.useEffect(() => {
    setHeaderActions(
        <div className="flex justify-between w-full">
          <Button
              type="primary"
              className="antbutton"
              onClick={() => navigate("/tournaments")}
              icon={<ArrowLeftOutlined/>}
          >
            Nazad
          </Button>
          <div className={'flex gap-2'}>
            <Button
                type="primary"
                htmlType="submit"
                className="antbutton"
                icon={<PlusSquareOutlined/>}
                form="edit"
            >
              Potvrdi
            </Button>
          </div>
        </div>
    );

    return () => setHeaderActions(null);
  }, [setHeaderActions, navigate]);

  const {formProps, query} = useForm();

  const tournament = query?.data?.data;
  const [range, setRange] = React.useState<[dayjs.Dayjs | null, dayjs.Dayjs | null] | null>(null);
  const [signUpRange, setSignUpRange] = React.useState<[dayjs.Dayjs | null, dayjs.Dayjs | null] | null>(null);

  React.useEffect(() => {
    if (tournament) {
      const start = dayjs(tournament.startingAt.toDate());
      const end = dayjs(tournament.endingAt.toDate());
      setRange([start, end]);

      const signUpStart = dayjs(tournament.signUpStartingAt.toDate());
      const signUpEnd = dayjs(tournament.signUpEndingAt.toDate());
      setSignUpRange([signUpStart, signUpEnd]);
    }
  }, [tournament]);


  const cleanObject = (obj: Record<string, any>) =>
    Object.fromEntries(Object.entries(obj).filter(([_, v]) => v !== undefined));

  const {selectProps} = useSelect({
    resource: 'games',
    optionLabel: "name",
    optionValue: "id",
  })

  const {selectProps: ruleProps} = useSelect({
    resource: 'rules',
    optionLabel: "name",
    optionValue: "id",
  })

  const onFinish = async (values: any) => {
    if (!range || !signUpRange) {
      return;
    }

    const cleanValues = cleanObject({
      ...values,
      startingAt: range[0]?.toDate(),
      endingAt: range[1]?.toDate(),
      signUpStartingAt: signUpRange[0]?.toDate(),
      signUpEndingAt: signUpRange[1]?.toDate(),
    })

    await formProps.onFinish?.(cleanValues)
  }


  return (
 <>
        <Form layout="vertical" {...formProps} onFinish={onFinish} id='edit'>

            <Form.Item
              label="Naziv turnira"
              name={'name'}
              rules={[{required: true}]}
            >
              <Input placeholder="Ime turnira"/>
            </Form.Item>
            <Form.Item
              label="Igra"
              name={'game'}
              rules={[{required: true}]}
              className='flex flex-col'
            >
              <Select
                placeholder="Igra"
                {...selectProps}
                filterOption={(input, option) =>
                  (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                }
              />
            </Form.Item>
            <Form.List name="prizes">
                {(fields, { add, remove }) => (
                    <>

                        {fields.map(({ key, name, ...restField }) => (
                            <div
                                key={key}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    marginBottom: '6px',
                                }}
                            >
                                <label style={{ minWidth: '80px' }}>{`${name + 1}. mjesto:`}</label>

                                <Form.Item
                                    {...restField}
                                    name={name}
                                    rules={[{ required: true, message: 'Unesite nagradu' }]}
                                    style={{ margin: 0 }}
                                >
                                    <Input
                                        placeholder="Nagrada"
                                        style={{ width: '160px' }}
                                    />
                                </Form.Item>

                                {name === fields[fields.length - 1].name && (
                                    <MinusCircleOutlined
                                        onClick={() => remove(name)}
                                        style={{ color: 'red', cursor: 'pointer' }}
                                    />
                                )}
                            </div>
                        ))}
                        <Form.Item label="Nagrade" style={{ marginTop: 20 }}>
                            <Button
                                type="dashed"
                                onClick={() => add()}
                                icon={<PlusOutlined />}
                                style={{ width: 'fit-content', padding: '0 12px' }}
                            >
                                Dodaj nagradu
                            </Button>
                        </Form.Item>
                    </>
                )}
            </Form.List>
            <div className={'flex mt-8 gap-9'}>
              <Form.Item
                label="Broj ljudi u timu"
                name={'teamSizeRequired'}
                rules={[{required: true}]}
              >
                <Input placeholder="Broj ljudi u timu" type="number"/>
              </Form.Item>
              <Form.Item
                label="Broj rezervi"
                name={'teamSizeOptional'}
              >
                <Input placeholder="Broj rezervi" type="number"/>
              </Form.Item>
            </div>
            <Form.Item
                label="Maksimalan broj timova"
                name={'maxNumberOfParticipants'}
                rules={[{required: true}]}
            >
                <Input placeholder="Maksimalan broj timova" type="number" className='w-[404px]'/>
            </Form.Item>
            {range && (
              <Form.Item label={'Traje od'} rules={[{required: true}]}>
                <RangePicker
                  value={range}
                  onChange={(dates) => {
                    setRange(dates as [dayjs.Dayjs, dayjs.Dayjs] | null);
                  }}
                />
              </Form.Item>
            )}

            {signUpRange && (
              <Form.Item label={'Trajanje prijava'} rules={[{required: true}]}>
                <RangePicker
                  value={signUpRange}
                  onChange={(dates) => {
                    setSignUpRange(dates as [dayjs.Dayjs, dayjs.Dayjs] | null);
                  }}
                />
              </Form.Item>
            )}

            <Form.Item
              label="Pravila"
              name={'rule'}
              className='flex flex-col'
            >
              <Select
                placeholder="Pravila"
                {...ruleProps}
                filterOption={(input, option) =>
                  (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                }
              />
            </Form.Item>

        </Form>
</>
  );
};

export default EditTournament