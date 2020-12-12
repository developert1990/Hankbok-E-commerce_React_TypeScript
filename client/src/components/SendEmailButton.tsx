import React, { Dispatch, SetStateAction } from 'react';

interface SendEmailbuttonPropType {
    setClickEmailBtn: Dispatch<SetStateAction<boolean>>;
}

export const SendEmailButton: React.FC<SendEmailbuttonPropType> = ({ setClickEmailBtn }) => {

    const emailBtnHandler = () => {
        setClickEmailBtn(true); // 버튼 누르면 email 아이콘 없어짐
    }
    return (
        <div onClick={emailBtnHandler} className="email__button" style={{ maxWidth: "50px", cursor: "pointer", position: "fixed", bottom: 20, right: 20, zIndex: 30 }} >
            <img src="/images/icons/email_logo.png" alt="emailLogo" style={{ width: "50px", }} />
        </div>
    )
}

