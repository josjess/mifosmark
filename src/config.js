let API_CONFIG = {
    baseURL: 'https://demo.mifos.io/fineract-provider/api/v1'
};

export const loadConfig = async () => {
    try {
        const response = await fetch(`${process.env.PUBLIC_URL}/config.json`);
        const config = await response.json();
        API_CONFIG.baseURL = config.baseURL || API_CONFIG.baseURL;
        // console.log('API URL loaded:', API_CONFIG.baseURL);
    } catch (error) {
        console.error("Error loading config file:", error);
    }
};

export { API_CONFIG };
