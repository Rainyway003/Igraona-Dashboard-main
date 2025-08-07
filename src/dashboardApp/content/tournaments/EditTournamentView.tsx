import {useForm, useSelect} from "@refinedev/antd";
import {Button, DatePicker, Form, Input, InputNumber, notification, Select} from "antd";
import {ArrowLeftOutlined, MinusCircleOutlined, PlusOutlined, PlusSquareOutlined} from "@ant-design/icons";
import React from "react";
import {useNavigate} from "react-router";
import dayjs from "dayjs";
import {useOutletContext, useParams} from "react-router-dom";

const {RangePicker} = DatePicker;

const EditTournament = () => {
  const {id} = useParams()
  const navigate = useNavigate();
  const {formProps, query, formLoading} = useForm({
    successNotification: false,
  });
  const {setHeaderActions} = useOutletContext<{ setHeaderActions: (node: React.ReactNode) => void }>();

  React.useEffect(() => {
    setHeaderActions(
      <div className="flex justify-between w-full">
        <Button
          type="primary"
          className="antbutton"
          onClick={() => navigate(`/tournaments/${id}`)}
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
            disabled={formLoading}
          >
            Potvrdi
          </Button>
        </div>
      </div>
    );

    return () => setHeaderActions(null);
  }, [setHeaderActions, navigate, formLoading]);


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

    try {
      const cleanValues = cleanObject({
        ...values,
        teamSizeRequired: Number(values.teamSizeRequired) || 0,
        teamSizeOptional: Number(values.teamSizeOptional) || 0,
        maxNumberOfParticipants: Number(values.maxNumberOfParticipants) || 0,
        startingAt: range[0]?.toDate(),
        endingAt: range[1]?.toDate(),
        signUpStartingAt: signUpRange[0]?.toDate(),
        signUpEndingAt: signUpRange[1]?.toDate(),
      })

      await formProps.onFinish?.(cleanValues)

      notification.success({
        message: "Turnir je uspješno ažuriran.",
        description: "Uspješno!",
      });
    } catch (error) {
      notification.error({
        message: "Došlo je do greške prilikom ažuriranja turnira.",
        description: "Greška!",
      });
    }
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
          {(fields, {add, remove}) => (
            <>

              {fields.map(({key, name, ...restField}) => (
                <div
                  key={key}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '6px',
                  }}
                >
                  <label style={{minWidth: '80px'}}>{`${name + 1}. mjesto:`}</label>

                  <Form.Item
                    {...restField}
                    name={name}
                    rules={[{required: true, message: 'Unesite nagradu'}]}
                    style={{margin: 0}}
                  >
                    <Input
                      placeholder="Nagrada"
                      style={{width: '160px'}}
                    />
                  </Form.Item>

                  {name === fields[fields.length - 1].name && (
                    <MinusCircleOutlined
                      onClick={() => remove(name)}
                      style={{color: 'red', cursor: 'pointer'}}
                    />
                  )}
                </div>
              ))}
              <Form.Item label="Nagrade" style={{marginTop: 20}}>
                <Button
                  type="dashed"
                  onClick={() => add()}
                  icon={<PlusOutlined/>}
                  style={{width: 'fit-content', padding: '0 12px'}}
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
            <InputNumber placeholder="Broj ljudi u timu" min={1} precision={0} className={'w-[140px]'}/>
          </Form.Item>
          <Form.Item
            label="Broj rezervi"
            name={'teamSizeOptional'}
          >
            <InputNumber placeholder="Broj rezervi" min={0} precision={0} className={'w-[140px]'}/>
          </Form.Item>
        </div>
        <Form.Item
          label="Maksimalan broj timova"
          name={'maxNumberOfParticipants'}
          rules={[{required: true}]}
        >
          <InputNumber placeholder="Maksimalan broj timova" min={1} precision={0} className='w-[404px]'/>
        </Form.Item>
        {range && (
          <Form.Item label={'Traje od'} rules={[{required: true}]}>
            <RangePicker
              value={range}
              showTime={{format: 'HH:mm'}}
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
              showTime={{format: 'HH:mm'}}
              onChange={(dates) => {
                setSignUpRange(dates as [dayjs.Dayjs, dayjs.Dayjs] | null);
              }}
            />
          </Form.Item>
        )}

        <Form.Item
            label="Vrsta"
            name={'type'}
            className='flex flex-col'
            rules={[{required: true}]}
        >
          <Select
              placeholder="Vrsta"
              {...ruleProps}
              options={[
                { value: 'single', label: 'Single Elimination' },
                { value: 'double', label: 'Double Elimination' },
                { value: 'group', label: 'Group Stage' },
                { value: 'robin', label: 'Round Robin' },
              ]}
              filterOption={(input, option) =>
                  (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
          />
        </Form.Item>

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