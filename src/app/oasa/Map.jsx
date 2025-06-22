'use client';

import { useEffect, useRef, useState, memo } from 'react';
import mapboxgl from 'mapbox-gl';

import 'mapbox-gl/dist/mapbox-gl.css';
import toast from 'react-hot-toast';

// TODO: add map controls (and home button)
// TODO: add nitifications 
const Map = ({ mapRef, routeDetailsXY, busLocations }) => {
  const mapContainerRef = useRef();
  const [mapLoaded, setMapLoaded] = useState(false);

  // mapbox initialization
  useEffect(() => {
    mapboxgl.accessToken = 'pk.eyJ1Ijoia29zdGFzcDMxIiwiYSI6ImNtYjd5YTJkYzBpam4yanA5ZnVzNmw2bmYifQ.72jFxlDSolcv-n9GRPAKQg'

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      center: [23.7266308248318, 37.977487240739535],
      zoom: 11
    });

    mapRef.current.on('click', (e) => {
      console.log(e)
    });

    //TODO: check why map loads 2 times?
    mapRef.current.on('load', () => {
      if (!mapLoaded) {
        mapRef.current.loadImage('icons/bus(1).png', function(error, image) {
          if (error) throw error;
            mapRef.current.addImage('bus-marker-image', image);
          });
        setMapLoaded(true);
        
        // toast('Hello World', {
        //   duration: 4000,
        //   position: 'top-center',

        //   // Styling
        //   style: {},
        //   className: '',

        //   // Custom Icon
        //   icon: '👏',

        //   // Change colors of success/error/loading icon
        //   iconTheme: {
        //     primary: '#000',
        //     secondary: '#fff',
        //   },

        //   // Aria
        //   ariaProps: {
        //     role: 'status',
        //     'aria-live': 'polite',
        //   },

        //   // Additional Configuration
        //   removeDelay: 1000,
        // });

      }
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
    if (!!mapLoaded && mapRef.current.getLayer('locations')) mapRef.current.removeLayer('locations');
    if (!!mapLoaded && mapRef.current.getSource('locations')) mapRef.current.removeSource('locations');
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