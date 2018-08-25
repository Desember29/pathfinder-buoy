import React, { Component } from 'react';

import {CSVLink} from 'react-csv';

export default class Wave extends Component {
    constructor(props) {
        super(props);
        
        //Set up default values for state for initialization.
        this.state = {
            measurements: [],
        };
    }

    //Loads the data from the database and updates the state with it.
    componentWillMount() {
        fetch('/waveMeasurements').then(results => {
            return results.json();
        }).then(data => {
            this.setState({    
                measurements: data,
            });
        });
    }

    //Render function for component.
    render() {
        return (
            <CSVLink
                data={this.state.measurements}
                filename={"waveMeasurements.csv"}
            >
                Download wave measurements for analysis
            </CSVLink>
        );
    }
}