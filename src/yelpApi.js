var Client = require('node-rest-client').Client;
var client = new Client();

class YelpApi {
  constructor(authCode, location) {
    this.zipCode = zipCode;
    this.latitude = location.getLatitude();
    this.longitude = location.getLongitude();
    
    this.headers = {
        'Authorization': `Bearer ${authCode}`,
        "cache-control": "no-cache"
      };
  }

  _buildUrl (url, queryKey, queryStr) {
    if (queryStr) {
      return `${url}&&${queryKey}=${queryStr}`;
    }
    return url;
  }

  getAll(term = null, categories = null, limit = null, offset = null) {
    const queryKeys = ['term', 'categories', 'limit', 'offset'];
    let url = `https://api.yelp.com/v3/businesses/search?latitude=${this.latitude}&&longitude=${this.longitude}`;

    queryKeys.forEach((queryKey, i) => {
      url = _buildUrl(url, queryKey, args[i]);
    });

    client.get(url, {headers: this.headers}, function (data, response) {
        // parsed response body as js object
        console.log(data);
        // raw response
        console.log(response);
    });
  }

  get(id) {
    const url = `https://api.yelp.com/v3/businesses/${id}`;

    client.get(url, {headers: this.headers}, function (data, response) {
        // parsed response body as js object
        console.log(data);
        // raw response
        console.log(response);
    });
  }

  getReviews(id) {
    const url = `https://api.yelp.com/v3/businesses/${id}/reviews`;
    client.get(url, {headers: this.headers}, function (data, response) {
        // parsed response body as js object
        console.log(data);
        // raw response
        console.log(response);
    });
  }

  getSearchSuggestions(input) {
    let url = `https://api.yelp.com/v3/autocomplete?latitude=${this.latitude}&&longitude=${this.longitude}`;
    url = _buildUrl(url, "text", input);
    client.get(url, {headers: this.headers}, function (data, response) {
        // parsed response body as js object
        console.log(data);
        // raw response
        console.log(response);
    });
  }
}
