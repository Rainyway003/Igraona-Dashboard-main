import React, {FC} from 'react'
import {Avatar, Button, Form, Input, Layout, theme} from 'antd'
import {useCreate} from "@refinedev/core"
import {useNavigate} from "react-router"
import {CreateButton} from "@refinedev/antd"
import {ArrowLeftOutlined, PlusSquareOutlined} from "@ant-design/icons"
import {storage} from '../../providers/firebase'
import {ref, uploadBytes, getDownloadURL} from 'firebase/storage'

const {Content} = Layout

const CreateGame: FC = () => {
  const navigate = useNavigate()
  const {mutate} = useCreate()

  const {
    token: {colorBgContainer, borderRadiusLG},
  } = theme.useToken()

  const [imageUrl, setImageUrl] = React.useState<string | undefined>(undefined)
  const [imageFile, setImageFile] = React.useState<File | undefined>(undefined)

  const uploadFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0]
      setImageFile(file)
      setImageUrl(URL.createObjectURL(file))
    }
  }

  const onFinish = async (values: { name: string }) => {
    try {
      if (!imageFile) {
        throw new Error("Treba slika")
      }

      const storageRef = ref(storage, `games/${Date.now()}_${imageFile.name}`)
      await uploadBytes(storageRef, imageFile)
      const downloadURL = await getDownloadURL(storageRef)

      mutate({
        resource: 'games',
        values: {
          name: values.name,
          imageUrl: downloadURL,
        },
      })

      navigate('/games')
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Layout className="h-screen overflow-y-hidden" style={{display: 'flex', flexDirection: 'row'}}>
      <Layout style={{flex: 1, backgroundColor: '#f0f2f5'}}>
        <Form layout="vertical" onFinish={onFinish}>
          <div className='sticky top-[19px] pr-[14px] pl-[14px] z-10 flex justify-between mb-4'>
            <CreateButton
              type="primary"
              className="antbutton"
              onClick={() => navigate('/games')}
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
              paddingBottom: 730,
              marginTop: 38,
              minHeight: 280,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Form.Item
              label={"Ime igre"}
              name={'name'}
              rules={[{required: true}]}
            >
              <Input placeholder={'Ime igre'}/>
            </Form.Item>
            <Form.Item
              label={"Slika igre"}
              rules={[{required: true}]}
            >
              <Input type={'file'} onChange={uploadFile}/>
            </Form.Item>
            {imageUrl && <Avatar src={imageUrl} size={100}/>}
          </Content>
        </Form>
      </Layout>
    </Layout>
  )
}

export default CreateGame