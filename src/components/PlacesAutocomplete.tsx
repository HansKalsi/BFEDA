import { Autocomplete } from "@mantine/core";
import usePlacesAutocomplete, { getGeocode, getLatLng } from "use-places-autocomplete";

export function PlacesAutocomplete({ setSelected }: { setSelected: (coords: { lat: number; lng: number } | null) => void }) {
    const {
        ready,
        setValue,
        suggestions: { status, data },
    } = usePlacesAutocomplete();

    const handleSelect = async (value: string) => {
        setValue(value);
        try {
            if (!value || value.trim().length < 2) {
                // treat as invalid/cleared input
                setSelected(null);
                return;
            }
            const results = await getGeocode({ address: value });
            if (!results?.length) {
                setSelected(null);
                return;
            }
            const { lat, lng } = await getLatLng(results[0]);
            setSelected({ lat, lng });
        } catch (e) {
            // Invalid city name, network error, or API error
            setSelected(null);
        }
    }

    return (
        <Autocomplete
            miw={300}
            placeholder="Type a city name..."
            onChange={handleSelect}
            data={status === "OK" ? data.map(({ description }) => ({ value: description, label: description })) : []}
            disabled={!ready}
        />
    )
}