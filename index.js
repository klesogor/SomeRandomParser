const rp = require('request-promise');

const isError = (err,resp) => err && resp.status === 200

loadStopsForRoute(256)

async function loadStopsForRoute(routeID){
    const headers = {
        'Sec-Fetch-Mode': 'cors',
        'Referer': 'https://www.eway.in.ua/ua/cities/kyiv',
        'X-Requested-With': 'XMLHttpRequest',
        'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3800.0 Safari/537.36',
        'Pragma': 'no-cache'
    };
    
    const options = {
        url: `https://www.eway.in.ua/ajax/ru/kyiv/routeInfo/${routeID}`,
        headers: headers,
        encoding: 'utf8',
        json:true
    }; 

    const stops = await rp(options).then((response) => {
        return response.stops[0].reduce((acc, s) => {
            acc[s.i] = s.n; 
            return acc;
        },{})
    });
    
    console.log(stops);
}
