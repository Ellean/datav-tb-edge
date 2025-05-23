import Axios from "axios";

const instance = Axios.create({
  baseURL: "https://mw2k5mhdnk.re.qweatherapi.com",
  headers: {
    "X-QW-Api-Key": process.env.VUE_APP_QW_API_KEY,
  },
});

export const getWeatherZH = () => {
  return instance.get("/v7/weather/now", {
    params: {
      location: "101210505",
      lang: "zh-hans",
    },
  });
};

export const getWeatherEN = () => {
  return instance.get("/v7/weather/now", {
    params: {
      location: "101210505",
      lang: "en",
    },
  });
};
