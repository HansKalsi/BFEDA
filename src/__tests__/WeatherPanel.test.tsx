import { render, screen } from '../test-utils';
import { WeatherPanel } from '../components/WeatherPanel';

const metricMock = {
  weather: [{ icon: '10d', main: 'Rain', description: 'light rain' }],
  main: {
    temp: 12,
    feels_like: 10,
    humidity: 90,
    temp_min: 9,
    temp_max: 14,
  },
  wind: { deg: 225 },
  rain: { '1h': 1.5 },
};

const imperialMock = {
  wind: { speed: 8 },
};

describe('WeatherPanel', () => {
  it('renders metric and imperial data correctly', () => {
    render(<WeatherPanel metricWeatherData={metricMock} imperialWeatherData={imperialMock} />);

    // Icon + main + description
    expect(screen.getByText('Rain')).toBeInTheDocument();
    expect(screen.getByText('light rain')).toBeInTheDocument();
    const img = screen.getByRole('img') as HTMLImageElement;
    expect(img.src).toContain('openweathermap.org/img/wn/10d.png');

    // Temps
    expect(screen.getByText('12°C')).toBeInTheDocument();
    expect(screen.getByText('10°C')).toBeInTheDocument();
    expect(screen.getByText('90%')).toBeInTheDocument();
    expect(screen.getByText('9°C')).toBeInTheDocument();
    expect(screen.getByText('14°C')).toBeInTheDocument();

    // Wind speed mph (imperial)
    expect(screen.getByText(/8 mph/)).toBeInTheDocument();

    // Rain
    expect(screen.getByText('1.5 mm')).toBeInTheDocument();
  });

  it('does not render rain section when rain is absent', () => {
    const noRain = { ...metricMock, rain: undefined };
    render(<WeatherPanel metricWeatherData={noRain} imperialWeatherData={imperialMock} />);
    expect(screen.queryByText(/mm$/)).not.toBeInTheDocument();
  });
});
