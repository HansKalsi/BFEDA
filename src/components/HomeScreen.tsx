import { Alert, Group } from "@mantine/core";
import { APIProvider, Map, Marker, useMap } from "@vis.gl/react-google-maps";
import type { Poi } from "./PoiMarkers";
import { useEffect, useRef, useState } from "react";
import { PlacesAutocomplete } from "./PlacesAutocomplete";
import { WeatherPanel } from "./WeatherPanel";

export function HomeScreen() {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string;
    const openWeatherApiKey = import.meta.env.VITE_OPENWEATHER_API_KEY as string;
    const [location, setLocation] = useState<Poi>({key: 'london', location: { lat: 51.5072, lng: -0.1276 }});
    const [selected, setSelected] = useState<{ lat: number; lng: number } | null>(null);
    const defaultMapZoom = 8;
    const prevLocation = useRef({key: '', location: {lat: 0, lng: 0}});
    const [metricWeatherData, setMetricWeatherData] = useState<any>(null);
    const [imperialWeatherData, setImperialWeatherData] = useState<any>(null);

    useEffect(() => {
        if (!selected) return;
        console.log("Selected changed:", selected);

        const handle = setTimeout(() => {
            console.log("Updating location to:", selected);
            setLocation({ key: "selection", location: selected });
        }, 200);

        return () => clearTimeout(handle);
    }, [selected]);

    useEffect(() => {
        if (location) {
            console.warn("Location changed:", location);
            console.log(prevLocation);
            if (prevLocation.current && prevLocation.current.location.lat === location.location.lat && prevLocation.current.location.lng === location.location.lng) {
                console.log("Location unchanged, skipping fetch");
                return;
            }
            console.log("Selected location:", location);
            const controller = new AbortController();
            // Fetch both units in parallel and update state when done.
            Promise.all([
                fetchWeatherData(location.location.lat, location.location.lng, controller.signal, 'metric'),
                fetchWeatherData(location.location.lat, location.location.lng, controller.signal, 'imperial')
            ]).then(([metric, imperial]) => {
                console.log("Weather data (metric):", metric);
                console.log("Weather data (imperial):", imperial);
                setMetricWeatherData(metric);
                setImperialWeatherData(imperial);
                prevLocation.current = location;
            }).catch((err) => {
                if (err?.name !== 'AbortError') {
                    console.error('Weather fetch failed', err);
                }
            });

            return () => controller.abort();
        }
    }, [location]);

    async function fetchWeatherData(lat: number, lng: number, signal?: AbortSignal, unit: string = 'standard') {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${openWeatherApiKey}&units=${unit}`, { signal });
        const data = await response.json();
        return data;
    }

    function CenterAt({ target }: { target: any }) {
        const map = useMap();
        useEffect(() => {
            if (!map || !target) return;
            map.setCenter(target);
            map.setZoom(defaultMapZoom);
        }, [map, target]);
        return target ? <Marker position={target} /> : null;
    }

    return (
        <div>
            <h1>City Weather Search</h1>
            {!apiKey && (
                <Alert mb="md" color="red">
                    You need to setup your own Google Maps API key in a .env file as VITE_GOOGLE_MAPS_API_KEY to see the map here.
                </Alert>
            )}
            <Group mb="xl" justify="center">
                <PlacesAutocomplete setSelected={setSelected} />
            </Group>
            <Group pos={'relative'}>
                <APIProvider apiKey={apiKey}>
                    <Map
                        style={{height: '60vh', width: '80vw'}}
                        defaultCenter={location.location}
                        defaultZoom={defaultMapZoom}
                        gestureHandling='none'
                        disableDefaultUI
                        mapId={'DEMO_MAP_ID'}
                        draggableCursor={'default'}
                    >
                        {/* <PoiMarkers pois={[location]} /> */}
                        <CenterAt target={selected} />
                    </Map>
                </APIProvider>
                {metricWeatherData ? (
                    <WeatherPanel metricWeatherData={metricWeatherData} imperialWeatherData={imperialWeatherData} />
                ) : null}
            </Group>
        </div>
    )
}
