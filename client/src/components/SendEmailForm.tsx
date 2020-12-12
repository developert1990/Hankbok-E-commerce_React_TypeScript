import React, { ChangeEvent, Dispatch, FormEvent, SetStateAction, useRef, useState } from 'react';
import TextField from '@material-ui/core/TextField';
import CloseIcon from '@material-ui/icons/Close';
import Axios from 'axios';
import { API_BASE } from '../config/index';




interface SendEmailPropsType {
    setClickEmailBtn: Dispatch<SetStateAction<boolean>>;
    clickEmailBtn: boolean;
}


export const SendEmailForm: React.FC<SendEmailPropsType> = ({ setClickEmailBtn, clickEmailBtn }) => {

    const [name, setName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [message, setMessage] = useState<string>('');

    const nameRef = useRef<HTMLInputElement>(null);
    if (nameRef && nameRef.current && clickEmailBtn) {
        console.log("버튼클릭되서 열려서 포커스 할거임")
        nameRef.current.focus();
    }
    const handleClose = () => {

        setName('');
        setEmail('');
        setMessage('');
        setClickEmailBtn(false); // 버튼 누르면 form 창 사라지고 email 아이콘 생김
    }
    const sendEmailHandler = async (e: FormEvent<HTMLButtonElement>) => {
        e.preventDefault();
        console.log('보낼 내용들', {
            name, email, message
        });
        const emailData = { name, email, message }

        const { data } = await Axios.post(`${API_BASE}/api/email`, emailData);
        console.log('메일보내고 받은 data: ', data)
        setName('');
        setEmail('');
        setMessage('');
    }

    return (
        <div className="sendEmail__form" style={{ maxWidth: "300px", maxHeight: "500px", position: "fixed", bottom: 20, right: 20, zIndex: 30 }}>
            <div>
                <div className="form__top">
                    <div className="form__header">
                        <h2>Send Message</h2>
                        <h3>Please fill out the form below and we will get back to you as soon as possible.</h3>
                    </div>
                    <CloseIcon onClick={handleClose} fontSize="large" />
                </div>
                <div className="data__form">
                    <TextField id="outlined-basic" label="Name" variant="outlined" value={name}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)} ref={nameRef} autoFocus
                    />
                    <TextField id="outlined-basic" label="Email" variant="outlined" value={email}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                    />
                    <TextField id="outlined-multiline-static"
                        value={message}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setMessage(e.target.value)}
                        label="Message"
                        multiline
                        rows={4}
                        variant="outlined" />
                    <button type="button" onClick={sendEmailHandler}>Submit</button>
                </div>
            </div>
        </div>
    )
}
