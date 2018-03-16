import { URL, URLSearchParams } from 'url';
import { join } from 'path';
import fetch from 'node-fetch';

class Weather {
  constructor(
    private readonly apiKey: string,
    private readonly apiUnits: string = 'metric',
    private readonly apiLang: string = 'de',
    private readonly apiBaseUrl: string = 'http://api.openweathermap.org/data/2.5/'
  ) {}

  public async byCityName(q: string) {
    return this.fetch('weather', { q });
  }

  public async byCityId(id: string) {
    return this.fetch('weather', { id });
  }

  public async byCoords(lat: number, lon: number) {
    return this.fetch('weather', { lat, lon });
  }

  public async byZipCode(zipCode: string, countryCode: string = 'de') {
    return this.fetch('weather', {
      zip: `${zipCode},${countryCode}`
    });
  }

  public async forecastByCityName(q: string) {
    return this.fetch('forecast', { q });
  }

  public async forecastByCityId(id: string) {
    return this.fetch('forecast', { id });
  }

  public async forecastByCoords(lat: number, lon: number) {
    return this.fetch('forecast', { lat, lon });
  }

  public async forecastByZipCode(zipCode: string, countryCode: string = 'de') {
    return this.fetch('forecast', {
      zip: `${zipCode},${countryCode}`
    });
  }

  public async dailyForecastByCityName(q: string) {
    return this.fetch('forecast/daily', { q });
  }

  public async dailyForecastByCityId(id: string) {
    return this.fetch('forecast/daily', { id });
  }

  public async dailyForecastByCoords(lat: number, lon: number) {
    return this.fetch('forecast/daily', { lat, lon });
  }

  public async dailyForecastByZipCode(zipCode: string, countryCode: string = 'de') {
    return this.fetch('forecast/daily', {
      zip: `${zipCode},${countryCode}`
    });
  }

  private async fetch(path: string, params: { [key: string]: any } = {}): Promise<any> {
    const query = new URLSearchParams({
      ...params,
      units: this.apiUnits,
      lang: this.apiLang,
      APPID: this.apiKey
    });
    const url = new URL(this.apiBaseUrl);
    url.pathname = join(url.pathname, path);
    url.search = query.toString();
    const response = await fetch(url.toString());
    return await response.json();
  }
}

export const weather = new Weather(process.env.APP_OWM_TOKEN);
