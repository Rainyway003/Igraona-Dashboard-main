import React, {useState, useEffect} from 'react'
import {Avatar, Button, Form, Input, Layout, notification,} from 'antd'
import {ArrowLeftOutlined, PlusSquareOutlined} from "@ant-design/icons"
import {useNavigate} from "react-router"
import {useForm} from "@refinedev/antd"
import {storage} from '../../providers/firebase'
import {ref, uploadBytes, getDownloadURL} from 'firebase/storage'
import {useOutletContext} from "react-router-dom";

const EditGame = () => {
  const {formProps, queryResult, formLoading} = useForm({
    resource: 'games',
    successNotification: false,
  });

  const navigate = useNavigate()

  const {setHeaderActions} = useOutletContext<{ setHeaderActions: (node: React.ReactNode) => void }>();

  React.useEffect(() => {
    setHeaderActions(
        <div className="flex justify-between w-full">
          <Button
              type="primary"
              className="antbutton"
              onClick={() => navigate('/games')}
              icon={<ArrowLeftOutlined/>}
          >
            Nazad
          </Button>

          <Button
              type="primary"
              htmlType="submit"
              className="antbutton"
              form="edit"
              disabled={formLoading}
              icon={<PlusSquareOutlined/>}
          >
            Potvrdi
          </Button>

        </div>
    );
  }, [navigate, setHeaderActions, formLoading]);

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

      await formProps?.onFinish?.(values);

      notification.success({
        message: "Igra je uspješno ažurirana.",
        description: "Uspješno!",
      });
    } catch (error: any) {
      notification.error({
        message: "Došlo je do greške prilikom ažuriranja igre.",
        description: error?.message || "Molimo pokušajte ponovo ili provjerite podatke.",
      });
    }
  };

  return (
    <>
      <Form layout="vertical" {...formProps} onFinish={handleFinish} id='edit'>
        <Form.Item label="Naziv igre" name="name" rules={[{required: true}]}>
          <Input placeholder="Naziv igre"/>
        </Form.Item>

        <Form.Item label="Slika igre">
          <Input type="file" onChange={uploadFile}/>
        </Form.Item>

        {imageUrl && <Avatar src={imageUrl} size={100}/>}
      </Form>
    </>
  )
}

export default EditGame
