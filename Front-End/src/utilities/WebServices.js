import decode from 'jwt-decode';
import queryString from 'query-string';
export default class WebService {
    // Initializing important variables
    constructor(domain) {
        this.domain = domain || 'http://localhost:3001'  // API server domain
        this.googleDomain = 'https://maps.googleapis.com/maps/api/geocode/json?'
        this.key = 'AIzaSyA6Ya_QfVc1b17ay6l-ncKR_S-53mgZW8A'
        this.fetch = this.fetch.bind(this) // React binding stuff
    }

    ///////////////////////////////////////////////          API FUNCTION          //////////////////////////////////////////////////////

    //Function config fetch data from server API -----------------------------------------

    //FOR GUEST
    //#URl: /login
    // login(username, password) {
    //     const action = 'login'
    //     const param = {
    //         action: action,
    //         userName: username,
    //         password: password
    //     }
    //     // Get a token from api server using the fetch api
    //     return this.fetch(`${this.domain}/login`, {
    //         method: 'POST',
    //         body: queryString.stringify(param)
    //     }).then(res => {
    //         return res;
    //     })
    // }

    getPlace(place) {
        const param = {
            address: place,
            key: this.key
        }
        return this.fetch(`${this.googleDomain}` + queryString.stringify(param), {
            method: 'GET',
        }).then(res => {
            return res;
        })
    }

    ///////////////////////////////////////////////          OTHER FUNCTION          //////////////////////////////////////////////////////
    //Function Authen from login -----------------------------------------
    loggedIn() {
        // Checks if there is a saved token and it's still valid
        const token = this.getToken() // GEtting token from localstorage
        return !!token && !this.isTokenExpired(token) // handwaiving here
    }
    isUser() {
        return this.loggedIn() && this.getPermission() === 'user';
    }
    isAdmin() {
        return this.loggedIn() && this.getPermission() === 'admin';
    }
    isTokenExpired(token) {
        try {
            const decoded = decode(token);
            if (decoded.exp < Date.now() / 1000) { // Checking if token is expired. N
                return true;
            }
            else
                return false;
        }
        catch (err) {
            return false;
        }
    }

    setInfo(idToken, username, permisstion) {
        // Saves user token to localStorage
        localStorage.setItem('idToken', idToken);
        localStorage.setItem('userName', username);
        localStorage.setItem('permiss', permisstion);
    }

    getToken() {
        // Retrieves the user token from localStorage
        return localStorage.getItem('idToken');
    }

    getUserName() {
        return localStorage.getItem('userName');
    }

    getPermission() {
        return localStorage.getItem('permiss');
    }

    logout() {
        // Clear user token and profile data from localStorage
        localStorage.removeItem('idToken');
        localStorage.removeItem('userName');
        localStorage.removeItem('permiss');
    }


    //Function config fetch data from server API -----------------------------------------
    fetch(url, options) {
        const timeout = 30000;
        // performs api calls sending the required authentication headers
        const headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': 'true',
            'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, DELETE',
            'Access-Control-Allow-Headers': 'Content-Type, Accept, X-Requested-With, remember-me',
            'Accept': 'application/json',
            'Content-Type': 'application/json; charset=utf-8'
        }
        const header = new Headers(headers)
        // return fetch(url, {
        //     header,
        //     ...options
        // }).then(this.checkStatus).then(response => response.json());
        return new Promise((resolve, reject) => {
            // Set timeout timer
            let timer = setTimeout(
                () => reject(new Error('Request timed out')),
                timeout
            );

            fetch(url, {
                header,
                ...options
            }).then(this.checkStatus).then(
                response => { resolve(response.json()) },
                err => reject(err)
            ).finally(() => clearTimeout(timer));
        })
    }


    checkStatus(response) {
        // raises an error in case response status is not a success
        if (response.status >= 200 && response.status < 300) { // Success status lies between 200 to 300
            return response
        } else {
            let error = new Error(response.statusText)
            error.response = response
            throw error
        }
    }
}
