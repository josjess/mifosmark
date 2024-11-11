let API_CONFIG = {
    baseURL: 'https://test.meysa.co.ke/fineract-provider/api/v1',
};

export const loadConfig = async () => {
    try {
        const cacheBuster = `?t=${new Date().getTime()}`;

        const response = await fetch(`${process.env.PUBLIC_URL}/config.json${cacheBuster}`, {
            cache: 'no-store',
        });

        if (response.ok) {
            const config = await response.json();

            API_CONFIG.baseURL = config.baseURL || API_CONFIG.baseURL;

            console.log('API Base URL Loaded:', API_CONFIG.baseURL);
        } else {
            console.error('Failed to load configuration file:', response.statusText);
        }
    } catch (error) {
        console.error('Error loading config file:', error);
    }
};

export { API_CONFIG };
