/* eslint-disable array-callback-return */

import React, { useEffect, useRef, useState } from 'react';
import { LoadingBox } from '../components/LoadingBox';
import { GoogleMap, InfoWindow, LoadScript, Marker, StandaloneSearchBox } from '@react-google-maps/api';
import { Libraries } from '@react-google-maps/api/dist/utils/make-load-script-url';
import Geocode from 'react-geocode'

import axios from 'axios';
import { useDispatch } from 'react-redux';
import { USER_ADDRESS_MAP_CONFIRM } from '../constants/userConstant';
import { Button } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';

interface centerLocationType {
    lat: number;
    lng: number;
}

interface addressObjType {
    streetNum: string;
    route: string;
    city: string;
    province: string;
    country: string;
    postalCode: string;
    lat: string;
    lng: string;
}

const libs: Libraries = ['places'];

const defaultLocation: centerLocationType = { lat: 45.516, lng: -73.56 };



export const MapScreen = () => {


    const [googleApiKey, setGoogleApiKey] = useState<string>('');
    const [center, setCenter] = useState<centerLocationType>(defaultLocation); // googleMap 에 적용시켜 주기 위한 것
    const [location, setLocation] = useState(center); // marker에 적용시켜주기 위한 것 

    const [fullAddress, setFullAddress] = useState('');
    const [addressObj, setAddressObj] = useState<addressObjType>({
        streetNum: '', route: '', city: '', province: '', country: '', postalCode: '', lat: '', lng: ''
    });


    Geocode.setApiKey(googleApiKey);

    const mapRef = useRef<any>();
    const placeRef = useRef<any>();
    const markerRef = useRef<any>();

    const dispatch = useDispatch();
    const history = useHistory();

    const onLoad = (map: any) => {
        mapRef.current = map;
    }


    const onMarkerLoad = (marker: any) => {
        console.log('marker', marker)
        markerRef.current = marker;
    }
    const onLoadPlaces = (place: any) => {
        placeRef.current = place;
    }
    const onIdle = () => {
        setLocation({
            lat: mapRef.current.center.lat(),
            lng: mapRef.current.center.lng(),
        })
    };

    // 써치 박스 통해서 주소찾기
    const onPlacesChanged = () => {
        // 써치 하는곳에서 그냥 글자만 치면 에러 alert가 뜨기때문에 자동완성기능에서 클릭을 해야한다.
        if (placeRef.current.getPlaces().length !== 0) {
            const place = placeRef.current?.getPlaces()[0].geometry.location;
            let newLat = place.lat() as string;
            let newLng = place.lng() as string;

            Geocode.fromLatLng(newLat, newLng).then(response => {
                console.log('response', response);
                const address = response.results[0].formatted_address;
                const addressArray = response.results[0].address_components;
                const addressResult = getAddressDetail(addressArray);
                setFullAddress(address);
                const addressFromMarker = {
                    ...addressResult,
                    lat: newLat as string,
                    lng: newLng as string,
                }
                setAddressObj(addressFromMarker as addressObjType);
            })

            setCenter({ lat: place.lat(), lng: place.lng() });
            setLocation({ lat: place.lat(), lng: place.lng() });
        } else {
            alert('Please select the place below.');
        }

    }















    const onConfirm = () => {
        console.log('addressObj', addressObj)
        if (addressObj.lat !== "" && addressObj.lng !== "") {
            console.log('addressObj.route', addressObj.route)
            console.log('addressObj.route', addressObj.streetNum)
            dispatch({
                type: USER_ADDRESS_MAP_CONFIRM,
                payload: {
                    lat: Number(addressObj.lat),
                    lng: Number(addressObj.lng),
                    address: fullAddress,
                    streetNum: addressObj.streetNum,
                    route: addressObj.route,
                    city: addressObj.city,
                    province: addressObj.province,
                    country: addressObj.country,
                    postalCode: addressObj.postalCode,
                }
            })

            alert('location selected successfully');
            history.push('/shipping');
        } else {
            alert('Please enter your address')
        }
    };

    const getUserCurrentLocation = () => {
        if (!navigator.geolocation) {
            alert('Geolocation os not supported by this brower');
        } else {
            navigator.geolocation.getCurrentPosition((position) => {
                setCenter({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                });
                setLocation({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                })
            })
        }
    }


    useEffect(() => {
        // 우선 googleApiKey 를 back server 에서 받아준다.
        (
            async () => {
                const { data } = await axios.get('/api/config/google');
                setGoogleApiKey(data);
                getUserCurrentLocation();
            }
        )();
    }, []);




    interface addressArrayDataType {
        long_name: string;
        short_name: string;
        types: string[];
    }


    const getAddressDetail = (addressArray: addressArrayDataType[]) => {
        if (addressArray) {
            const addressState = { streetNum: '', route: '', city: '', province: '', country: '', postalCode: '' };
            addressArray.map((data) => {
                switch (data.types[0]) {
                    case "street_number": // 303
                        return addressState.streetNum = data.long_name;
                    case "route":   // 57ave sw
                        return addressState.route = data.long_name;
                    case "locality":
                        return addressState.city = data.long_name;
                    case "administrative_area_level_1":
                        return addressState.province = data.long_name;
                    case "country":
                        return addressState.country = data.long_name;
                    case "postal_code":
                        return addressState.postalCode = data.long_name;
                    default:
                        return;
                }
            });
            return addressState;

        } else {
            return null;
        }
    }



    // 마크를 이동해서 주소 찾기
    const onMarkerDragEnd = (e: google.maps.MouseEvent) => {
        let newLat = e.latLng.lat().toString();
        let newLng = e.latLng.lng().toString();
        // 이 두가지 newLat과 newLng 를 사용해서 address, city 등을 알아내기 위해서 react-geocode를 사용한다.

        Geocode.fromLatLng(newLat, newLng).then(response => {
            // console.log('response', response);
            const address = response.results[0].formatted_address;
            const addressArray = response.results[0].address_components;
            const addressResult = getAddressDetail(addressArray);
            setFullAddress(address);
            const addressFromMarker = {
                ...addressResult,
                lat: newLat as string,
                lng: newLng as string,
            }
            setAddressObj(addressFromMarker as addressObjType);
        })

    }



    return googleApiKey ? (
        <div className="full-container">
            <LoadScript libraries={libs} googleMapsApiKey={googleApiKey}>
                <GoogleMap
                    id="sample-map"
                    mapContainerStyle={{ height: '100%', width: '100%' }}
                    center={center}
                    zoom={15}
                    onLoad={onLoad}
                    onIdle={onIdle}>

                    <StandaloneSearchBox
                        onLoad={onLoadPlaces}
                        onPlacesChanged={onPlacesChanged}
                    >
                        <div className="search__container">
                            <input
                                className="map__input"
                                type="text"
                                placeholder="Search location"

                            />
                            <Button
                                className="map__confirmButton"
                                type="button" variant="success" onClick={onConfirm}>Confirm</Button>
                        </div>
                    </StandaloneSearchBox>

                    <Marker position={location} onLoad={onMarkerLoad} draggable={true} onDragEnd={onMarkerDragEnd}>
                        <InfoWindow >
                            <div>{`${fullAddress}`}</div>
                        </InfoWindow>
                    </Marker>
                </GoogleMap>
            </LoadScript>
        </div>
    ) :
        <LoadingBox />
}
