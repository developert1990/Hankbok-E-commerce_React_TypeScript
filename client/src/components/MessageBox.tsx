import React from 'react';

interface MessageBoxProps {
    variant: string;
    children?: React.ReactNode;
}

export const MessageBox: React.FC<MessageBoxProps> = ({ variant, children }) => {

    return (
        <div className={`alert alert-${variant} || 'info'`}>
            {children}
        </div>
    )
}
