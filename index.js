const express = require("express");
const app = express();
const CronJob = require('cron').CronJob;
const CronTime = require('cron').CronTime;
const psList = require('ps-list');
const process = require('process');
var sleep = require('system-sleep');
const childProcess = require('child_process');
var moment = require('moment');

let index_view = 0;
const urls = [
    { element: 'http://192.168.2.63/tests/videowall/videos.php', duration: 120000 },
    { element: 'http://192.168.2.63/tests/videowall/asistencia.php', duration: 180000 },
    { element: 'http://192.168.2.63/tests/videowall/videos.php', duration: 4000 }
];


app.listen(3000, () => {
    console.log("application ready by port 3000")
})


const task = new CronJob(`${moment().add(1, 'm').minute()} * * * *`, async() => {
    console.log("ingreso function")
    cant_views = urls.length - 1;
    url = urls[index_view].element
    process_lists = await psList();
    process_lists.map((process_element) => {
        if (process_element.name == "chrome.exe") {
            process.kill(process_element.pid)
        }
    })

    childProcess.exec(`start chrome --start-fullscreen --incognito ${url}`);
    task.stop()
    time = urls[index_view].duration * 60000
    sleep(time); // en milisegundos
    if (index_view < cant_views) {
        index_view++;
    } else {
        index_view = 0;
    }
    task.setTime(new CronTime(`${moment().add(1, 'm').minute()} * * * *`))
    task.start()
}, null, true, 'America/Bogota');

new CronJob('0 9,14,17 * * *', async() => {
    task.stop()
    url_DEFINE = "http://192.168.2.34/pantallas_indicadores/llegadas_personas/informe_pantallas/";
    process_lists = await psList();
    process_lists.map((process_element) => {
        if (process_element.name == "chrome.exe") {
            process.kill(process_element.pid)
        }
    })
    childProcess.exec(`start chrome --start-fullscreen --incognito ${url_DEFINE}`);
    time = 2 * 60000
    sleep(time); // en milisegundos
    task.start()
}, null, true, 'America/Bogota');