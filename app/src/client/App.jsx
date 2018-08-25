import React, { Component } from 'react';

import Map from './Map/Map';
import Wave from './Wave/Wave';

export default class App extends Component {
    render() {
        return (
            <div>
                <Map />
                <Wave />
            </div>
        );
    }
}