import * as React from 'react';
import Map from 'react-map-gl';

function PruebaMap() {
  return <Map
    initialViewState={{
      longitude: -99.3609683,
      latitude: 19.517983,
      zoom: 10
    }}
    style={{width: '50vw', height: '50vh'}}
    mapStyle="mapbox://styles/mapbox/dark-v9"
    mapboxAccessToken="pk.eyJ1IjoiYW5nZWwwMTI5MTIiLCJhIjoiY2wzOWpqampiMGFqdzNqbzUyN3VkbThoNSJ9.-Geofb50Jj2CZcZoYkMM4g"
  />;
}

export default PruebaMap;