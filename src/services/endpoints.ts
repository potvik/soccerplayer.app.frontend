const baseUrl = process.env.BASE_URL;

const getApiUrl = () => `${baseUrl}/api/v0`;

export const ENDPOINTS = {
  token: () => `${getApiUrl()}/vst-oauth2/oauth/token`,
};
