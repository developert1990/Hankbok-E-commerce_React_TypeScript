import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import { Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { saveShippingAddress } from '../actions/cartActions';
import { initialAppStateType } from '../store';
import RoomIcon from '@material-ui/icons/Room';

export const ShippingAddressScreen = () => {
    const userSignin = useSelector((state: initialAppStateType) => state.userStore);
    const dispatch = useDispatch();
    const history = useHistory();
    const { userInfo } = userSignin;
    const cart = useSelector((state: initialAppStateType) => state.cartStore);
    const { shippingAddress } = cart

    const googleMapAddress = useSelector((state: initialAppStateType) => state.addressGoogleMapStore);

    console.log('googleMapAddress', googleMapAddress.address)


    if (!userInfo) {
        // 만약 로그아웃 한 상태에서 /shipping 을 했을 경우에 signin화면으로 돌아가게함
        history.push('/signin');
    }
    const [fullName, setFullName] = useState<string>(shippingAddress?.fullName as string);
    const [address, setAddress] = useState<string>(shippingAddress?.address as string);
    const [city, setCity] = useState<string>(shippingAddress?.city as string);
    const [postalCode, setPostalCode] = useState<string>(shippingAddress?.postalCode as string)
    const [country, setCountry] = useState<string>(shippingAddress?.country as string)
    const [lat, setLat] = useState<number>(0);
    const [lng, setLng] = useState<number>(0);

    useEffect(() => {
        if (googleMapAddress.address.lat !== 0 && googleMapAddress.address.lng !== 0) {
            setAddress(googleMapAddress.address.streetNum + " " + googleMapAddress.address.route || "");
            setCity(googleMapAddress.address.city || "");
            setPostalCode(googleMapAddress.address.postalCode || "");
            setCountry(googleMapAddress.address.country || "");
        }
    }, [googleMapAddress.address])

    const submitHandler = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        console.log('submit 눌렀을때: ', googleMapAddress)

        const newLat = googleMapAddress ? googleMapAddress.address.lat : lat;
        const newLng = googleMapAddress ? googleMapAddress.address.lng : lng;
        if (googleMapAddress.address.lat !== 0 && googleMapAddress.address.lng !== 0) {
            setLat(googleMapAddress.address.lat);
            setLng(googleMapAddress.address.lng);
        }

        let moveOn = true;

        if (!newLat || !newLng) {
            moveOn = window.confirm('You did not set your location on map. Continue?')
        }

        if (moveOn) {
            dispatch(saveShippingAddress({ fullName, address, city, postalCode, country, lat: newLat, lng: newLng }));
            history.push('/payment');
        }
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
                <div className="button">
                    <Button variant="primary" onClick={openMapHandler}><RoomIcon /> Google Map</Button>

                    <Button variant="danger" type="submit">Continue</Button>

                </div>
            </form>
        </div>
    )
}
