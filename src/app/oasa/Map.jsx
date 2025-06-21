'use client';

import { useEffect, useRef, useState, memo } from 'react';
import mapboxgl from 'mapbox-gl';

import 'mapbox-gl/dist/mapbox-gl.css';

const Map = ({ mapRef, routeDetailsXY, busLocations }) => {
  const mapContainerRef = useRef();
  const [mapLoaded, setMapLoaded] = useState(false);

  // mapbox initialization
  useEffect(() => {
    mapboxgl.accessToken = 'pk.eyJ1Ijoia29zdGFzcDMxIiwiYSI6ImNtYjd5YTJkYzBpam4yanA5ZnVzNmw2bmYifQ.72jFxlDSolcv-n9GRPAKQg'

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      center: [23.7266308248318, 37.977487240739535], // starting position [lng, lat]
      zoom: 11 // starting zoom
    });

    mapRef.current.on('click', (e) => {
      console.log(e)
    });

    mapRef.current.on('load', () => {
      mapRef.current.loadImage('icons/bus(1).png', function(error, image) {
        if (error) throw error;
          mapRef.current.addImage('bus-marker-image', image);
        });
      setMapLoaded(true);
    });

  }, []);

  // draw a route in the map as a line
  useEffect(() => {
    if (routeDetailsXY && !!mapLoaded) {
      const coords = [];
      routeDetailsXY.map((itm) => {
        coords.push([itm.routed_x, itm.routed_y])
      })

      if (mapRef.current.getLayer('route')) mapRef.current.removeLayer('route');
      if (mapRef.current.getSource('route')) mapRef.current.removeSource('route');
      mapRef.current.addSource('route', {
        'type': 'geojson',
        'data': {
          'type': 'Feature',
          'properties': {},
          "geometry": {
            "type": "LineString",
            "coordinates": coords
          }
        }
      });
      mapRef.current.addLayer({
        'id': 'route',
        'type': 'line',
        'source': 'route',
        'layout': {
          'line-join': 'round',
          'line-cap': 'round'
        },
        'paint': {
          'line-color': '#0000ff',
          'line-width': 8
        }
      });
    }
  }, [routeDetailsXY, mapLoaded])

  // draw points of the bus locations in the map
  useEffect(() => {
    if (busLocations && !!mapLoaded) {
      const geojson = {
        "type": "FeatureCollection",
        "features": []
      };
      busLocations.map((itm) => {
        geojson.features.push({
          "type": "Feature",
          "geometry": {
            "type": "Point",
            "coordinates": [
              Number(itm.CS_LNG),
              Number(itm.CS_LAT)
            ]
          },
          "properties": {}
        })
      })

      console.log(geojson)

      if (mapRef.current.getLayer('locations')) mapRef.current.removeLayer('locations');
      if (mapRef.current.getSource('locations')) mapRef.current.removeSource('locations');
      mapRef.current.addSource('locations', {
        'type': 'geojson',
        'generateID': true,
        'data': geojson
      });
      mapRef.current.addLayer({
        'id': 'locations',
        'type': 'symbol',
        'source': 'locations',
        'layout': {
          'icon-image': 'bus-marker-image',
          'icon-allow-overlap': false,
          'icon-ignore-placement': true,
          'symbol-z-elevate': true
        }
      });

      console.log(mapRef.current.getLayer('locations'))
    }

  }, [busLocations, mapLoaded])

  return (
    <div
      style={{ width: '100vw', height: '100vh' }}
      ref={mapContainerRef}
      className="map-container"
    />
  );
}

export default memo(Map);