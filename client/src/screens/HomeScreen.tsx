import React from 'react';
import { MainCarousel } from '../components/MainCarousel';
import { IntroHanbok } from '../components/IntroHanbok';

export const HomeScreen = () => {
    return (
        <div className="homeScreen">
            <MainCarousel />
            <IntroHanbok />
        </div>
    )
}