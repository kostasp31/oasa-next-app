"use-client";

const Layers = ({ mapRef }) => {
  return (
    <div style={{position: "absolute", top: '10px', left: '100px', height:'80px', maxWidth: '350px', background: 'rgba(255, 255, 255, 0.8)', borderRadius: '4px', display:'flex', padding: '5px 10px', gap: '10px'}}>
      <div style={{display:"flex", flexDirection: "column", justifyContent: "center", cursor: "pointer"}} onClick={() => mapRef.current.setStyle("mapbox://styles/mapbox/standard?optimize=true")}>
        <div style={{alignSelf: "center"}}>
            <img width="42px" height="42px" src="street-view.png" />
        </div>
        <div style={{fontSize: '0.8em', alignSelf: "center"}}>
            Street
        </div>
      </div>

      <div style={{display:"flex", flexDirection: "column", justifyContent: "center", cursor: "pointer"}} onClick={() => mapRef.current.setStyle("mapbox://styles/mapbox/satellite-streets-v12?optimize=true")}>
        <div style={{alignSelf: "center"}}>
            <img width="42px" height="42px" src="street-view.png" />
        </div>
        <div style={{fontSize: '0.8em', alignSelf: "center"}}>
            Satelite
        </div>
      </div>

      <div style={{display:"flex", flexDirection: "column", justifyContent: "center", cursor: "pointer"}} onClick={() => mapRef.current.setStyle("mapbox://styles/mapbox/light-v11?optimize=true")}>
        <div style={{alignSelf: "center"}}>
            <img width="42px" height="42px" src="street-view.png" />
        </div>
        <div style={{fontSize: '0.8em', alignSelf: "center"}}>
            Light
        </div>
      </div>

      <div style={{display:"flex", flexDirection: "column", justifyContent: "center", cursor: "pointer"}} onClick={() => mapRef.current.setStyle("mapbox://styles/mapbox/dark-v11?optimize=true")}>
        <div style={{alignSelf: "center"}}>
            <img width="42px" height="42px" src="street-view.png" />
        </div>
        <div style={{fontSize: '0.8em', alignSelf: "center"}}>
            Dark
        </div>
      </div>

    </div>
  );
};

export default Layers;
