import React, {useState, useEffect} from 'react'
import {Avatar, Button, Form, Input, Layout, theme} from 'antd'
import {CreateButton} from "@refinedev/antd"
import {ArrowLeftOutlined, PlusSquareOutlined} from "@ant-design/icons"
import {useNavigate} from "react-router"
import {useForm} from "@refinedev/antd"
import {storage} from '../../providers/firebase'
import {ref, uploadBytes, getDownloadURL} from 'firebase/storage'

const {Content} = Layout

const EditGame = () => {
  const {formProps, queryResult, saveButtonProps} = useForm({
    resource: 'games',
  });

  const navigate = useNavigate()

  const [imageUrl, setImageUrl] = useState<string | undefined>()
  const [imageFile, setImageFile] = useState<File | null>(null)

  const record = queryResult?.data?.data

  useEffect(() => {
    if (record?.imageUrl) {
      setImageUrl(record.imageUrl)
    }
  }, [record])

  const uploadFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0]
      setImageFile(file)
      setImageUrl(URL.createObjectURL(file))
    }
  }

  const {
    token: {colorBgContainer, borderRadiusLG},
  } = theme.useToken()

  const handleFinish = async (values: any) => {
    try {
      if (imageFile) {
        const storageRef = ref(storage, `games/${Date.now()}_${imageFile.name}`)
        await uploadBytes(storageRef, imageFile)
        const downloadURL = await getDownloadURL(storageRef)
        values.imageUrl = downloadURL
      } else {
        values.imageUrl = record?.imageUrl || ''
      }

      formProps?.onFinish?.(values)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Layout className="h-screen overflow-hidden" style={{display: 'flex', flexDirection: 'row'}}>
      <Layout style={{flex: 1, backgroundColor: '#f0f2f5'}}>

        <Form layout="vertical" {...formProps} onFinish={handleFinish}>
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
              {...saveButtonProps}
            >
              Submit
            </Button>
          </div>

          <Content
            style={{
              margin: '0px 14px',
              padding: 24,
              marginTop: 38,
              paddingBottom: 730,
              minHeight: 280,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Form.Item label="Ime igre" name="name" rules={[{required: true}]}>
              <Input placeholder="Ime igre"/>
            </Form.Item>

            <Form.Item label="Slika igre">
              <Input type="file" onChange={uploadFile}/>
            </Form.Item>

            {imageUrl && <Avatar src={imageUrl} size={100}/>}
          </Content>
        </Form>
      </Layout>
    </Layout>
  )
}

export default EditGame
