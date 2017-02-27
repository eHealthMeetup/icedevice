import fetch from 'isomorphic-fetch';
import privateConfig from './secrets'; // Ask Mihai for a sample or provide your own

/*
 * Generic API for the ICE server
 */
export default class IceApi {
    
    constructor() {
        let config = privateConfig()
        this._token = config.token;
        this._site = config.site;
        this._subject = config.subject;
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

    postSite(name, country) {
        this._post('/v1/sites', [{
            'id': null,
            'name': name,
            'country': country
        }]);
    }
    
    postSubject(subject, site) {
        this._post('/v1/subjects', [{
            'id': subject,
            'site': site
        }]);
    }

    postValue(variable, value, repeat) {
        this._post('/v1/values', [{
            'subject': this._subject,
            'group': '', 'subgroup': '', 'repeat': `${repeat}`,
            'variable': variable,
            'value': `${value}`
        }]);
    }

    postCode(name, author, code) {
        this._post('/v1/blobs', {
            'name': name,
            'author': author,
            'code': code
        }).then((response) => {
            this._post('/v1/forms', [{
                'name': name,
                'device': 'web',
                'blob': `${response.result.url.split('/').pop()}`
            }]);
        });
    }

    getSensors() {
        return this._get('/v1/views/entry/sensors');
    }
}
