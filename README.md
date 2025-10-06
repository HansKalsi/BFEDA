[![Tested with Vitest](https://img.shields.io/badge/tested%20with-vitest-6E9F18?logo=vitest&logoColor=white)](https://vitest.dev/)
[![Coverage Report](https://img.shields.io/badge/coverage-vitest%20report-blue)](./coverage/index.html)

# See It Live

[Vercel Deployment](https://bfeda.vercel.app/)

- [Brainstorming/Prepation Document](https://docs.google.com/document/d/1eAMTkJJhg03ffocmJEF08bL3qXKrBsJskDWLey2kC3U/edit?usp=sharing)
  - Includes the API key for OpenWeather

# Setup Instructions

- Pull the code to a local folder
- Create a `.env` file and include your API keys there in this format:
  - `VITE_GOOGLE_MAPS_API_KEY=[YOUR_API_KEY_HERE]`
    - Create a [Google Cloud Console](https://console.cloud.google.com/) account and go through the setup to create your API key
      - Ensure you have Places Autocomplete enabled
  - `VITE_OPENWEATHER_API_KEY=[YOUR_API_KEY_HERE]`
    - Create [OpenWeather](https://openweathermap.org/current) account and setup your API key
- Run `npm run dev` command to run locally

# Usage Instructions

- Type any city name in the input box
  - A dropdown list will appear with near matches that can be selected from
- Weather data is auto-imported for the selected city/active-selection
- Should work on mobile too

# Further Development

- If any code expansion is undertaken, use `npm run test` to ensure nothings broken
- `npm run test:coverage` will show you test coverage
