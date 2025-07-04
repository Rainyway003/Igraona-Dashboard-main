import {Button, Form, Input, Layout, theme} from 'antd'
import {useNavigate, useParams} from 'react-router'
import {useCreate, useOne} from '@refinedev/core';
import {CreateButton} from "@refinedev/antd";
import {
  ArrowLeftOutlined,
  PlusSquareOutlined,
  StarOutlined
} from "@ant-design/icons";

const {Content} = Layout

type CreateTeamFormValues = {
  name: string
  number: number
  [key: string]: string | number
}


const CreateTeam = () => {
  const {id} = useParams()
  const {mutate} = useCreate()

  const {data} = useOne({
    resource: 'tournaments',
    id: id ?? "",
  })

  const {
    token: {colorBgContainer, borderRadiusLG},
  } = theme.useToken();

  const tournament = data?.data

  console.log(tournament)


  const navigate = useNavigate();

  const cleanObject = (obj: Record<string, any>) =>
    Object.fromEntries(Object.entries(obj).filter(([_, v]) => v !== undefined));

  const onFinish = (values: CreateTeamFormValues) => {
    const numberOfPlayers = Number(tournament?.teamSizeOptional ?? 0) + Number(tournament?.teamSizeRequired ?? 0);

    const players = Array.from({length: numberOfPlayers}, (_, i) => {
      const key = `player${i + 1}`;
      return {[key]: values[key] || ""};
    });

    const playerFields = Object.assign({}, ...players);

    mutate({
      resource: "participants",
      values: cleanObject({
        ...values,
        ...playerFields,
        tournamentId: id,
      })
    });
    navigate(`/tournaments/${id}`);
  }

  return (
    <Layout className="h-screen" style={{display: 'flex', flexDirection: 'row'}}>
      <Layout style={{flex: 1, backgroundColor: '#f0f2f5'}}>

        <Form layout="vertical" onFinish={onFinish}>
          <div className='sticky top-[7px] pr-[14px] pl-[14px] z-10 flex justify-between mb-4'>
            <CreateButton
              type="primary"
              className="antbutton"
              onClick={() => navigate(`/tournaments/${id}`)}
              icon={<ArrowLeftOutlined/>}
            >
              Nazad
            </CreateButton>

            <Button
              type="primary"
              htmlType="submit"
              className="antbutton"
              icon={<PlusSquareOutlined/>}
            >
              Potvrdi
            </Button>
          </div>

          <Content
            style={{
              margin: '0px 14px',
              padding: 24,
              paddingBottom: 556,
              minHeight: 280,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Form.Item
              label={"Ime tima"}
              name={'name'}
              rules={[{required: true}]}
            >
              <Input placeholder={'Ime tima'}/>
            </Form.Item>
            <Form.Item
              label={"Kontakt telefon"}
              name={'number'}
              rules={[{required: true}]}
            >
              <Input placeholder={'Kontakt telefon'} type={"number"}/>
            </Form.Item>
            <div className={'flex flex-col'}>
              {Array.from({length: tournament?.teamSizeRequired || 0}).map((_, index) => (
                <Form.Item
                  key={index}
                  name={`player${index + 1}`}
                  rules={[{required: true}]}
                >
                  <Input placeholder={`Igrač ${index + 1} Faceit link`}
                         prefix={<StarOutlined className={'text-red-500'}/>}/>
                </Form.Item>
              ))}
              {Array.from({length: tournament?.teamSizeOptional || 0}).map((_, index) => (
                <Form.Item
                  key={index}
                  name={`player${index + 1 + Number(tournament?.teamSizeRequired)}`}
                >
                  <Input
                    placeholder={`Rezerva ${index + 1 + Number(tournament?.teamSizeRequired)} Faceit link`}/>
                </Form.Item>
              ))}
            </div>
          </Content>
        </Form>
      </Layout>
    </Layout>
  )
}

export default CreateTeam