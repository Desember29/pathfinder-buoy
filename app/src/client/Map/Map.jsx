import React, { Component } from 'react';

import { withScriptjs, withGoogleMap, GoogleMap, Polyline } from "react-google-maps";

//Custom component for BuoyMarker for use in the Google maps component
import BuoyMarker from './BuoyMarker';

//Custom styles for the Google Maps API, for removing unwanted markers and labels.
const mapStyle = require('./mapStyles.json');

export default class Map extends Component {
    constructor(props) {
        super(props);
        
        //Set up default values for state for initialization.
        this.state = {
            googleMapsAPIURL: "https://maps.googleapis.com/maps/api/js?key=AIzaSyB_wZhsVrHCrZ34UlvGUrW0RKGwNNd5zlM",
            currentPosition: {"lat": 63.446827, "lng": 10.421906},
            zoom: 13,
            measurements: [],
            showAllPositionMarkers: false,
            showPathLine: false,
            dashedLine: false,
        };
    }

    //Loads the data from the database and updates the state with it.
    componentWillMount() {
        fetch('/pointMeasurements').then(results => {
            return results.json();
        }).then(data => {
            this.setState({
                currentPosition: data[data.length-1],
                measurements: data,
            });
        });
    }

    //Function to center on buoys last known position.
    recenter() {
        this.setState({
            currentPosition: this.state.measurements[this.state.measurements.length-1],
        });
    }

    //Function to toggle rendering of all previous position markers or only have a marker for current position.
    previousPositionMarkersToggler() {
        this.setState({
            showAllPositionMarkers: !this.state.showAllPositionMarkers,
        });
    }

    //Function to toggle path line.
    pathLineToggler() {
        this.setState({
            showPathLine: !this.state.showPathLine,
        });
    }

    //Function to change dashed flag.
    dashedLineToggler() {
        this.setState({
            dashedLine: !this.state.dashedLine,
        });
    }

    //Function to create dashed line symbol.
    createDashedLine() {
        let lineSymbol = {
            path: 'M 0,-1 0,1',
            strokeColor:'#FF0000',
            strokeOpacity: 1,
            scale: 3,
        };
        return lineSymbol;
    }

    //Function to create the map marker(s).
    createMapMarkers() {
        if (this.state.showAllPositionMarkers) {
            return (
                this.state.measurements.map(measurement => (
                    <BuoyMarker
                        key={measurement.date}
                        date={measurement.date}
                        lat={measurement.lat}
                        lng={measurement.lng}
                        temperature={measurement.temperature}
                        turbidity={measurement.turbidity}
                        battery={measurement.battery}
                    />
                ))
            );
        }
        else {
            let measurement = this.state.currentPosition;
            return (
                <BuoyMarker
                    key={measurement.date}
                    date={measurement.date}
                    lat={measurement.lat}
                    lng={measurement.lng}
                    temperature={measurement.temperature}
                    turbidity={measurement.turbidity}
                    battery={measurement.battery}
                />
            );
        }
    }

    //Function to create the polyline elements.
    createPolyline() {
        //If statement for whether or not it should be a dashed line or a solid connected line.
        if (this.state.dashedLine) {
            const lineSymbol = this.createDashedLine();
            return (
                <Polyline
                    path={this.state.measurements}
                    options={{
                        strokeOpacity: 0,
                        icons: [{
                            icon: lineSymbol,
                            offset: '0',
                            repeat: '25px',
                        }]
                    }}
                />
            );
        }
        //Render solid connected line.
        else {
            return (
                <Polyline
                    path={this.state.measurements}
                    options={{
                        strokeOpacity: 1,
                        strokeColor:"#ff0000",
                    }}
                />
            );
        }
    }

    //Initializes the map with it's parameters, then returns a render with the map.
    initializeMap() {
        //Initialize map component.
        const Map = withScriptjs(withGoogleMap((props) =>
            <GoogleMap
                center={this.state.currentPosition}
                zoom={this.state.zoom}
                options={{
                    streetViewControl:false,
                    styles: mapStyle
                }}
            >
                {this.createMapMarkers()}
                {this.state.showPathLine &&
                    this.createPolyline()
                }
            </GoogleMap>
        ));
        //Render map component.
        return (
            <Map
                googleMapURL={this.state.googleMapsAPIURL}
                loadingElement={<div style={{ height: `100%` }} />}
                containerElement={<div style={{ height: `800px` }} />}
                mapElement={<div style={{ height: `100%` }} />}
            />
        );
    }

    //Render function for Map component.
    render() {
        return (
            <div className="map">
                <button onClick={() => this.recenter()}>Recenter on Buoy</button>
                <button onClick={() => this.previousPositionMarkersToggler()}>Toggle previous position markers</button>
                <button onClick={() => this.pathLineToggler()}>Show path line</button>
                {this.state.showPathLine &&
                    <button onClick={() => this.dashedLineToggler()}>Dashed Toggler</button>
                }
                {this.initializeMap()}
            </div>
        );
    }
}