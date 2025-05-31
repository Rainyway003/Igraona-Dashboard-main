import { Button, Form, FormProps, Input } from "antd"

type MultiDayEditValues = {
    tournamentName: string
    game: string
    prize: string
    numOfPlayersPerT: number
    numOfTeams: number
    lastsFrom: string
    lastsUntil: string
}

type MultiDayEditProps = {
    onFinish?: FormProps<MultiDayEditValues>['onFinish']
}

const MultiDayEdit: React.FC<MultiDayEditProps> = ({ onFinish }) => {
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
            </Form.Item>
        </div>
    )
}

export default MultiDayEdit