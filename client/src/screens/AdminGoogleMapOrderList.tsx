import React, { useState, useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom';
import { saveShippingAddressDataType } from '../actions/cartActions';
import { GoogleMap, InfoWindow, LoadScript, Marker } from '@react-google-maps/api';
import Axios from 'axios';
import { Libraries } from '@react-google-maps/api/dist/utils/make-load-script-url';
import { LoadingBox } from '../components/LoadingBox';
import { API_BASE } from '../config/index';

const libs: Libraries = ['places'];

export const AdminGoogleMapOrderList = () => {
    const location = useLocation();
    const shippingAddress = location.state;
    const typedShippingAddress = shippingAddress as saveShippingAddressDataType;
    console.log('typedShippingAddress', typedShippingAddress);

    const [googleApiKey, setGoogleApiKey] = useState<string>('');
    const destinationCoords = {
        lat: typedShippingAddress.lat,
        lng: typedShippingAddress.lng,
    }

    useEffect(() => {
        // 우선 googleApiKey 를 back server 에서 받아준다.
        (
            async () => {
                const { data } = await Axios.get(`${API_BASE}/api/config/google`);
                setGoogleApiKey(data);
            }
        )();
    }, []);


    const markerRef = useRef<any>();
    const onMarkerLoad = (marker: any) => {
        console.log('marker', marker)
        markerRef.current = marker;
    }
    return googleApiKey ? (

        <div className="admin_google_full_container">
            관리자 권한 구글맵
            <LoadScript libraries={libs} googleMapsApiKey={googleApiKey}>
                <GoogleMap
                    id="sample-map"
                    mapContainerStyle={{ height: '100%', width: '100%' }}
                    zoom={15}
                    center={destinationCoords}
                >
                    <Marker position={destinationCoords} onLoad={onMarkerLoad}>
                        <InfoWindow>
                            <div>{`${typedShippingAddress.address}`}</div>
                        </InfoWindow>
                    </Marker>
                </GoogleMap>
            </LoadScript>
        </div>
    ) : (
            <LoadingBox />
        )
}
