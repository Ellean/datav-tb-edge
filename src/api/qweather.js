import Axios from "axios";

const instance = Axios.create({
  baseURL: "https://mw2k5mhdnk.re.qweatherapi.com",
  headers: {
    "X-QW-Api-Key": process.env.VUE_APP_QW_API_KEY,
  },
});

export const getWeatherZH = (location) => {
  return instance.get("/v7/weather/now", {
    params: {
      location,
      lang: "zh-hans",
    },
  });
};

export const getWeatherEN = (location) => {
  return instance.get("/v7/weather/now", {
    params: {
      location,
      lang: "en",
    },
  });
};

export const getCityInfoZH = (location) => {
  return instance.get("/v2/city/lookup", {
    params: {
      location,
      lang: "zh-hans",
    },
  });
};

export const getCityInfoEN = (location) => {
  return instance.get("/v2/city/lookup", {
    params: {
      location,
      lang: "en",
    },
  });
};
