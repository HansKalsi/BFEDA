import { Group, Image, Stack, Text, Tooltip } from "@mantine/core";
import { IconArrowUp, IconCloudRain, IconDroplet, IconShirt, IconTemperature, IconTemperatureMinus, IconTemperaturePlus, IconWind } from "@tabler/icons-react";

export function WeatherPanel({metricWeatherData, imperialWeatherData}: {metricWeatherData: any, imperialWeatherData: any}) {
    const iconSize = 22;

    return (
        <Stack pos={'absolute'} top={0} left={0} bg={'#000c'} p={15} maw={'30%'} miw={'200px'} mih={'100%'}>
            <Group gap={"sm"}>
                <Image w={"50px"} src={`https://openweathermap.org/img/wn/${metricWeatherData.weather[0].icon}.png`} />
                <Text size="xl" style={{ textAlign: 'left' }}>{metricWeatherData.weather[0].main}</Text>
                <Text size="xs">{metricWeatherData.weather[0].description}</Text>
            </Group>
            <Stack>
                <Tooltip label="Current Temperature">
                    <Group style={{ cursor: 'help' }}>
                        <IconTemperature size={iconSize} />
                        <Text>{metricWeatherData.main.temp}°C</Text>
                    </Group>
                </Tooltip>
                <Tooltip label="Feels Like Temperature">
                    <Group style={{ cursor: 'help' }}>
                        <IconShirt size={iconSize} />
                        <Text>{metricWeatherData.main.feels_like}°C</Text>
                    </Group>
                </Tooltip>
                <Tooltip label="Humidity">
                    <Group style={{ cursor: 'help' }}>
                        <IconDroplet size={iconSize} />
                        <Text>{metricWeatherData.main.humidity}%</Text>
                    </Group>
                </Tooltip>
                <Tooltip label="Minimum Temperature">
                    <Group style={{ cursor: 'help' }}>
                        <IconTemperatureMinus size={iconSize} />
                        <Text>{metricWeatherData.main.temp_min}°C</Text>
                    </Group>
                </Tooltip>
                <Tooltip label="Maximum Temperature">
                    <Group style={{ cursor: 'help' }}>
                        <IconTemperaturePlus size={iconSize} />
                        <Text>{metricWeatherData.main.temp_max}°C</Text>
                    </Group>
                </Tooltip>
                <br/>
                <Tooltip label="Wind Speed in Miles per Hour">
                    <Group style={{ cursor: 'help' }}>
                        <IconWind size={iconSize} />
                        <Text>{imperialWeatherData.wind.speed} mph</Text>
                    </Group>
                </Tooltip>
                <Tooltip label="Wind Direction in Degrees (0° is North, 90° is East, 180° is South, 270° is West)">
                    <Group style={{ cursor: 'help' }}>
                        <IconArrowUp size={iconSize} style={{ transform: `rotate(${metricWeatherData.wind.deg}deg)` }} />
                        <Text>{metricWeatherData.wind.deg}°</Text>
                    </Group>
                </Tooltip>
                <br/>
                {metricWeatherData.rain ? (
                    <Tooltip label="Rain Volume (for the last hour) in Millimeters">
                        <Group style={{ cursor: 'help' }}>
                            <IconCloudRain size={iconSize} />
                            <Text>{metricWeatherData.rain["1h"]} mm</Text>
                        </Group>
                    </Tooltip>
                ) : null}
            </Stack>
        </Stack>
    );
}
