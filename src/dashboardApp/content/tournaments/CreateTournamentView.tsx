import {Button, DatePicker, Form, Input, InputNumber, Select, Space} from 'antd'
import {useNavigate, useOutletContext} from 'react-router-dom'
import React, {useState} from 'react';
import {useCreate} from '@refinedev/core';
import {useSelect} from "@refinedev/antd";
import dayjs from 'dayjs'
import {MinusCircleOutlined, PlusOutlined, ArrowLeftOutlined, PlusSquareOutlined} from '@ant-design/icons';

const {RangePicker} = DatePicker;

const CreateTournamentView = () => {
  const {mutate, isLoading} = useCreate();
  const navigate = useNavigate();

  const [visible, setVisible] = useState<boolean>(false);

  const disablePastDates = (current: dayjs.Dayjs) => {
    return current && current < dayjs().startOf('day');
  };


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


  const {setHeaderActions} = useOutletContext<{ setHeaderActions: (node: React.ReactNode) => void }>();

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
            form="create"
            disabled={isLoading}
          >
            Potvrdi
          </Button>
        </div>
      </div>
    );

    return () => setHeaderActions(null);
  }, [setHeaderActions, navigate, isLoading,]);

  const cleanObject = (obj: Record<string, any>) =>
    Object.fromEntries(Object.entries(obj).filter(([_, v]) => v !== undefined));

  const onFinish = (values: any) => {
    mutate(
      {
        resource: 'tournaments',
        values: cleanObject({
          ...values,
          teamSizeRequired: Number(values.teamSizeRequired) || 0,
          teamSizeOptional: Number(values.teamSizeOptional) || 0,
          maxNumberOfParticipants: Number(values.maxNumberOfParticipants) || 0,
          startingAt: values.startingAt[0].$d,
          endingAt: values.startingAt[1].$d,
          signUpStartingAt: values.signUpStartingAt[0].$d,
          signUpEndingAt: values.signUpStartingAt[1].$d,
          visible: visible,
        }),
        successNotification: () => ({
          message: "Turnir je uspješno kreiran.",
          description: "Uspješno!",
          type: "success",
        }),
        errorNotification: (error) => ({
          message: "Došlo je do greške pri kreiranju turnira.",
          description: "Greška!",
          type: "error",
        }),
      },
    )
    navigate('/tournaments')
  }


  return (
    <Form layout="vertical" onFinish={onFinish} id="create">


      <Form.Item
        label="Naziv turnira"
        name={'name'}
        rules={[{required: true}]}
      >
        <Input placeholder="Naziv turnira"/>
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
      <Form.Item
        label="Traje od"
        name={'startingAt'}
        rules={[{required: true}]}
      >
        <RangePicker
          showTime={{format: 'HH:mm'}}
          disabledDate={disablePastDates}/>
      </Form.Item>
      <Form.Item
        label="Trajanje prijava"
        name={'signUpStartingAt'}
        rules={[{required: true}]}
      >
        <RangePicker
          showTime={{format: 'HH:mm'}}
          disabledDate={disablePastDates}/>
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
  )
}

export default CreateTournamentView