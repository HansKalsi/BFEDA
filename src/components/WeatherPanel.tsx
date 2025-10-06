import { Group, Image, Stack, Text } from "@mantine/core";
import { IconArrowUp, IconDroplet, IconShirt, IconTemperature, IconTemperatureMinus, IconTemperaturePlus, IconWind } from "@tabler/icons-react";

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
                <Group>
                    <IconTemperature size={16} />
                    <Text>Current Temperature: {metricWeatherData.main.temp}°C</Text>
                </Group>
                <Group>
                    <IconShirt size={16} />
                    <Text>Feels Like: {metricWeatherData.main.feels_like}°C</Text>
                </Group>
                <Group>
                    <IconDroplet size={16} />
                    <Text>Humidity: {metricWeatherData.main.humidity}%</Text>
                </Group>
                <Group>
                    <IconTemperatureMinus size={16} />
                    <Text>Min Temperature: {metricWeatherData.main.temp_min}°C</Text>
                </Group>
                <Group>
                    <IconTemperaturePlus size={16} />
                    <Text>Max Temperature: {metricWeatherData.main.temp_max}°C</Text>
                </Group>
                <br/>
                <Group>
                    <IconWind size={16} />
                    <Text>Wind Speed: {imperialWeatherData.wind.speed} mph</Text>
                </Group>
                <Group>
                    <IconArrowUp size={16} style={{ transform: `rotate(${metricWeatherData.wind.deg}deg)` }} />
                    <Text>Wind Direction: {metricWeatherData.wind.deg}°</Text>
                </Group>
                <br/>
                {metricWeatherData.rain ? (<Text>Rain Volume (for the last hour): {metricWeatherData.rain["1h"]} mm</Text>) : null}
            </Stack>
        </>
    );
}
