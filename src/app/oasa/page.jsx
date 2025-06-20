'use client';

import axios from "axios";
import { useState, useEffect, useRef } from "react";

import Map from "./Map";

const Test = () => {
  const mapContainerRef = useRef();
  const [data, setData] = useState(null);

  const getStops = async () => {

    let resp = await axios.get(`/api/oasa`, {
      params: {
        act: 'webGetLinesWithMLInfo',
        // p1: '962'
      }
    });

    if (resp) setData(resp.data);

    console.log('resp=', resp);
  };

  useEffect(() => {
    getStops();
  }, []);

  if (!data) return;

  return (
    <>
      {/* {data.map((item) => {
        return (
          <div key={item?.StopID}>
            {item?.StopID}
          </div>
        )
      })} */}
      <Map mapRef={mapContainerRef} />
    </>
  )
}

export default Test;