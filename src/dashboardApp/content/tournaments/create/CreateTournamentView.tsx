import {Button, Checkbox, DatePicker, Form, Input, Layout, Select, Space, theme} from 'antd'
import {useNavigate} from 'react-router'
import React, {useState} from 'react';
import {useCreate} from '@refinedev/core';
import {CreateButton, useSelect} from "@refinedev/antd";
import dayjs from 'dayjs'
import {MinusCircleOutlined, PlusOutlined, ArrowLeftOutlined, PlusSquareOutlined} from '@ant-design/icons';

const {RangePicker} = DatePicker;
const {Content} = Layout

const CreateTournamentView = () => {
  const {mutate, isLoading, isSuccess, error} = useCreate();
  const navigate = useNavigate();


  const disablePastDates = (current) => {
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
      }),
    })
    navigate('/tournaments')
  }


  return (
    <Layout className="h-screen overflow-y-auto" style={{display: 'flex', flexDirection: 'row'}}>
      <Layout style={{flex: 1, backgroundColor: '#f0f2f5'}}>

        <Form layout="vertical" onFinish={onFinish}>
        <Form.Item>
        <div className='sticky pt-2 pr-6 pl-6 z-10 flex justify-between'>
          <CreateButton
            type="primary"
            className="antbutton"
            onClick={() => navigate('/tournaments')}
            icon={<ArrowLeftOutlined/>}
          >
            Back
          </CreateButton>
          <Button
            type="primary"
            htmlType="submit"
            className="antbutton"
            icon={<PlusSquareOutlined/>}
          >
            Submit
          </Button>
        </div>
      </Form.Item>

        <Content
          style={{
            margin: '14px 14px',
            padding: 24,
            minHeight: 280,
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