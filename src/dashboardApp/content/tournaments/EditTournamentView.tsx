import {CreateButton, useForm, useSelect} from "@refinedev/antd";
import {Button, DatePicker, Form, Input, Layout, Select, Space, theme} from "antd";
import {ArrowLeftOutlined, MinusCircleOutlined, PlusOutlined, PlusSquareOutlined} from "@ant-design/icons";
import React from "react";
import {useNavigate} from "react-router";
import dayjs from "dayjs";

const {RangePicker} = DatePicker;
const {Content} = Layout

const EditTournament = () => {

  const {formProps, query} = useForm();
  const navigate = useNavigate();

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


  const {
    token: {colorBgContainer, borderRadiusLG},
  } = theme.useToken();

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
    <Layout className="h-screen overflow-hidden" style={{display: 'flex', flexDirection: 'row'}}>
      <Layout style={{flex: 1, backgroundColor: '#f0f2f5'}}>
        <Form layout="vertical" {...formProps} onFinish={onFinish}>

          <div className='sticky w-full top-[19px] pr-[14px] pl-[14px] z-10 flex justify-between mb-4'>
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

          <Content
            style={{
              margin: '0px 14px',
              padding: 24,
              paddingBottom: 406,
              marginTop: 38,
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
              <Form.Item label={'Trajanje Prijava'} rules={[{required: true}]}>
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
  );
};

export default EditTournament