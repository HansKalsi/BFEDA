import { Alert, Autocomplete, Group } from "@mantine/core";
import { APIProvider, Map, Marker, useMap } from "@vis.gl/react-google-maps";
import { PoiMarkers, type Poi } from "./PoiMarkers";
import usePlacesAutocomplete, { getGeocode, getLatLng } from "use-places-autocomplete";
import { useEffect, useState } from "react";

export function HomeScreen() {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string;
    const [location, setLocation] = useState<Poi>({key: 'london', location: { lat: 51.5072, lng: -0.1276 }});
    const [selected, setSelected] = useState(null);

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
            map.setZoom(8); // keep it at 8
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
                    defaultZoom={8}
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

const PlacesAutocomplete =  ({ setSelected }: { setSelected: any }) => {
    const {
        ready,
        setValue,
        suggestions: { status, data },
    } = usePlacesAutocomplete();

    const handleSelect = async (value: string) => {
        setValue(value);

        const results = await getGeocode({ address: value });
        const { lat, lng } = await getLatLng(results[0]);
        setSelected({ lat, lng });
    }

    return (
        <Autocomplete
            miw={300}
            placeholder="Type a city name..."
            onChange={handleSelect}
            data={status === "OK" ? data.map(({ place_id, description }) => ({ value: description, label: description })) : []}
            disabled={!ready}
        />
    )
}