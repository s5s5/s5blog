/**
 * 新的天气数据结构
 * 以 name 为主键，便于快速查询和类型推导
 */
export const weatherData = {
  晴: { code: "0", key: "Clear sky", draw: "Sun" },
  晴到多云: { code: "1", key: "Mainly clear", draw: "Sun With Small Cloud" },
  多云: { code: "2", key: "Partly cloudy", draw: "Sun Behind Small Cloud" },
  阴: { code: "3", key: "Overcast", draw: "Cloud" },
  雾: { code: "45", key: "Fog", draw: "Fog" },
  雾凇: { code: "48", key: "Depositing rime fog", draw: "Fog" },
  毛毛雨: { code: "51", key: "Drizzle: Light", draw: "Sun Behind Rain Cloud" },
  中毛毛雨: {
    code: "53",
    key: "Drizzle: Moderate",
    draw: "Sun Behind Rain Cloud"
  },
  大毛毛雨: {
    code: "55",
    key: "Drizzle: Dense",
    draw: "Sun Behind Rain Cloud"
  },
  小冻毛毛雨: {
    code: "56",
    key: "Freezing Drizzle: Light",
    draw: "Cloud With Snow"
  },
  大冻毛毛雨: {
    code: "57",
    key: "Freezing Drizzle: Dense",
    draw: "Cloud With Snow"
  },
  小雨: { code: "61", key: "Rain: Slight", draw: "Cloud With Rain" },
  中雨: { code: "63", key: "Rain: Moderate", draw: "Cloud With Rain" },
  大雨: { code: "65", key: "Rain: Heavy", draw: "Cloud With Rain" },
  小冻雨: { code: "66", key: "Freezing Rain: Light", draw: "Cloud With Snow" },
  大冻雨: { code: "67", key: "Freezing Rain: Heavy", draw: "Cloud With Snow" },
  小雪: { code: "71", key: "Snow fall: Slight", draw: "Snowflake" },
  中雪: { code: "73", key: "Snow fall: Moderate", draw: "Snowflake" },
  大雪: { code: "75", key: "Snow fall: Heavy", draw: "Snowflake" },
  米雪: { code: "77", key: "Snow grains", draw: "Snowflake" },
  阵雨: {
    code: "80",
    key: "Rain showers: Slight",
    draw: "Sun Behind Rain Cloud"
  },
  中阵雨: {
    code: "81",
    key: "Rain showers: Moderate",
    draw: "Sun Behind Rain Cloud"
  },
  强阵雨: {
    code: "82",
    key: "Rain showers: Violent",
    draw: "Cloud With Lightning And Rain"
  },
  小阵雪: { code: "85", key: "Snow showers: Slight", draw: "Cloud With Snow" },
  大阵雪: { code: "86", key: "Snow showers: Heavy", draw: "Cloud With Snow" },
  雷阵雨: {
    code: "95",
    key: "Thunderstorm",
    draw: "Cloud With Lightning And Rain"
  },
  雷阵雨伴冰雹: {
    code: "96",
    key: "Thunderstorm w/ hail",
    draw: "Cloud With Lightning And Rain"
  },
  强雷伴冰雹: {
    code: "99",
    key: "Heavy Thunderstorm",
    draw: "Cloud With Lightning And Rain"
  }
} as const;

// 从对象结构自动提取 WeatherName 类型
export type WeatherName = keyof typeof weatherData;

// 从 weatherData 自动提取所有天气名称，用于 Zod 的 enum 校验
export const weatherNames = Object.keys(weatherData) as [string, ...string[]];

// 快速访问方式：直接从 name 获取 key 和 draw
// 使用示例：
// const { key, draw, code } = weatherData["晴"];
