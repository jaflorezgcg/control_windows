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
    { element: 'http://192.168.2.43/video_wall/videos.php', duration: 29 },
    { element: 'http://192.168.2.43/video_wall/call.php', duration: 29 },
    { element: 'http://192.168.2.34/pantallas_indicadores/llegadas_personas/informe_pantallas/', duration: 29 },
];


app.listen(3000, () => {
    console.log("application ready by port 3000")
})


const task = new CronJob(`${moment().add(1, 'm').minute()} * * * *`, async() => {
    console.log("ingreso rotativo")
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
    console.log("ingreso pausas")
    task.stop()
    url_videos = "http://192.168.2.43/video_wall/play.php?video=pausas";
    process_lists = await psList();
    process_lists.map((process_element) => {
        if (process_element.name == "chrome.exe") {
            process.kill(process_element.pid)
        }
    })
    childProcess.exec(`start chrome --start-fullscreen --incognito ${url_videos}`);
    time = 7 * 60000
    sleep(time); // en milisegundos
    task.start()
}, null, true, 'America/Bogota');

new CronJob('30 9,12,5 * * *', async() => {
    console.log("ingreso coop")
    task.stop()
    url_coopast = "http://192.168.2.43/video_wall/play.php?video=coppast";
    process_lists = await psList();
    process_lists.map((process_element) => {
        if (process_element.name == "chrome.exe") {
            process.kill(process_element.pid)
        }
    })
    childProcess.exec(`start chrome --start-fullscreen --incognito ${url_coopast}`);
    time = 7 * 60000
    sleep(time); // en milisegundos
    task.start()
}, null, true, 'America/Bogota');

new CronJob('40 7 * * *', async() => {
    console.log("ingreso asistence")
    url_asistence = "http://192.168.2.43/video_wall/asistencia.php";
    process_lists = await psList();
    process_lists.map((process_element) => {
        if (process_element.name == "chrome.exe") {
            process.kill(process_element.pid)
        }
    })
    childProcess.exec(`start chrome --start-fullscreen --incognito ${url_asistence}`);
    time = 59 * 60000
    sleep(time);
}, null, true, 'America/Bogota');