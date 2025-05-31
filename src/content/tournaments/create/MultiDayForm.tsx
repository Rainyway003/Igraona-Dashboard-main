import { Button, Form, FormProps, Input } from "antd"

type MultiDayFormValues = {
    tournamentName: string
    game: string
    prize: string
    numOfPlayersPerT: number
    numOfTeams: number
    lastsFrom: string
    lastsUntil: string
}

type MultiDayFormProps = {
    onFinish: FormProps<MultiDayFormValues>['onFinish']
}

const MultiDayForm: React.FC<MultiDayFormProps> = ({ onFinish }) => {
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
            <div className="flex justify-evenly">
                <Form.Item
                    label="Traje od"
                    name={'lastsFrom'}
                    rules={[{ required: true }]}
                >
                    <Input type="date" />
                </Form.Item>
                <Form.Item
                    label="Traje do"
                    name={'lastsUntil'}
                    rules={[{ required: true }]}
                >
                    <Input type="date" />
                </Form.Item>
            </div>
            <Form.Item>
                <Button type="primary" htmlType="submit">
                    Submit
                </Button>
            </Form.Item>
        </Form>
    )
}

export default MultiDayForm