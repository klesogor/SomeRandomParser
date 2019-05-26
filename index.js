const rp = require('request-promise');
const rl = require('readline-sync')

const headers = {
    'Sec-Fetch-Mode': 'cors',
    'Referer': 'https://www.eway.in.ua/ua/cities/kyiv',
    'X-Requested-With': 'XMLHttpRequest',
    'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3800.0 Safari/537.36',
    'Pragma': 'no-cache'
};

const defaultOptions = {
    headers: headers,
    encoding: 'utf8',
    json:true
}; 

function loadStopsForRoute(routeID){
    return rp({
        ...defaultOptions,
        url: `https://www.eway.in.ua/ajax/ru/kyiv/routeInfo/${routeID}`
    }).then(response => response.stops[0].reduce((acc, s) => {
            acc[s.n] = s.i; 
            return acc;
    },{})
    );
}

function loadRoutes() {
    return rp({
        ...defaultOptions,
        url: `https://www.eway.in.ua/ajax/ua/kyiv/routes`
    }).then(response => response['marshrutka_8'].reduce((acc, r) => {
        acc[r.rn] = r.ri; 
        return acc;
    },{})
    );
}

function loadStopData(stopId){
    return rp({
        ...defaultOptions,
        url: `https://gps.easyway.info/api/city/kyiv/lang/ru/stop/${stopId}`
    }).then(response => response.data.routes);
}

function logStopData(stop)
{
    if(stop.times.length > 0){
        console.log(`${stop.transport_name} ${stop.route_name} прибудет в ${times[0].arrival_time_formatted}`);
    } else {
        console.log(`${stop.transport_name} ${stop.route_name} ходит с интервалом ${stop.interval} минут`);
    }
}

async function run(){
    const routes = await loadRoutes();
    const route = rl.question("Выберите интересующий Вас маршрут. Список доступных маршрутов: \n" + Object.keys(routes).join("\n") + "\n");
    const stops = await loadStopsForRoute(routes[route]);
    const stop = rl.question("Теперь выберите остановку. Доступные остановки: \n" + Object.keys(stops).join("\n") + "\n");
    const stopData = await loadStopData(stops[stop]);
    logStopData(stopData.find(x => x.route_name === route));
}

run();