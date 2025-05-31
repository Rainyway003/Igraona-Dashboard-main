import { Button, Form, FormProps, Input } from "antd"

type OneDayEditValues = {
    tournamentName: string
    game: string
    prize: string
    numOfPlayersPerT: number
    numOfTeams: number
    dateOfT: string
}

type OneDayEditProps = {
    onFinish?: FormProps<OneDayEditValues>['onFinish']
}

const OneDayEdit: React.FC<OneDayEditProps> = ({ onFinish }) => {
    return (
        <div>
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
            </Form.Item>
        </div>
    )
}

export default OneDayEdit
