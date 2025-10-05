import { Alert, Group } from "@mantine/core";
import { APIProvider, Map, Marker, useMap } from "@vis.gl/react-google-maps";
import { PoiMarkers, type Poi } from "./PoiMarkers";
import { useEffect, useState } from "react";
import { PlacesAutocomplete } from "./PlacesAutocomplete";

export function HomeScreen() {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string;
    const [location, setLocation] = useState<Poi>({key: 'london', location: { lat: 51.5072, lng: -0.1276 }});
    const [selected, setSelected] = useState(null);
    const defaultMapZoom = 8;

    useEffect(() => {
        if (selected) {
            setLocation({key: "selection", location: selected});
        }
    }, [selected]);

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
            <APIProvider apiKey={apiKey}>
                <Map
                    style={{width: '80vw', height: '70vh'}}
                    defaultCenter={location.location}
                    defaultZoom={defaultMapZoom}
                    gestureHandling='auto'
                    disableDefaultUI
                    mapId={'DEMO_MAP_ID'}
                >
                    <PoiMarkers pois={[location]} />
                    <CenterAt target={selected} />
                </Map>
            </APIProvider>
        </div>
    )
}
