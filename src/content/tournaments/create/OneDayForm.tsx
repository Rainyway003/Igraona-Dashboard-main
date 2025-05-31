import { Button, Form, FormProps, Input } from "antd"

type OneDayFormValues = {
    tournamentName: string
    game: string
    prize: string
    numOfPlayersPerT: number
    numOfTeams: number
    dateOfT: string
}

type OneDayFormProps = {
    onFinish: FormProps<OneDayFormValues>['onFinish']
}

const OneDayForm: React.FC<OneDayFormProps> = ({ onFinish }) => {
    return (
        <Form layout="vertical" onFinish={onFinish}>
            <Form.Item
                label="Ime turnira"
                name={'tournamentName'}
                rules={[{ required: true }]}
            >
                <Input placeholder="Ime turnia" />
            </Form.Item>
            <Form.Item
                label="Igra"
                name={'game'}
                rules={[{ required: true }]}
            >
                <Input placeholder="Igra" />
            </Form.Item>
            <Form.Item
                label="Nagrada"
                name={'prize'}
                rules={[{ required: true }]}
            >
                <Input placeholder="Nagrada" />
            </Form.Item>
            <Form.Item
                label="Broj ljudi u timu"
                name={'numOfPlayersPerT'}
                rules={[{ required: true }]}
            >
                <Input placeholder="Broj ljudi u timu" type="number" />
            </Form.Item>
            <Form.Item
                label="Broj timova"
                name={'numOfTeams'}
                rules={[{ required: true }]}
            >
                <Input placeholder="Broj timova" type="number" />
            </Form.Item>
            <Form.Item
                label="Trajanje turnira"
                name={'dateOfT'}
                rules={[{ required: true }]}
            >
                <Input type="date" />
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit">
                    Submit
                </Button>
            </Form.Item>
        </Form>
    )
}

export default OneDayForm
