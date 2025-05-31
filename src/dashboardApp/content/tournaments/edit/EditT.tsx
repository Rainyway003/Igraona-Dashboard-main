import {CreateButton, useForm, useSelect} from "@refinedev/antd";
import {Button, Checkbox, DatePicker, Form, Input, Layout, Select, Space, theme} from "antd";
import {ArrowLeftOutlined, MinusCircleOutlined, PlusOutlined, PlusSquareOutlined} from "@ant-design/icons";
import React from "react";
import {useNavigate} from "react-router";
import dayjs from "dayjs";

const {RangePicker} = DatePicker;
const {Content} = Layout

const EditTournament = () => {

  const {formProps, saveButtonProps, query, formLoading} = useForm();
  const navigate = useNavigate();

  const tournament = query?.data?.data;
  const startDate = dayjs(tournament?.startingAt.toDate());
  const endDate = dayjs(tournament?.endingAt.toDate());
  const [range, setRange] = React.useState<[dayjs.Dayjs, dayjs.Dayjs]>([startDate, endDate]);
  console.log(range[0].$d);
  console.log(range[1].$d);
  console.log(tournament);

  const cleanObject = (obj: Record<string, any>) =>
    Object.fromEntries(Object.entries(obj).filter(([_, v]) => v !== undefined));

  const {selectProps} = useSelect({
    resource: 'games',
    optionLabel: "name",
    optionValue: "name",
  })

  const {selectProps: ruleProps} = useSelect({
    resource: 'rules',
    optionLabel: "name",
    optionValue: "name",
  })


  const {
    token: {colorBgContainer, borderRadiusLG},
  } = theme.useToken();

  const onFinish = async (values: any) => {
    const cleanValues = cleanObject({
      ...values,
      startingAt: range[0].$d,
      endingAt: range[1].$d,
    })

    await formProps.onFinish?.(cleanValues)
  }


  return (
    <Layout className="h-screen overflow-y-auto" style={{display: 'flex', flexDirection: 'row'}}>
      <Layout style={{flex: 1, backgroundColor: '#f0f2f5'}}>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <Form layout="vertical" {...formProps} onFinish={onFinish}>
            <Form.Item>
              <div className="flex justify-between w-full">
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
              label={'Traje od'}
              rules={[{required: true}]}
            >
              <RangePicker value={range}
                           onChange={(dates) => {
                             if (Array.isArray(dates) && dates[0] && dates[1]) {
                               setRange(dates);
                             }
                           }}
              />
            </Form.Item>
            {/*<Form.Item*/}
            {/*  label="Traje od"*/}
            {/*  name={'startingAt'}*/}
            {/*  rules={[{required: true}]}*/}
            {/*  getValueProps={(value) => ({*/}
            {/*    value: value ? dayjs(value.toDate ? value.toDate() : value) : null,*/}
            {/*  })}*/}
            {/*>*/}
            {/*  <DatePicker/>*/}
            {/*</Form.Item>*/}

            {/*{*/}
            {/*  tournament?.startingAt != tournament?.endingAt ?*/}
            {/*    <Form.Item*/}
            {/*      label="Traje do"*/}
            {/*      name={'endingAt'}*/}
            {/*      getValueProps={(value) => ({*/}
            {/*        value: value ? dayjs(value.toDate ? value.toDate() : value) : null,*/}
            {/*      })}*/}
            {/*    >*/}
            {/*      <DatePicker/>*/}
            {/*    </Form.Item>*/}
            {/*    :*/}
            {/*    <></>*/}
            {/*}*/}
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
        </Content>
      </Layout>
    </Layout>
  );
};

export default EditTournament