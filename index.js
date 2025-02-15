import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fetch from 'node-fetch'; // Use fetch for making HTTP requests

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Corrected Gemini API base URL and key
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions"; // Corrected URL
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

app.use(cors());
app.use(express.json());

// Crop recommendation endpoint
app.post('/api/crop-recommendation', async (req, res) => {
  try {
    const { sector, village, district } = req.body;

    if (!sector || !village || !district) {
      return res.status(400).json({ error: 'Please provide sector, village, and district' });
    }

    // Load the weather data from the JSON file
    const weatherData = [
      {
        "district": "Gasabo",
        "weather": {
          "conditions": "Partly cloudy with sunny periods.",
          "temperature": "Around 26°C during the afternoon.",
          "feels_like": "Approximately 25°C.",
          "wind": "Gentle breeze from the northeast at speeds of 12–20 km/h.",
          "precipitation": "No significant rain expected, with a low probability of precipitation (0–20%).",
          "uv_index": "High (7), so sun protection is recommended."
        }
      },
      {
        "district": "Musanze",
        "weather": {
          "conditions": "Cloudy with a chance of rain.",
          "temperature": "Around 18°C during the afternoon.",
          "feels_like": "Approximately 17°C.",
          "wind": "Moderate wind from the southwest at speeds of 15–25 km/h.",
          "precipitation": "There is a 50% chance of rain in the afternoon.",
          "uv_index": "Moderate (5), so sun protection is advised."
        }
      },
      {
        "district": "Kigali City",
        "weather": {
          "conditions": "Sunny and warm.",
          "temperature": "Around 28°C during the afternoon.",
          "feels_like": "Around 27°C.",
          "wind": "Light breeze from the east at speeds of 5–10 km/h.",
          "precipitation": "No rain expected today.",
          "uv_index": "High (8), sunscreen recommended."
        }
      },
      {
        "district": "Ruhango",
        "weather": {
          "conditions": "Cloudy with occasional sunshine.",
          "temperature": "Around 24°C during the afternoon.",
          "feels_like": "Approximately 23°C.",
          "wind": "Light winds from the southeast at speeds of 10–15 km/h.",
          "precipitation": "20% chance of rain in the evening.",
          "uv_index": "Moderate (5), so sun protection is advised."
        }
      },
      {
        "district": "Nyamagabe",
        "weather": {
          "conditions": "Showers with a few breaks of sunshine.",
          "temperature": "Around 20°C.",
          "feels_like": "Around 19°C.",
          "wind": "Wind speeds of 5–10 km/h from the east.",
          "precipitation": "Showers expected in the afternoon.",
          "uv_index": "Low (3), no sun protection necessary."
        }
      },
      {
        "district": "Kamonyi",
        "weather": {
          "conditions": "Clear skies with no rain expected.",
          "temperature": "Around 27°C.",
          "feels_like": "Around 26°C.",
          "wind": "Light winds from the northwest at 8–12 km/h.",
          "precipitation": "No rain expected today.",
          "uv_index": "High (6), so sun protection is advised."
        }
      },
      {
        "district": "Kicukiro",
        "weather": {
          "conditions": "Partly cloudy with a chance of rain.",
          "temperature": "Around 23°C.",
          "feels_like": "Around 22°C.",
          "wind": "Light breeze from the east at speeds of 10 km/h.",
          "precipitation": "Moderate chance of rain (40%).",
          "uv_index": "Moderate (5), sun protection recommended."
        }
      },
      {
        "district": "Nyarugenge",
        "weather": {
          "conditions": "Sunny with occasional clouds.",
          "temperature": "Around 28°C.",
          "feels_like": "Around 27°C.",
          "wind": "Light breeze from the southeast at speeds of 5–10 km/h.",
          "precipitation": "No rain expected.",
          "uv_index": "High (8), sunscreen recommended."
        }
      },
      {
        "district": "Gakenke",
        "weather": {
          "conditions": "Cloudy with a possibility of light showers.",
          "temperature": "Around 20°C.",
          "feels_like": "Around 19°C.",
          "wind": "Moderate winds from the south at speeds of 15 km/h.",
          "precipitation": "Light showers expected in the evening.",
          "uv_index": "Low (3), no sun protection needed."
        }
      },
      {
        "district": "Gicumbi",
        "weather": {
          "conditions": "Cloudy with periods of sunshine.",
          "temperature": "Around 19°C.",
          "feels_like": "Around 18°C.",
          "wind": "Light winds from the northeast at speeds of 10 km/h.",
          "precipitation": "No rain expected.",
          "uv_index": "Moderate (4), sunscreen recommended."
        }
      },
      {
        "district": "Karongi",
        "weather": {
          "conditions": "Rainy and cool.",
          "temperature": "Around 16°C.",
          "feels_like": "Around 15°C.",
          "wind": "Gentle winds from the northwest at 5–10 km/h.",
          "precipitation": "Heavy rainfall expected.",
          "uv_index": "Low (2), no sun protection needed."
        }
      },
      {
        "district": "Kayonza",
        "weather": {
          "conditions": "Partly cloudy with sunny spells.",
          "temperature": "Around 25°C.",
          "feels_like": "Around 24°C.",
          "wind": "Gentle breeze from the east at speeds of 10 km/h.",
          "precipitation": "Low chance of rain (20%).",
          "uv_index": "Moderate (5), sun protection advised."
        }
      },
      {
        "district": "Kirehe",
        "weather": {
          "conditions": "Clear skies with no rain expected.",
          "temperature": "Around 27°C.",
          "feels_like": "Around 26°C.",
          "wind": "Light winds from the north at 8 km/h.",
          "precipitation": "No rain expected today.",
          "uv_index": "High (7), sunscreen recommended."
        }
      },
      {
        "district": "Gatsibo",
        "weather": {
          "conditions": "Sunny with few clouds.",
          "temperature": "Around 29°C.",
          "feels_like": "Around 28°C.",
          "wind": "Light breeze from the southeast at 10 km/h.",
          "precipitation": "No rain expected.",
          "uv_index": "High (8), sun protection is recommended."
        }
      },
      {
        "district": "Burera",
        "weather": {
          "conditions": "Cloudy with a chance of rain.",
          "temperature": "Around 18°C.",
          "feels_like": "Around 17°C.",
          "wind": "Moderate wind from the east at 10 km/h.",
          "precipitation": "There is a 60% chance of rain this afternoon.",
          "uv_index": "Moderate (4), sun protection is advised."
        }
      },
      {
        "district": "Rubavu",
        "weather": {
          "conditions": "Sunny with occasional clouds.",
          "temperature": "Around 27°C.",
          "feels_like": "Around 26°C.",
          "wind": "Light breeze from the west at 8–12 km/h.",
          "precipitation": "No rain expected.",
          "uv_index": "High (7), sunscreen recommended."
        }
      },
      {
        "district": "Rulindo",
        "weather": {
          "conditions": "Partly cloudy with no rain expected.",
          "temperature": "Around 24°C.",
          "feels_like": "Around 23°C.",
          "wind": "Light winds from the southeast at 10 km/h.",
          "precipitation": "No significant rain expected.",
          "uv_index": "Moderate (5), sun protection recommended."
        }
      },
      {
        "district": "Huye",
        "weather": {
          "conditions": "Cloudy with some sunshine.",
          "temperature": "Around 22°C.",
          "feels_like": "Around 21°C.",
          "wind": "Light winds from the southwest at 8–12 km/h.",
          "precipitation": "Low chance of rain (25%).",
          "uv_index": "Moderate (5), sunscreen advised."
        }
      },
      {
        "district": "Nyanza",
        "weather": {
          "conditions": "Clear skies with no rain expected.",
          "temperature": "Around 26°C.",
          "feels_like": "Around 25°C.",
          "wind": "Light breeze from the southeast at 5 km/h.",
          "precipitation": "No rain expected.",
          "uv_index": "High (6), sunscreen recommended."
        }
      },
      {
        "district": "Ngororero",
        "weather": {
          "conditions": "Partly cloudy with light rain expected.",
          "temperature": "Around 22°C.",
          "feels_like": "Around 21°C.",
          "wind": "Light winds from the east at 10 km/h.",
          "precipitation": "Chance of light rain in the afternoon.",
          "uv_index": "Moderate (4), sun protection advised."
        }
      },
      {
        "district": "Nyamagabe",
        "weather": {
          "conditions": "Rainy with intermittent sun.",
          "temperature": "Around 19°C.",
          "feels_like": "Around 18°C.",
          "wind": "Light winds from the northwest at 5–10 km/h.",
          "precipitation": "Heavy rain expected in the afternoon.",
          "uv_index": "Low (3), no sun protection necessary."
        }
      }
    ]
    // Find the weather for the given district
    const districtWeather = weatherData.find((data) => data.district === district);

    if (!districtWeather) {
      return res.status(400).json({ error: 'Weather data not found for the given district' });
    }

    const weatherDetails = districtWeather.weather;

    // Send the request to the Gemini API with the weather details
    const response = await fetch(GEMINI_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GEMINI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: "gemini-1.5-flash", // Replace with a valid Gemini model
        messages: [
          {
            role: "system",
            content: "You are an agricultural expert who provides crop recommendations based on location."
          },
          {
            role: "user",
            content: `Please provide crop recommendations for the following location:
            Sector: ${sector}
            Village: ${village}
            District: ${district}
            First look for the usual climate for weather for this area weather is Currently, in ${district}, Rwanda, the weather is as follows:
            Conditions: ${weatherDetails.conditions}
            Temperature: ${weatherDetails.temperature}
            Feels Like: ${weatherDetails.feels_like}
            Wind: ${weatherDetails.wind}
            Precipitation: ${weatherDetails.precipitation}
            UV Index: ${weatherDetails.uv_index}.
            Then look for the usual crops for this area.
            Consider this area. Provide a recommendation in a summarized structured format to 100 charactters.`
          }
        ],
        max_tokens: 500 // Adjust token limit as needed
      })
    });

    const data = await response.json();
    console.log(data);
    if (!response.ok) {
      throw new Error(data.message || 'Failed to get crop recommendation');
    }

    res.json({
      recommendation: data.choices[0].message.content
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Dummy market prices data
const marketPrices = {
  rice: { priceRange: "$1.2 - $1.5 per kg", trend: "Stable", outlook: "Expected to rise due to demand" },
  wheat: { priceRange: "$0.9 - $1.2 per kg", trend: "Increasing", outlook: "Likely to remain high" },
  maize: { priceRange: "$0.7 - $1.0 per kg", trend: "Decreasing", outlook: "May stabilize soon" },
  potato: { priceRange: "$0.5 - $0.8 per kg", trend: "Stable", outlook: "No major changes expected" },
  tomato: { priceRange: "$1.0 - $1.4 per kg", trend: "Volatile", outlook: "Might drop due to high supply" },
  onion: { priceRange: "$0.8 - $1.3 per kg", trend: "Increasing", outlook: "Short supply expected" },
  soybean: { priceRange: "$1.5 - $2.0 per kg", trend: "Stable", outlook: "Slight increase expected" },
  coffee: { priceRange: "$3.0 - $4.2 per kg", trend: "Increasing", outlook: "Global demand is strong" },
  tea: { priceRange: "$2.5 - $3.5 per kg", trend: "Stable", outlook: "Likely to remain unchanged" },
  banana: { priceRange: "$0.6 - $0.9 per kg", trend: "Decreasing", outlook: "Seasonal drop in prices" },
  apple: { priceRange: "$2.0 - $3.0 per kg", trend: "Increasing", outlook: "Demand-driven price hike" },
  orange: { priceRange: "$1.2 - $1.8 per kg", trend: "Stable", outlook: "Supply and demand balanced" },
  cassava: { priceRange: "$0.4 - $0.7 per kg", trend: "Stable", outlook: "Expected to remain steady" },
  beans: { priceRange: "$1.8 - $2.5 per kg", trend: "Increasing", outlook: "Export demand rising" },
  sugarcane: { priceRange: "$0.3 - $0.6 per kg", trend: "Stable", outlook: "No major fluctuations expected" },
  cotton: { priceRange: "$1.5 - $2.3 per kg", trend: "Increasing", outlook: "Rising textile industry demand" },
  peanuts: { priceRange: "$1.3 - $1.8 per kg", trend: "Stable", outlook: "Expected to remain steady" },
  millet: { priceRange: "$0.8 - $1.2 per kg", trend: "Stable", outlook: "Resistant to fluctuations" },
  barley: { priceRange: "$1.0 - $1.4 per kg", trend: "Decreasing", outlook: "Production increase expected" },
  spinach: { priceRange: "$0.9 - $1.3 per kg", trend: "Stable", outlook: "No major price movement" },
  cabbage: { priceRange: "$0.6 - $1.0 per kg", trend: "Decreasing", outlook: "Good harvest leading to lower prices" },
  carrot: { priceRange: "$1.0 - $1.5 per kg", trend: "Increasing", outlook: "Demand in processed foods growing" },
  lettuce: { priceRange: "$0.8 - $1.2 per kg", trend: "Stable", outlook: "Supply matches demand" },
  pepper: { priceRange: "$1.5 - $2.2 per kg", trend: "Increasing", outlook: "Export demand rising" }
};

app.get('/api/market-price/:crop', (req, res) => {
  const crop = req.params.crop.toLowerCase();

  if (!marketPrices[crop]) {
    return res.status(404).json({ error: `Market price data not available for ${crop}` });
  }

  res.json({
    crop,
    marketPrice: marketPrices[crop]
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
