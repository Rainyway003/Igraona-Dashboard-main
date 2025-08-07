import React, {FC, useState} from 'react'
import {Input, notification, Space, Table} from "antd";
import {useList, useUpdate} from "@refinedev/core";
import {useNavigate, useOutletContext, useParams} from "react-router";
import {DeleteButton, EditButton} from "@refinedev/antd";
import {CheckOutlined, CloseOutlined} from "@ant-design/icons";


const ShowSubmissions: FC = () => {
  const {id} = useParams()
  const navigate = useNavigate()
  const {mutate} = useUpdate()

  const [searchTerm, setSearchTerm] = useState<string>("");

  const {setHeaderActions} = useOutletContext<{ setHeaderActions: (node: React.ReactNode) => void }>();

  const handleBestTrue = (recordId) => {
    mutate({
      resource: "submissions",
      id: recordId,
      values: {
        best: true
      },
      meta: {
        monthId: id
      }
    })
  }
  const handleBestFalse = (recordId) => {
    mutate({
      resource: "submissions",
      id: recordId,
      values: {
        best: false
      },
      meta: {
        monthId: id
      }
    })
  }

  React.useEffect(() => {
    setHeaderActions(
      <div className="flex w-full gap-4">
        <Input
          rootClassName={'w-96'}
          placeholder="Pretraži turnire"
          className='shadow-md'
          allowClear
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
    );
  }, [navigate, searchTerm, setHeaderActions]);

  const {data, isLoading} = useList<any>({
    resource: "submissions",
    meta: {
      monthId: id
    }
  })

  const columns = [
    {
      title: 'Ime i prezime',
      dataIndex: 'name',
      key: 'name',
      render: (_: any, record: any) => (
        <Space>
          {record.name || 'N/A'}
        </Space>
      ),
    },
    {
      title: 'Akcije',
      key: 'actions',
      render: (_: any, record: any) => (
        <Space>
          {record.best ?
            <EditButton icon={<CloseOutlined/>} size='small' hideText onClick={() => handleBestFalse(record.id)}/>
            :
            <EditButton icon={<CheckOutlined/>} size='small' hideText onClick={() => handleBestTrue(record.id)}/>
          }
          <DeleteButton
            hideText
            size="small"
            resource="submissions"
            recordItemId={record.id}
            successNotification={false}
            onSuccess={() => {
              notification.success({
                message: "Plej je uspješno izbrisan.",
                description: "Uspješno!",
              });
            }}
            confirmCancelText="Odustani"
            confirmOkText="Izbriši"
            confirmTitle="Jeste li sigurni?"
            meta={{monthId: id}}
          />
        </Space>
      )
    },
  ]

  return (
    <>
      <Table
        loading={isLoading}
        dataSource={data?.data}
        columns={columns}
        rowKey="id"
        pagination={{
          pageSize: 10,
          position: ['bottomCenter'],
        }}
        expandable={{
          expandedRowRender: (record) => (
            <video
              width="100%"
              controls
              preload="metadata"
              style={{borderRadius: '6px'}}
            >
              <source src={record.videoUrl} type="video/mp4"/>
              <source src={record.videoUrl} type="video/webm"/>
            </video>
          )
        }}
      />
    </>
  )
}

export default ShowSubmissions