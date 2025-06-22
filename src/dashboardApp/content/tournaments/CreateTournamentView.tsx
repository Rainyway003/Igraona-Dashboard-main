import {Button, DatePicker, Form, Input, Select, Space} from 'antd'
import {useNavigate, useOutletContext} from 'react-router-dom'
import React, {useState} from 'react';
import {useCreate} from '@refinedev/core';
import { useSelect} from "@refinedev/antd";
import dayjs from 'dayjs'
import {MinusCircleOutlined, PlusOutlined, ArrowLeftOutlined, PlusSquareOutlined} from '@ant-design/icons';

const {RangePicker} = DatePicker;

const CreateTournamentView = () => {
  const {mutate} = useCreate();
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
          Back
        </Button>
        <div className={'flex gap-2'}>
          <Button
            type="primary"
            htmlType="submit"
            className="antbutton"
            icon={<PlusSquareOutlined/>}
            form="create"
          >
            Submit
          </Button>
        </div>
      </div>
    );

      return () => setHeaderActions(null);
  }, [setHeaderActions, navigate]);

  const cleanObject = (obj: Record<string, any>) =>
    Object.fromEntries(Object.entries(obj).filter(([_, v]) => v !== undefined));

  const onFinish = (values: any) => {
    console.log(values)
    mutate({
      resource: 'tournaments',
      values: cleanObject({
        ...values,
        teamSizeRequired: Number(values.teamSizeRequired),
        teamSizeOptional: Number(values.teamSizeOptional),
        maxNumberOfParticipants: Number(values.maxNumberOfParticipants),
        startingAt: values.startingAt[0].$d,
        endingAt: values.startingAt[1].$d,
        signUpStartingAt: values.signUpStartingAt[0].$d,
        signUpEndingAt: values.signUpStartingAt[1].$d,
        visible: visible,
      }),
    })
    navigate('/tournaments')
  }


  return (
        <Form layout="vertical" onFinish={onFinish} id="create">


            <Form.Item
              label="Ime turnira"
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
                    <Space key={key} style={{display: 'flex', marginBottom: 8}} align="baseline">
                      <Form.Item
                        {...restField}
                        name={name}
                        rules={[{required: true}]}
                        label={`${name + 1}. Mjesto`}
                      >
                        <Input placeholder={`${name + 1}`}/>
                      </Form.Item>
                      <MinusCircleOutlined onClick={() => remove(name)}/>
                    </Space>
                  ))}
                  <Form.Item label={"Nagrade"} className={' w-48'}>
                    <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined/>}>
                      Add field
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
            <div className={'flex justify-evenly'}>
              <Form.Item
                label="Broj ljudi u timu"
                name={'teamSizeRequired'}
                rules={[{required: true}]}
              >
                <Input placeholder="Broj ljudi u timu" type="number"/>
              </Form.Item>
              <Form.Item
                label="Broj ljudi u timu"
                name={'teamSizeOptional'}
              >
                <Input placeholder="Broj ljudi u timu" type="number"/>
              </Form.Item>
            </div>
            <Form.Item
              label="Broj timova"
              name={'maxNumberOfParticipants'}
              rules={[{required: true}]}
            >
              <Input placeholder="Broj timova" type="number"/>
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
              label="Trajanje Prijava"
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
              rules={[{required: true}]}
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