'use client';
import { memo, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const Overlay = ({ allLineData, selectedLineCode, setSelectedLineCode, selectedRouteCode, setSelectedRouteCode, setRouteDetailsXY, setBusLocations }) => {
  const [routeData, setRouteData] = useState(null);
  const [loadingRoutes, setLoadingRoutes] = useState(false);

  const getRoutesForLine = async (line) => {
    const resp = await axios.get(`/api/oasa`, {
      params: {
        act: 'getRoutesForLine',
        p1: line
      }
    });

    if (resp) {
      setRouteData(resp.data);
    }
    setLoadingRoutes(false);
  };

  const getRouteXY = async (routecode) => {
    const resp = await axios.get(`/api/oasa`, {
      params: {
        act: 'webRouteDetails',
        p1: routecode
      }
    });

    if (resp) {
      setRouteDetailsXY(resp.data);
    }
  };

  const getRouteBusLocations = async (routecode) => {
    const resp = await axios.get(`/api/oasa`, {
      params: {
        act: 'getBusLocation',
        p1: routecode
      }
    });

    if (resp) {
      setBusLocations(resp.data);
      if (!resp.data) {
        toast.error('No active buses on this route', {
          duration: 4000,
          position: 'top-center',
        })
      }
    }
  };

  return (
    <>
      <div style={{ position: "absolute", left: '30px', bottom: '60px', backgroundColor: 'rgba(255, 255, 255, 0.7)', borderRadius: '10px', padding: '20px', minWidth: '300px', color: '#000000' }}>
        <h5>Select line</h5>
        <select value={selectedLineCode} onChange={(e) => {
          setSelectedLineCode(e.target.value);
          if (e.target.value !== '') {
            setLoadingRoutes(true);
            getRoutesForLine(e.target.value);
          }
        }} style={{ width: "250px" }}>
          <option value="">Not selected</option>
          {allLineData.map((line) => {
            return <option key={line.LineCode} value={line.LineCode}>{line?.LineID} {line?.LineDescr}</option>
          })}
        </select>


        {!!routeData && loadingRoutes &&
          <div>
            <img src='icons/infinite-spinner.svg' width={32} height={32} />
          </div>
        }


        {!!routeData && !loadingRoutes &&
          <>
            <h5>Select route</h5>
            <select value={selectedRouteCode} onChange={(e) => { setSelectedRouteCode(e.target.value); if (e.target.value !== '') { getRouteXY(e.target.value); getRouteBusLocations(e.target.value); } }} style={{ width: "250px" }}>
              <option value="">Not selected</option>
              {routeData.map((routeD) => {
                return <option key={routeD.route_id} value={routeD.route_code}>{routeD?.route_descr}</option>
              })}
            </select>
          </>
        }
      </div>
    </>
  )
}

export default memo(Overlay);