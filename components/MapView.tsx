"use client";

import React, { useEffect, useRef, useState } from "react";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import Draw from "ol/interaction/Draw";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { Circle as CircleStyle, Fill, Stroke, Style } from "ol/style";

const MapView: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<Map | null>(null);
  const [drawType, setDrawType] = useState<"Polygon" | "Point" | "LineString">(
    "Polygon"
  );
  const [area, setArea] = useState("");
  const [point, setPoint] = useState("");

  useEffect(() => {
    if (mapRef.current) {
      const source = new VectorSource();
      const vector = new VectorLayer({
        source: source,
        style: new Style({
          fill: new Fill({
            color: "rgba(255, 255, 255, 0.2)",
          }),
          stroke: new Stroke({
            color: "#ffcc33",
            width: 2,
          }),
          image: new CircleStyle({
            radius: 7,
            fill: new Fill({
              color: "#ffcc33",
            }),
          }),
        }),
      });

      const draw = new Draw({
        source: source,
        type: "LineString",
      });

      draw.on("drawend", (event) => {
        const geometry = event.feature.getGeometry();
        if (geometry) {
          if (geometry.getType() === "Polygon") {
            const area = geometry.getArea();
            console.log(area);
            setArea(area);
          } else if (geometry.getType() === "LineString") {
            const length = geometry.getLength();
            console.log(area);
            setArea(length);
          } else if (geometry.getType() === "Point") {
            const coordinate = geometry.getCoordinates();
            console.log(`Point: (${coordinate[0]}, ${coordinate[1]})`);
            setPoint(`Point: (${coordinate[0]}, ${coordinate[1]})`);
          }
        }
      });

      const map = new Map({
        target: mapRef.current,
        layers: [
          new TileLayer({
            source: new OSM(),
          }),
          vector,
        ],
        view: new View({
          center: [0, 0],
          zoom: 2,
        }),
      });

      map.addInteraction(draw);
      mapInstance.current = map;
    }
  }, [drawType]);

  const handleDrawTypeChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const type = event.target.value as "Polygon" | "Point" | "LineString";
    setDrawType(type);
  };

  return (
    <div>
      <div>
        <select value={drawType} onChange={handleDrawTypeChange}>
          <option value="Polygon">Draw Polygon</option>
          <option value="Point">Draw Point</option>
          <option value="LineString">Draw Line</option>
        </select>
      </div>
      <div>
        <div>Area: {area}</div>
        <div>Point: {point}</div>
      </div>
      <div ref={mapRef} style={{ width: "100%", height: "1000px" }} />
    </div>
  );
};

export default MapView;
