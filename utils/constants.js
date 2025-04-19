const BAD_REQUEST = 400;
const NOT_FOUND = 404;
const DEFAULT = 500;
const FORBIDDEN = 403;
const UNAUTHORIZED = 401;
const CONFLICT = 409;

const BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://api.what-the-weather.jumpingcrab.com"
    : "http://localhost:3001";

module.exports = {
  BAD_REQUEST,
  NOT_FOUND,
  DEFAULT,
  FORBIDDEN,
  UNAUTHORIZED,
  CONFLICT,
  BASE_URL,
};
