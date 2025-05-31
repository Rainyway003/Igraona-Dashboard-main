import {Button, Input} from "antd";
import {addDoc, collection} from "firebase/firestore";
import {useState} from "react"
import {db} from "../../providers/firebase";
import {Modal} from 'antd'


const BanPlayer = ({player}: { player: any }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [name, setName] = useState('')
    const [reason, setReason] = useState('')


    const handleBan = async () => {
        const docRef = await addDoc(collection(db, 'banned'), {
            faceit: player.url,
            reason: reason,
            timestamp: new Date()
        });
    }

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        handleBan();
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    return (
        <div>
            <Button type="primary" onClick={showModal} className='antbutton'>
                BAN
            </Button>
            <Modal title="Banaj Čovika" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                <Input
                    placeholder="Razlog"
                    onChange={(e) => setReason(e.target.value)}
                    className="mb-1"
                />
            </Modal>
        </div>
    )
}

export default BanPlayer