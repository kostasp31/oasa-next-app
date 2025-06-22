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
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/standard?optimize=true',
      center: [23.7266308248318, 37.977487240739535],
      zoom: 11
    });

    mapRef.current.on('click', (e) => {
      console.log(e)
    });

    mapRef.current.addControl(new mapboxgl.FullscreenControl({container: document.querySelector('body')}), 'top-right');
    mapRef.current.addControl(new mapboxgl.ScaleControl({
      maxWidth: 100,
      unit: 'imperial'
    }), 'bottom-right');
    mapRef.current.addControl(new mapboxgl.NavigationControl(), 'bottom-right');

    class HomeControl {
      onAdd(map) {
        this._map = map;
        this._container = document.createElement('div');
        this._container.className = 'mapboxgl-ctrl mapboxgl-ctrl-group custom-map-control';
        this._container.style.cursor = 'pointer';

        const button = document.createElement('button');
        button.title = 'Original map view';

        button.onclick = () => {
          mapRef.current.flyTo({
            center: [23.7266308248318, 37.977487240739535],
            zoom: 11
          });
        };
        
        const image = document.createElement('img');
        image.src = 'icons/home.svg';
        image.style.fontWeight = 900;
        image.style.color = '#404040',
        image.style.fontSize = '20px';
        image.style.marginTop = '3px';
        button.appendChild(image);

        this._container.appendChild(button);
        return this._container;
      }

      onRemove() {
        this._container.parentNode.removeChild(this._container);
        this._map = undefined;
      }
    }
    mapRef.current.addControl(new HomeControl(), 'bottom-right');

    class FocusToRouteControl {
      onAdd(map) {
        this._map = map;
        this._container = document.createElement('div');
        this._container.className = 'mapboxgl-ctrl mapboxgl-ctrl-group custom-map-control';
        this._container.style.cursor = 'pointer';

        const button = document.createElement('button');
        button.title = 'Focus to route';

        button.onclick = () => {};
        
        const image = document.createElement('img');
        image.src = 'icons/route.svg';
        image.style.fontWeight = 900;
        image.style.color = '#404040',
        image.style.fontSize = '20px';
        image.style.marginTop = '3px';
        button.appendChild(image);

        this._container.appendChild(button);
        return this._container;
      }

      onRemove() {
        this._container.parentNode.removeChild(this._container);
        this._map = undefined;
      }
    }
    mapRef.current.addControl(new FocusToRouteControl(), 'bottom-right');


    // TODO: add control to change style: https://docs.mapbox.com/api/maps/styles/

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