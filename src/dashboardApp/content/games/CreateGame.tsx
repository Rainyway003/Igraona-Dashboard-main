import React, {FC} from 'react'
import {Avatar, Button, Form, Input, Layout, theme} from 'antd'
import {useCreate} from "@refinedev/core"
import {useNavigate} from "react-router"
import {CreateButton} from "@refinedev/antd"
import {ArrowLeftOutlined, PlusSquareOutlined} from "@ant-design/icons"
import {storage} from '../../providers/firebase'
import {ref, uploadBytes, getDownloadURL} from 'firebase/storage'
import {useOutletContext} from "react-router-dom";

const {Content} = Layout

const CreateGame: FC = () => {
  const navigate = useNavigate()
  const {mutate, isLoading} = useCreate()
  const {setHeaderActions} = useOutletContext<{ setHeaderActions: (node: React.ReactNode) => void }>();

  React.useEffect(() => {
    setHeaderActions(
      <div className="flex justify-between w-full">
        <CreateButton
          type="primary"
          className="antbutton"
          onClick={() => navigate('/games')}
          icon={<ArrowLeftOutlined/>}
        >
          Nazad
        </CreateButton>
        <Button
          type="primary"
          htmlType="submit"
          className="antbutton"
          form='create'
          disabled={isLoading}
          icon={<PlusSquareOutlined/>}
        >
          Potvrdi
        </Button>
      </div>
    );

    return () => setHeaderActions(null);
  }, [setHeaderActions, navigate, isLoading,]);

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
    <>
      <Form layout="vertical" onFinish={onFinish} id='create'>
        <Form.Item
          label={"Naziv igre"}
          name={'name'}
          rules={[{required: true}]}
        >
          <Input placeholder={'Naziv igre'}/>
        </Form.Item>
        <Form.Item
          label={"Slika igre"}
          rules={[{required: true}]}
        >
          <Input type={'file'} onChange={uploadFile}/>
        </Form.Item>
        {imageUrl && <Avatar src={imageUrl} size={100}/>}
      </Form>
    </>
  )
}

export default CreateGame