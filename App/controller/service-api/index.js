const axios = require('axios');
require('dotenv').config();

exports.DailyHoroscope = async (req, res) => {
  try {
    const { zodiacName, date } = req.body;

    // 🌟 Map zodiac name to its ID
    const zodiacIdMap = {
      Aries: 1, Taurus: 2, Gemini: 3, Cancer: 4, Leo: 5, Virgo: 6,
      Libra: 7, Scorpio: 8, Sagittarius: 9, Capricorn: 10,
      Aquarius: 11, Pisces: 12,
    };

    const zodiacId = zodiacIdMap[zodiacName];
    if (!zodiacId || !date) {
      return res.status(400).json({ error: "Invalid zodiac or date" });
    }

    const api_key = process.env.VEDIC_API_KEY || '349e48af-b57e-58aa-ad9c-623f1ab5a5f7';
    const url = `https://api.vedicastroapi.com/v3-json/prediction/daily-sun?api_key=${api_key}&date=${encodeURIComponent(date)}&zodiac=${zodiacId}&type=big&lang=hi`;

    const response = await axios.get(url);

    const data = response.data;
    if (data.status && data.response) {
      return res.status(200).json({ response: data.response });
    } else {
      return res.status(400).json({ error: "Invalid data received from API" });
    }

  } catch (error) {
    console.error("❌ Horoscope fetch error:", error?.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};


// dashkoot api 
exports.MatchMakingDashakoot = async (req, res) => {
  try {
    const {
      boy_dob,
      boy_tob,
      girl_dob,
      girl_tob,
      boy_lat = "1",
      boy_lon = "1",
      boy_tz = 5.5,
      girl_lat = "1",
      girl_lon = "1",
      girl_tz = 5.5,
      lang = "en",
    } = req.query;
    
    
    if (!boy_dob || !boy_tob || !girl_dob || !girl_tob) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const payload = {
      api_key: process.env.VEDIC_API_KEY || "349e48af-b57e-58aa-ad9c-623f1ab5a5f7",
      boy_dob,
      boy_tob,
      boy_lat,
      boy_lon,
      boy_tz,
      girl_dob,
      girl_tob,
      girl_lat,
      girl_lon,
      girl_tz,
      lang,
    };

    const response = await axios.get(
      "https://api.vedicastroapi.com/v3-json/matching/dashakoot",
      {
        params:payload,
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

    return res.status(200).json(response.data);

  } catch (error) {
    console.error("❌ Dashakoot API Error:", error.response?.data || error.message);
    return res.status(500).json({
      error: "Internal Server Error",
      message: error.response?.data || error.message
    });
  }
};


// aashkoot api 
exports.MatchMakingAashakoot = async (req, res) => {
  try {
    const {
      boy_dob,
      boy_tob,
      girl_dob,
      girl_tob,
      boy_lat = "1",
      boy_lon = "1",
      boy_tz = 5.5,
      girl_lat = "1",
      girl_lon = "1",
      girl_tz = 5.5,
      lang = "en",
    } = req.query;
    
    
    if (!boy_dob || !boy_tob || !girl_dob || !girl_tob) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const payload = {
      api_key: process.env.VEDIC_API_KEY || "349e48af-b57e-58aa-ad9c-623f1ab5a5f7",
      boy_dob,
      boy_tob,
      boy_lat,
      boy_lon,
      boy_tz,
      girl_dob,
      girl_tob,
      girl_lat,
      girl_lon,
      girl_tz,
      lang,
    };

    const response = await axios.get(
      "https://api.vedicastroapi.com/v3-json/matching/aggregate-match",
      {
        params:payload,
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

    return res.status(200).json(response.data);

  } catch (error) {
    console.error("❌ Dashakoot API Error:", error.response?.data || error.message);
    return res.status(500).json({
      error: "Internal Server Error",
      message: error.response?.data || error.message
    });
  }
};

