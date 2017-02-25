import fetch from 'isomorphic-fetch';
import privateConfig from './secrets'; // Ask Mihai for a sample or provide your own

/*
 * Generic API for the ICE server
 */
export default class IceApi {
    
    constructor() {
        this._token = privateConfig().token;
    }

    _getHeaders() {
        return {
            'Authorization': `Bearer ${this._token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        };
    }
    
    _request(url, requestArgs) {
        return new Promise((resolve, reject) => {
            fetch(url, requestArgs).then(response => {
                if (!response.ok) {
                    reject(response.statusText);
                } else {
                    return response.json();
                }
            }).then(resolve).catch(reject);
        });
    }

    _get(url) {
        return this._request(url, {
            method: 'GET',
            headers: this._getHeaders()
        });
    }

    _post(url, body) {
        return this._request(url, {
            method: 'POST',
            headers: this._getHeaders(),
            body: JSON.stringify(body)
        });
    }

    _put(url, body) {
        return this._request(url, {
            method: 'PUT',
            headers: this._getHeaders(),
            body: JSON.stringify(body)
        });
    }
}
