import React, { Component } from 'react';

import { Marker, InfoWindow } from "react-google-maps";

export default class BuoyMarker extends Component {
    constructor(props) {
        super(props);

        this.state = {
            open: false,
            date: this.props.date,
            lat: this.props.lat,
            lng: this.props.lng,
            temperature: this.props.temperature,
            turbidity: this.props.turbidity,
            battery: this.props.battery,
        };
    }

    //Function to set whether or not the InfoWindow will be open or closed.
    toggleOpen() {
        this.setState({
            open: !this.state.open,
        });
    }

    //BuoyMarker render function loading data.
    render() {
        return (
            <Marker
                key={this.state.date}
                position={{ lat: this.state.lat, lng: this.state.lng }}
                onClick={() => this.toggleOpen()}
            >
                {this.state.open &&
                    <InfoWindow
                        onCloseClick={(() => this.toggleOpen())}
                    >
                        <div>
                            <div>
                                Time of measurement: {new Date(this.state.date).toUTCString()}
                            </div>
                            <div>
                                Temperature: {this.state.temperature}&deg;C
                            </div>
                            <div>
                                Turbidity: {this.state.turbidity}
                            </div>
                            <div>
                                Battery level: {this.state.battery}%
                            </div>
                        </div>
                    </InfoWindow>
                }
            </Marker>
        );
    }
}