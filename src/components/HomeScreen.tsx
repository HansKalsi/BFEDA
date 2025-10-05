import { Alert, Input } from "@mantine/core";
import { APIProvider, Map } from "@vis.gl/react-google-maps";
import { PoiMarkers, type Poi } from "./PoiMarkers";

export function HomeScreen() {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string;

    const locations: Poi[] = [
        {key: 'london', location: { lat: 51.5072, lng: 0.1276 }},
    ];

    return (
        <div>
            <h1>City Weather Search</h1>
            {/* <Input placeholder="Try typing a city name..." mb="md" /> */}
            {!apiKey && (
                <Alert mb="md" color="red">
                    You need to setup your own Google Maps API key in a .env file as VITE_GOOGLE_MAPS_API_KEY to see the map here.
                </Alert>
            )}

            <APIProvider apiKey={apiKey}>
                <Map
                    style={{width: '80vw', height: '80vh'}}
                    defaultCenter={{lat: 22.54992, lng: 0}}
                    defaultZoom={3}
                    gestureHandling='greedy'
                    disableDefaultUI
                    mapId={'DEMO_MAP_ID'}
                >
                    <PoiMarkers pois={locations} />
                </Map>
            </APIProvider>
        </div>
    )
}
