const prod = {
    API_URL: 'https://consultometer.api.punkmap.com',
    APP_URL: 'https://consultometer.punkmap.com',
};
const dev = {
    API_URL: 'http://localhost:5000',
    APP_URL: 'http://localhost:3000',
};
console.log('process.env.NODE_ENV: ', process.env.NODE_ENV);
export const config = process.env.NODE_ENV === 'development' ? dev : prod;