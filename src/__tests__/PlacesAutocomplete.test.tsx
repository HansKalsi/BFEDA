import { render, screen } from '../test-utils';
import userEvent from '@testing-library/user-event';
import { PlacesAutocomplete } from '../components/PlacesAutocomplete';

// Mock use-places-autocomplete internals
vi.mock('use-places-autocomplete', async () => {
  return {
    __esModule: true,
    default: () => ({
      ready: true,
      setValue: vi.fn(),
      suggestions: { status: 'OK', data: [] },
    }),
    getGeocode: vi.fn(),
    getLatLng: vi.fn(),
  };
});

import { getGeocode, getLatLng } from 'use-places-autocomplete';

const mockedGetGeocode = getGeocode as unknown as ReturnType<typeof vi.fn>;
const mockedGetLatLng = getLatLng as unknown as ReturnType<typeof vi.fn>;

function setup(onSelect: (coords: { lat: number; lng: number } | null) => void) {
  render(<PlacesAutocomplete setSelected={onSelect} />);
  return screen.getByPlaceholderText('Type a city name...') as HTMLInputElement;
}

describe('PlacesAutocomplete', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });
  it('calls setSelected(null) on invalid/short input', async () => {
    const onSelect = vi.fn();
    const input = setup(onSelect);

    await userEvent.type(input, 'a'); // too short

    expect(onSelect).toHaveBeenLastCalledWith(null);
  });

  it('handles getGeocode returning empty results by calling setSelected(null)', async () => {
    const onSelect = vi.fn();
    const input = setup(onSelect);

    (mockedGetGeocode as any).mockResolvedValueOnce([]);

    await userEvent.clear(input);
    await userEvent.type(input, 'Invalid City');

    // Allow promises to resolve
    await vi.waitFor(() => {
      expect(onSelect).toHaveBeenLastCalledWith(null);
    });
  });

  it('maps a valid city name to lat/lng and calls setSelected with coords', async () => {
    const onSelect = vi.fn();
    const input = setup(onSelect);

    // Return a successful geocode for every keystroke during typing
    (mockedGetGeocode as any).mockResolvedValue([{}]);
    (mockedGetLatLng as any).mockResolvedValue({ lat: 51.5, lng: -0.12 });

    await userEvent.clear(input);
    await userEvent.type(input, 'London');

    await vi.waitFor(() => {
      expect(onSelect).toHaveBeenLastCalledWith({ lat: 51.5, lng: -0.12 });
    });
  });

  it('catches errors and calls setSelected(null)', async () => {
    const onSelect = vi.fn();
    const input = setup(onSelect);

    (mockedGetGeocode as any).mockRejectedValue(new Error('Network'));

    await userEvent.clear(input);
    await userEvent.type(input, 'Paris');

    await vi.waitFor(() => {
      expect(onSelect).toHaveBeenLastCalledWith(null);
    });
  });
});
