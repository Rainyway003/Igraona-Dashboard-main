import {Button, DatePicker, Form, Input, Layout, Select, Space, theme} from 'antd'
import {useNavigate} from 'react-router'
import React, {useState} from 'react';
import {useCreate} from '@refinedev/core';
import {CreateButton, useSelect} from "@refinedev/antd";
import dayjs from 'dayjs'
import {MinusCircleOutlined, PlusOutlined, ArrowLeftOutlined, PlusSquareOutlined} from '@ant-design/icons';

const {RangePicker} = DatePicker;
const {Content} = Layout

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
    optionValue: "name",
  })

  const {selectProps: ruleProps} = useSelect({
    resource: 'rules',
    optionLabel: "name",
    optionValue: "id",
  })


  const {
    token: {colorBgContainer, borderRadiusLG},
  } = theme.useToken();

  const cleanObject = (obj: Record<string, any>) =>
    Object.fromEntries(Object.entries(obj).filter(([_, v]) => v !== undefined));

  const onFinish = (values: any) => {
    console.log(values)
    mutate({
      resource: 'tournaments',
      values: cleanObject({
        ...values,
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
    <Layout className="h-screen overflow-y-auto" style={{display: 'flex', flexDirection: 'row'}}>
      <Layout style={{flex: 1, backgroundColor: '#f0f2f5'}}>

        <Form layout="vertical" onFinish={onFinish}>

          <div className='sticky w-full top-[7px] pr-[14px] pl-[14px] z-10 flex justify-between mb-4'>
            <CreateButton
              type="primary"
              className="antbutton"
              onClick={() => navigate('/tournaments')}
              icon={<ArrowLeftOutlined/>}
            >
              Back
            </CreateButton>
            <div className={'flex gap-2'}>
              <Button
                type="primary"
                htmlType="submit"
                className="antbutton"
                icon={<PlusSquareOutlined/>}
              >
                Submit
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                className="antbutton"
                icon={<PlusSquareOutlined/>}
                onClick={() => setVisible(true)}
              >
                Submit and Publish
              </Button>
            </div>
          </div>


          <Content
            style={{
              margin: '0px 14px',
              padding: 24,
              paddingBottom: 406,
              minHeight: 360,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
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
                  <Form.Item label={"Nagrade"}>
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
          </Content>
        </Form>
      </Layout>
    </Layout>
  )
}

export default CreateTournamentView