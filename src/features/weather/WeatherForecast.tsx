import { useEffect, useState } from "react";
import { 
  Cloud, 
  CloudDrizzle, 
  CloudFog, 
  CloudLightning, 
  CloudRain, 
  CloudSnow, 
  CloudSun, 
  Sun, 
  Thermometer, 
  Umbrella,
  Loader2
} from "lucide-react";
import { format, differenceInDays, isPast, isSameDay } from "date-fns";

interface WeatherForecastProps {
  lat: number;
  lng: number;
  date: string;
}

interface WeatherData {
  maxTemp: number;
  minTemp: number;
  precipProb: number;
  weatherCode: number;
}

// Codes from: https://open-meteo.com/en/docs
const getWeatherIcon = (code: number) => {
  if (code === 0) return { icon: Sun, label: "Clear sky", color: "text-yellow-500" };
  if (code >= 1 && code <= 3) return { icon: CloudSun, label: "Partly cloudy", color: "text-blue-400" };
  if (code === 45 || code === 48) return { icon: CloudFog, label: "Foggy", color: "text-gray-400" };
  if (code >= 51 && code <= 55) return { icon: CloudDrizzle, label: "Drizzle", color: "text-blue-300" };
  if (code >= 61 && code <= 67) return { icon: CloudRain, label: "Rain", color: "text-blue-500" };
  if (code >= 71 && code <= 77) return { icon: CloudSnow, label: "Snow", color: "text-cyan-200" };
  if (code >= 80 && code <= 82) return { icon: CloudRain, label: "Showers", color: "text-blue-500" };
  if (code >= 95 && code <= 99) return { icon: CloudLightning, label: "Thunderstorm", color: "text-purple-500" };
  return { icon: Cloud, label: "Overcast", color: "text-gray-500" };
};

export function WeatherForecast({ lat, lng, date }: WeatherForecastProps) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const hikeDate = new Date(date);
  const today = new Date();
  const daysUntil = differenceInDays(hikeDate, today);

  useEffect(() => {
    // If hike is in the past or too far in future (> 14 days), don't fetch
    if (daysUntil > 14 || (daysUntil < 0 && !isSameDay(hikeDate, today))) {
      setLoading(false);
      return;
    }

    const fetchWeather = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto`
        );
        
        if (!response.ok) throw new Error("Failed to fetch weather");

        const data = await response.json();
        
        const dateStr = format(hikeDate, "yyyy-MM-dd");
        const index = data.daily.time.findIndex((t: string) => t === dateStr);

        if (index !== -1) {
          setWeather({
            maxTemp: data.daily.temperature_2m_max[index],
            minTemp: data.daily.temperature_2m_min[index],
            precipProb: data.daily.precipitation_probability_max[index],
            weatherCode: data.daily.weather_code[index],
          });
        }
      } catch (err) {
        console.error(err);
        setError("Weather unavailable");
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [lat, lng, date, daysUntil]);

  // Case 1: Too far in future
  if (daysUntil > 14) {
    return (
      <div className="rounded-lg border border-dashed border-border bg-muted/30 p-4 text-center">
        <div className="flex justify-center mb-2">
          <CloudSun className="h-6 w-6 text-muted-foreground/50" />
        </div>
        <p className="text-sm font-medium text-muted-foreground">Forecast available closer to date</p>
        <p className="text-xs text-muted-foreground/70">Check back 14 days before the hike</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex h-24 items-center justify-center rounded-lg border bg-card">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // Case 3: Error or No Data
  if (error || !weather) return null;

  const { icon: WeatherIcon, label, color } = getWeatherIcon(weather.weatherCode);

  return (
    <div className="rounded-lg border bg-card p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-heading font-semibold text-sm text-muted-foreground mb-1">Forecast</h4>
          <div className="flex items-center gap-2">
            <WeatherIcon className={`h-8 w-8 ${color}`} />
            <div>
              <p className="font-medium text-lg leading-none">{label}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {Math.round(weather.minTemp)}° / <span className="font-semibold text-foreground">{Math.round(weather.maxTemp)}°C</span>
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end justify-center rounded-md bg-muted/50 px-3 py-2">
            <div className="flex items-center gap-1.5 mb-1">
                <Umbrella className="h-4 w-4 text-blue-400" />
                <span className="text-sm font-medium">{weather.precipProb}%</span>
            </div>
            <span className="text-[10px] text-muted-foreground">Precipitation</span>
        </div>
      </div>
    </div>
  );
}