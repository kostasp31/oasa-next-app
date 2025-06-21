'use client';

import axios from "axios";
import { useState, useEffect, useRef, memo } from "react";

import Map from "./Map";
import Overlay from "./Overlay";

const Test = () => {
  const mapContainerRef = useRef();
  const [allLineData, setAllLineData] = useState(null);
  const [selectedLineCode, setSelectedLinecode] = useState('');
  const [selectedRouteCode, setSelectedRouteCode] = useState('');
  const [routeDetailsXY, setRouteDetailsXY] = useState(null);
  const [busLocations, setBusLocations] = useState(null);

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
      <Map mapRef={mapContainerRef} routeDetailsXY={routeDetailsXY} setRouteDetailsXY={setRouteDetailsXY} busLocations={busLocations} />
      <Overlay allLineData={allLineData} selectedLineCode={selectedLineCode} setSelectedLineCode={setSelectedLinecode} selectedRouteCode={selectedRouteCode} setSelectedRouteCode={setSelectedRouteCode} setRouteDetailsXY={setRouteDetailsXY} setBusLocations={setBusLocations} />
    </>
  )
}

export default memo(Test);