import axiosBase from "axios";

export const api = axiosBase.create({
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  baseURL: process.env.apiBaseUrl,
  validateStatus: function (status) {
    return true;
  },
});
