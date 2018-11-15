import decode from 'jwt-decode';
import queryString from 'query-string';
export default class WebService {
    // Initializing important variables
    constructor(domain) {
        this.apiDomain = domain || 'http://172.16.19.190:3001/api'  // API server domain
        this.mapDomain = 'https://maps.googleapis.com/maps/api/geocode/json?'
        this.key = 'AIzaSyA6Ya_QfVc1b17ay6l-ncKR_S-53mgZW8A'
        this.fetchDataApi = this.fetchDataApi.bind(this) // React binding stuff
        this.fetchDataMap = this.fetchDataMap.bind(this) // React binding stuff

    }

    ///////////////////////////////////////////////          API FUNCTION          //////////////////////////////////////////////////////

    //Function config fetch data from server API -----------------------------------------

    //FOR GUEST
    //#URl: /login
    login(username, password) {
        const param = {
            user: username,
            pwd: password
        }
        // Get a token from api server using the fetch api
        return this.fetchDataApi(`${this.apiDomain}/login`, {
            method: 'POST',
            json: true,
            body: JSON.stringify(param),
        }).then(res => {
            console.log(res)
            return res;
        })
    }

    getPlace(place) {
        const param = {
            address: place,
            key: this.key
        }
        return this.fetchDataMap(`${this.mapDomain}` + queryString.stringify(param), {
            method: 'GET',
        }).then(res => {
            return res;
        })
    }

    getPlaceRev(latlng) {
        const param = {
            latlng: latlng.lat + "," + latlng.lng,
            key: this.key
        }
        return this.fetchDataMap(`${this.mapDomain}` + queryString.stringify(param), {
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
        return this.loggedIn() && this.getPermission() === '1';
    }
    isDriver() {
        return this.loggedIn() && this.getPermission() === '4';
    }
    isLocate() {
        return this.loggedIn() && this.getPermission() === '2';
    }
    isAdmin() {
        return this.loggedIn() && this.getPermission() === '3';
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

    setInfo(id, username, phone, permission, token) {
        // Saves user token to localStorage
        localStorage.setItem('idToken', token);
        localStorage.setItem('idUser', id);
        localStorage.setItem('userName', username);
        localStorage.setItem('userPhone', phone);
        localStorage.setItem('permiss', permission);
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

    getPhoneNum() {
        return localStorage.getItem('userPhone');
    }

    logout() {
        // Clear user token and profile data from localStorage
        localStorage.removeItem('idUser');
        localStorage.removeItem('idToken');
        localStorage.removeItem('userName');
        localStorage.removeItem('userPhone');
        localStorage.removeItem('permiss');
    }


    //Function config fetch data from server API -----------------------------------------
    fetchDataApi(url, options) {
        const timeout = 30000;
        // return fetch(url, {
        //     header,
        //     ...options
        // }).then(this.checkStatus).then(response => response.json());
        return new Promise((resolve, reject) => {
            // Set timeout timer
            let timer = setTimeout(
                () => reject(('Request timed out')),
                timeout
            );

            fetch(url, {
                ...options,
                headers:{
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                }
            }).then(this.checkStatus).then(
                response => { 
                    resolve(response.json()) },
                err => reject(err)
            ).catch(error => {
                reject(error)
            }).finally(() => clearTimeout(timer));
        })
    }

    fetchDataMap(url, options) {
        const timeout = 30000;
        // return fetch(url, {
        //     header,
        //     ...options
        // }).then(this.checkStatus).then(response => response.json());
        return new Promise((resolve, reject) => {
            // Set timeout timer
            let timer = setTimeout(
                () => reject(('Request timed out')),
                timeout
            );

            fetch(url, {
                ...options,
            }).then(this.checkStatus).then(
                response => { 
                    resolve(response.json()) },
                err => reject(err)
            ).catch(error => {
                reject(error)
            }).finally(() => clearTimeout(timer));
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
