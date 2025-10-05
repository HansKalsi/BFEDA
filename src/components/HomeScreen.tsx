import { Alert, Group } from "@mantine/core";
import { APIProvider, Map, Marker, useMap } from "@vis.gl/react-google-maps";
import { PoiMarkers, type Poi } from "./PoiMarkers";
import { useEffect, useRef, useState } from "react";
import { PlacesAutocomplete } from "./PlacesAutocomplete";
import { WeatherPanel } from "./WeatherPanel";

export function HomeScreen() {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string;
    const openWeatherApiKey = import.meta.env.VITE_OPENWEATHER_API_KEY as string;
    const [location, setLocation] = useState<Poi>({key: 'london', location: { lat: 51.5072, lng: -0.1276 }});
    const [selected, setSelected] = useState(null);
    const defaultMapZoom = 8;
    const prevLocation = useRef({key: '', location: {lat: 0, lng: 0}});
    const metricWeatherData = useRef({} as any);
    const imperialWeatherData = useRef({} as any);

    useEffect(() => {
        if (!selected) return;

        const handle = setTimeout(() => {
            setLocation({ key: "selection", location: selected });
        }, 800);

        return () => clearTimeout(handle);
    }, [selected]);

    useEffect(() => {
        if (location) {
            console.log(prevLocation);
            if (prevLocation.current && prevLocation.current.location.lat === location.location.lat && prevLocation.current.location.lng === location.location.lng) {
                console.log("Location unchanged, skipping fetch");
                return;
            }
            console.log("Selected location:", location);
            const controller = new AbortController();
            // test api call
            fetchWeatherData(location.location.lat, location.location.lng, controller.signal, 'metric').then(data => {
                console.log("Weather data:", data);
                metricWeatherData.current = data;
                prevLocation.current = location;
                fetchWeatherData(location.location.lat, location.location.lng, controller.signal, 'imperial').then(data => {
                    console.log("Weather data (imperial):", data);
                    imperialWeatherData.current = data;
                });
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
                {JSON.stringify(metricWeatherData.current).length > 2 ? (
                    <WeatherPanel metricWeatherData={metricWeatherData.current} imperialWeatherData={imperialWeatherData.current} />
                ) : null}
            </Group>
        </div>
    )
}
