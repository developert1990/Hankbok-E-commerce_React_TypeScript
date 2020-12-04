import React, { ChangeEvent, FormEvent, useState } from 'react'
import { Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { saveShippingAddress } from '../actions/cartActions';
import { initialAppStateType } from '../store';

export const ShippingAddressScreen = () => {
    const userSignin = useSelector((state: initialAppStateType) => state.userStore);
    const dispatch = useDispatch();
    const history = useHistory();
    const { userInfo } = userSignin;
    const cart = useSelector((state: initialAppStateType) => state.cartStore);
    const { shippingAddress } = cart
    if (!userInfo) {
        // 만약 로그아웃 한 상태에서 /shipping 을 했을 경우에 signin화면으로 돌아가게함
        history.push('/signin');
    }
    const [fullName, setFullName] = useState<string>(shippingAddress?.fullName as string);
    const [address, setAddress] = useState<string>(shippingAddress?.address as string);
    const [city, setCity] = useState<string>(shippingAddress?.city as string);
    const [postalCode, setPostalCode] = useState<string>(shippingAddress?.postalCode as string)
    const [country, setCountry] = useState<string>(shippingAddress?.country as string)


    const submitHandler = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        dispatch(saveShippingAddress({ fullName, address, city, postalCode, country }));
        history.push('/payment');
    }
    const step = {
        step1: true, step2: true, step3: false, step4: false
    }

    const openMapHandler = () => {
        history.push('/googleMap');
    }

    return (
        <div className="shippingAddressScreen">
            <form className="form" onSubmit={submitHandler}>
                <div className="form__title">
                    <h1>Shipping Address</h1>
                </div>
                <div className="form__base">
                    <input className="shipping__form__input" type="text" id="fullName" placeholder="Enter full name" value={fullName} onChange={(e: ChangeEvent<HTMLInputElement>) => setFullName(e.target.value)} required />
                    <input className="shipping__form__input" type="text" id="address" placeholder="Enter address" value={address} onChange={(e: ChangeEvent<HTMLInputElement>) => setAddress(e.target.value)} required />
                    <input className="shipping__form__input" type="text" id="city" placeholder="Enter city" value={city} onChange={(e: ChangeEvent<HTMLInputElement>) => setCity(e.target.value)} required />
                    <input className="shipping__form__input" type="text" id="postalCode" placeholder="Enter postalCode" value={postalCode} onChange={(e: ChangeEvent<HTMLInputElement>) => setPostalCode(e.target.value)} required />
                    <input className="shipping__form__input" type="text" id="country" placeholder="Enter country" value={country} onChange={(e: ChangeEvent<HTMLInputElement>) => setCountry(e.target.value)} required />
                </div>
                <div>
                    <button onClick={openMapHandler}>Choose on map</button>
                    <label>
                        <Button variant="danger" type="submit">Continue</Button>
                    </label>
                </div>
            </form>
        </div>
    )
}
