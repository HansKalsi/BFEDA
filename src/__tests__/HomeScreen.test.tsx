import { render, screen, waitFor } from '../test-utils';
import { HomeScreen } from '../components/HomeScreen';

// Mock Google Maps components from @vis.gl/react-google-maps because they rely on DOM APIs not in jsdom
vi.mock('@vis.gl/react-google-maps', () => ({
  __esModule: true,
  APIProvider: ({ children }: any) => <div data-testid="api-provider">{children}</div>,
  Map: ({ children }: any) => <div data-testid="map">{children}</div>,
  Marker: ({ position }: any) => <div data-testid="marker">{JSON.stringify(position)}</div>,
  useMap: () => ({ setCenter: vi.fn(), setZoom: vi.fn() }),
}));

// Stub PlacesAutocomplete to call setSelected directly without hitting Google APIs
vi.mock('../components/PlacesAutocomplete', () => ({
  PlacesAutocomplete: ({ setSelected }: { setSelected: any }) => (
    <button onClick={() => setSelected({ lat: 40.7128, lng: -74.006 })}>
      Select NYC
    </button>
  ),
}));

// Provide env vars
vi.stubEnv('VITE_GOOGLE_MAPS_API_KEY', 'test');
vi.stubEnv('VITE_OPENWEATHER_API_KEY', 'owm');

// Mock fetch for OpenWeather calls
const metricResponse = {
  weather: [{ icon: '01d', main: 'Clear', description: 'clear sky' }],
  main: { temp: 20, feels_like: 19, humidity: 50, temp_min: 18, temp_max: 22 },
  wind: { deg: 90 },
};
const imperialResponse = { wind: { speed: 12 } };

const fetchMock = vi.fn((url: string) => {
  if (url.includes('units=metric')) {
    return Promise.resolve({ json: () => Promise.resolve(metricResponse) } as Response);
  }
  if (url.includes('units=imperial')) {
    return Promise.resolve({ json: () => Promise.resolve(imperialResponse) } as Response);
  }
  return Promise.reject(new Error('Unexpected URL'));
});

// @ts-ignore
global.fetch = fetchMock;

describe('HomeScreen', () => {
  it('fetches weather for selected city and renders values', async () => {
    render(<HomeScreen />);

    // trigger selecting a place
    screen.getByText('Select NYC').click();

    await waitFor(() => {
      // Metric temperature
      expect(screen.getByText('20°C')).toBeInTheDocument();
      // Imperial wind speed
      expect(screen.getByText(/12 mph/)).toBeInTheDocument();
      // Weather main
      expect(screen.getByText('Clear')).toBeInTheDocument();
    });

    // Ensure both API calls were made with expected query
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('units=metric'),
      expect.objectContaining({ signal: expect.anything() })
    );
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('units=imperial'),
      expect.objectContaining({ signal: expect.anything() })
    );
  });

  it('shows alert when VITE_GOOGLE_MAPS_API_KEY is missing', async () => {
    // Temporarily unset the env var
    const original = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    // @ts-ignore
    import.meta.env.VITE_GOOGLE_MAPS_API_KEY = '';

    render(<HomeScreen />);
    expect(
      screen.getByText(/You need to setup your own Google Maps API key/i)
    ).toBeInTheDocument();

    // restore
    // @ts-ignore
    import.meta.env.VITE_GOOGLE_MAPS_API_KEY = original;
  });
});
