import { render, screen } from '../test-utils';
import { PoiMarkers } from '../components/PoiMarkers';

// Mock Google Maps AdvancedMarker and Pin
vi.mock('@vis.gl/react-google-maps', () => ({
  __esModule: true,
  AdvancedMarker: ({ position, children }: any) => (
    <div data-testid="adv-marker">{JSON.stringify(position)}{children}</div>
  ),
  Pin: () => <div data-testid="pin" />,
}));

describe('PoiMarkers', () => {
  it('renders a marker per POI with a Pin inside', () => {
    const pois = [
      { key: 'a', location: { lat: 1, lng: 2 } },
      { key: 'b', location: { lat: 3, lng: 4 } },
    ] as any;

    render(<PoiMarkers pois={pois} />);

    const markers = screen.getAllByTestId('adv-marker');
    expect(markers).toHaveLength(2);
    expect(screen.getAllByTestId('pin')).toHaveLength(2);
    expect(markers[0].textContent).toContain('"lat":1');
    expect(markers[0].textContent).toContain('"lng":2');
  });
});
