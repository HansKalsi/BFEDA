import { Group, Image, Stack, Text } from "@mantine/core";

export function WeatherPanel({metricWeatherData, imperialWeatherData}: {metricWeatherData: any, imperialWeatherData: any}) {
    return (
        <>
            <Stack pos={'absolute'} top={0} left={0} bg={'#000c'} p={10} maw={'30%'} mih={'100%'}>
                <Group gap={"sm"}>
                    <Image w={"50px"} src={`https://openweathermap.org/img/wn/${metricWeatherData.weather[0].icon}.png`} />
                    <Text size="xl" style={{ textAlign: 'left' }}>{metricWeatherData.weather[0].main}</Text>
                    <Text size="xs">{metricWeatherData.weather[0].description}</Text>
                </Group>
                <br/>
                <Text>Current Temperature: {metricWeatherData.main.temp}°C</Text>
                <Text>Feels Like: {metricWeatherData.main.feels_like}°C</Text>
                <Text>Humidity: {metricWeatherData.main.humidity}%</Text>
                <Text>Min Temperature: {metricWeatherData.main.temp_min}°C</Text>
                <Text>Max Temperature: {metricWeatherData.main.temp_max}°C</Text>
                <br/>
                <Text>Wind Speed: {imperialWeatherData.wind.speed} mph</Text>
                <Text>Wind Direction: {metricWeatherData.wind.deg}°</Text>
                <br/>
                {metricWeatherData.rain ? (<Text>Rain Volume (for the last hour): {metricWeatherData.rain["1h"]} mm</Text>) : null}
            </Stack>
        </>
    );
}
