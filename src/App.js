import React, { Component } from 'react';
import './App.css';
import './yelpApi.js';

class Location {
  constructor(locationApiService, zipcode = null, addressStr = null) {
    this.locationApiService = locationApiService;
    this.zipcode = zipcode;
    this.addressStr = addressStr;

    if (this.zipCode === null && this.addressStr === null) {
      throw new Error("Cannot initialize without address or zipcode.");
    }

    if (this.zipcode) {
      let result = locationApiService.getLatLongByZipCode (zipcode);
      this.latitude = result.latitude;
      this.longitude = result.longitude;
    }

    if (this.addressStr) {
      let result = locationApiService.getLatLongByAddressStr (addressStr);
      this.latitude = result.latitude;
      this.longitude = result.longitude;
    }
  }

  getLatitude() {
    return this.latitude;
  }

  getLongitude() {
    return this.longitude;
  }


}

class App extends Component {
  render() {
    return (
      <div className="App">
        <p>This is a working space.</p>
      </div>
    );
  }
}


const latitude = "34.1001003";
const longitude = "-118.2585095";
const location = new Location(googleMapsApiService, '90039');
const restaurantRequester = new yelpApi(location);
restaurantRequester.getAll("dinner");


export default App;
