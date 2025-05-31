import { Button, Form, FormProps, Input } from 'antd'
import React from 'react'
import FormInput from '../../../../landingPage/components/forms/FormInput'
import { useParams } from 'react-router'
import { useOne } from '@refinedev/core'

type CreateTeamFormValues = {
    name?: string
    number?: number
}

type CreateTeamFormProps = {
    onFinish?: FormProps<CreateTeamFormValues>['onFinish']
}

const CreateTeamForm: React.FC<CreateTeamFormProps> = ({ onFinish }) => {
    const { id } = useParams()

    const { data, isLoading, isError } = useOne({
        resource: 'tournaments',
        id: id ?? "",
    })

    const tournament = data?.data

    return (
        <Form layout="vertical" onFinish={onFinish}>
            <Form.Item
                label={"Ime Tima"}
                name={'name'}
                rules={[{ required: true }]}
            >
                <Input placeholder={'Ime tima'} />
            </Form.Item>
            <Form.Item
                label={"Kontakt telefon"}
                name={'number'}
                rules={[{ required: true }]}
            >
                <Input placeholder={'Kontakt telefon'} type='number' />
            </Form.Item>

            {Array.from({ length: tournament?.numOfPlayersPerT || 0 }).map((_, index) => (
                <Form.Item
                    key={index}
                    label={`Igrač ${index + 1}`}
                    name={`player${index + 1}`}
                    rules={[{ required: true }]}
                >
                    <Input placeholder={`Igrač ${index + 1} Faceit link`} />
                </Form.Item>
            ))}
            <Form.Item>
                <Button type="primary" htmlType="submit">
                    Submit
                </Button>
            </Form.Item>
        </Form>
    )
}

export default CreateTeamForm