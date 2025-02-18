const config = {
    development : {
        API_URL : 'http://localhost:5000/'
    },
    production : {
        API_URL : 'https://cruel-davita-sadeshop-79e55b22.koyeb.app/'
    }
}

const mode = import.meta.env.MODE || "development"
export const API_URL = config[mode].API_URL;