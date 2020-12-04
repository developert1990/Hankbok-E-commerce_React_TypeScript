
import React, { useEffect, useRef, useState } from 'react';
import { LoadingBox } from '../components/LoadingBox';
import { GoogleMap, LoadScript, Marker, StandaloneSearchBox } from '@react-google-maps/api';
import { Libraries } from '@react-google-maps/api/dist/utils/make-load-script-url';

import axios from 'axios';
import { useDispatch } from 'react-redux';
import { USER_ADDRESS_MAP_CONFIRM } from '../constants/userConstant';
import { Button } from 'react-bootstrap';

interface centerLocationType {
    lat: number;
    lng: number;
}

const libs: Libraries = ['places'];

const defaultLocation: centerLocationType = { lat: 45.516, lng: -73.56 };

export const MapScreen = () => {


    const [googleApiKey, setGoogleApiKey] = useState<string>('');
    const [center, setCenter] = useState<centerLocationType>(defaultLocation); // googleMap 에 적용시켜 주기 위한 것
    const [location, setLocation] = useState(center); // marker에 적용시켜주기 위한 것 

    const mapRef = useRef<any>();
    const placeRef = useRef<any>();
    const markerRef = useRef<any>();

    const dispatch = useDispatch();

    const onLoad = (map: any) => {
        mapRef.current = map;
    }


    const onMarkerLoad = (marker: any) => {
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

    const onPlacesChanged = () => {
        const place = placeRef.current?.getPlaces()[0].geometry.location;
        setCenter({ lat: place.lat(), lng: place.lng() });
        setLocation({ lat: place.lat(), lng: place.lng() });
    }

    const onConfirm = () => {
        const places = placeRef.current.getPlaces();
        console.log('places', places)
        if (places && places.length === 1) {

            dispatch({
                type: USER_ADDRESS_MAP_CONFIRM,
                payload: {
                    lat: location.lat,
                    lng: location.lng,
                    address: places[0].formatted_address,
                    name: places[0].name,
                    vicinity: places[0].vicinity,
                    googleAddressId: places[0].id,
                }
            })

            alert('location selected successfully')
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

    return googleApiKey ? (
        <div className="full-container">
            <LoadScript libraries={libs} googleMapsApiKey={googleApiKey}>
                <GoogleMap
                    id="sample-map"
                    mapContainerStyle={{ height: '100%', width: '100%' }}
                    center={center}
                    zoom={15}
                    // onLoad={map => {
                    //     const bounds = new window.google.maps.LatLngBounds();
                    //     map.fitBounds(bounds);
                    // }}
                    onLoad={onLoad}
                    onIdle={onIdle}>
                    <StandaloneSearchBox
                        onLoad={onLoadPlaces}
                        onPlacesChanged={onPlacesChanged}
                    >
                        <div>
                            <input
                                type="text"
                                placeholder="Customized your placeholder"
                                style={{
                                    boxSizing: `border-box`,
                                    border: `1px solid transparent`,
                                    width: `240px`,
                                    height: `32px`,
                                    padding: `0 12px`,
                                    borderRadius: `3px`,
                                    boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
                                    fontSize: `14px`,
                                    outline: `none`,
                                    textOverflow: `ellipses`,
                                    position: "absolute",
                                    left: "50%",
                                    marginLeft: "-120px"
                                }}
                            />
                            <Button style={{
                                boxSizing: `border-box`,
                                border: `1px solid transparent`,
                                width: `240px`,
                                height: `32px`,
                                padding: `0 12px`,
                                borderRadius: `3px`,
                                boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
                                fontSize: `14px`,
                                outline: `none`,
                                textOverflow: `ellipses`,
                                position: "absolute",
                                right: "20%",
                                marginLeft: "-120px"
                            }} type="button" className="primary" onClick={onConfirm}>Confirm</Button>
                        </div>
                    </StandaloneSearchBox>
                    <Marker position={location} onLoad={onMarkerLoad} />
                </GoogleMap>
            </LoadScript>
        </div>
    ) :
        <LoadingBox />
}
