import axios from 'axios';

export function createAxios() {
    return axios.create({
        baseURL: 'http://www.omdbapi.com?apikey=11b31499'
    })
}