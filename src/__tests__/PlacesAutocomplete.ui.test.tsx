import { render, screen } from '../test-utils';
import { PlacesAutocomplete } from '../components/PlacesAutocomplete';

vi.mock('use-places-autocomplete', async () => {
  return {
    __esModule: true,
    default: () => ({ ready: false, setValue: vi.fn(), suggestions: { status: 'OK', data: [] } }),
    getGeocode: vi.fn(),
    getLatLng: vi.fn(),
  };
});

describe('PlacesAutocomplete UI', () => {
  it('disables Autocomplete when not ready', () => {
    render(<PlacesAutocomplete setSelected={() => {}} />);
    const input = screen.getByPlaceholderText('Type a city name...') as HTMLInputElement;
    expect(input).toBeDisabled();
  });
});
