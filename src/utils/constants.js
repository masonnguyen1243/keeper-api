import { env } from "~/config/environment";

//Domain được phép truy cập vào dữ liệu tài nguyên của server
export const WHITELIST_DOMAINS = ["http://localhost:5173"];

export const BOARD_TYPE = {
  PUBLIC: "public",
  PRIVATE: "private",
};

export const WEBSITE_DOMAIN =
  env.BUILD_MODE === "production"
    ? env.WEBSITE_DOMAIN_PRODUCTION
    : env.WEBSITE_DOMAIN_DEVELOPMENT;
