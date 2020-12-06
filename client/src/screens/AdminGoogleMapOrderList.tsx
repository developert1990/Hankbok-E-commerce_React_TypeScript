import React from 'react'
import { useLocation } from 'react-router-dom';
import { saveShippingAddressDataType } from '../actions/cartActions';

export const AdminGoogleMapOrderList = () => {
    const location = useLocation();
    const shippingAddress = location.state;
    const typedShippingAddress = shippingAddress as saveShippingAddressDataType;
    console.log('typedShippingAddress', typedShippingAddress)
    return (
        <div>
            관리자 권한 구글맵
        </div>
    )
}
