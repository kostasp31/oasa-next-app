'use client';

import axios from "axios";
import { useState, useEffect, useRef, memo } from "react";

import Map from "./Map";
import Overlay from "./Overlay";
import Layers from "./Layers";
import { Toaster } from 'react-hot-toast';

const Test = () => {
  const mapRef = useRef();
  const [allLineData, setAllLineData] = useState(null);
  const [selectedLineCode, setSelectedLinecode] = useState('');
  const [selectedRouteCode, setSelectedRouteCode] = useState('');
  const [routeDetailsXY, setRouteDetailsXY] = useState(null);
  const [busLocations, setBusLocations] = useState(null);

  const [layersOpen, setLayersOpen] = useState(false);

  // first step: get all line data (linecodes, lineIDs, lineDescriptions)
  const getAllLines = async () => {
    const resp = await axios.get(`/api/oasa`, {
      params: {
        act: 'webGetLines'
      }
    });

    if (resp) {
      setAllLineData(resp.data);
    }
    console.log('resp=', resp);
  };

  useEffect(() => {
    getAllLines();
  }, []);

  if (!allLineData) return;

  return (
    <>
      <Map mapRef={mapRef} routeDetailsXY={routeDetailsXY} setRouteDetailsXY={setRouteDetailsXY} busLocations={busLocations}  layersOpen={layersOpen} setLayersOpen={setLayersOpen} />
      <Overlay allLineData={allLineData} selectedLineCode={selectedLineCode} setSelectedLineCode={setSelectedLinecode} selectedRouteCode={selectedRouteCode} setSelectedRouteCode={setSelectedRouteCode} setRouteDetailsXY={setRouteDetailsXY} setBusLocations={setBusLocations} layersOpen={layersOpen} setLayersOpen={setLayersOpen} />
      {layersOpen && <Layers mapRef={mapRef} />}
      <Toaster />
    </>
  )
}

export default memo(Test);