import { Autocomplete } from "@mantine/core";
import usePlacesAutocomplete, { getGeocode, getLatLng } from "use-places-autocomplete";

export function PlacesAutocomplete({ setSelected }: { setSelected: any }) {
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