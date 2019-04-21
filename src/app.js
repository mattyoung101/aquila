/**! Aquila by Team Deus Vult | Licensed under the BSD-3-Clause license */
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import css from "./style.styl"
// since Webpack is too hip to make the, like, super turbo lame jQuery work
// out of the box, this stupid hack is required. Thanks, Webpack!
import $ from 'jquery';
window.jQuery = $;
window.$ = $;
import { TimeSeries, SmoothieChart } from 'smoothie';
import ReconnectingWebSocket from 'reconnecting-websocket';
import bootbox from "bootbox";
import loader from "../assets/loading_icon.svg";
import logo from "../assets/aquila-logo-black.png";
import "./displays/tsop";
import { redrawTsopDisplay } from './displays/tsop';

console.log(`Aquila loaded`);

$(document).ready(function(){
    // Randomly add a data point every 500ms
    var timeSeries = new TimeSeries();
    var chart = new SmoothieChart();
    chart.addTimeSeries(timeSeries, { strokeStyle: 'rgba(0, 255, 0, 1)', fillStyle: 'rgba(0, 255, 0, 0.2)', lineWidth: 4 });
    chart.streamTo(document.getElementById("tsopChart"), 500);

    var noConnectionModal = bootbox.dialog({
        message: `<img src=\"${logo}\" id="aquila-logo-big"><br><img src=\"${loader}\">&nbsp;&nbsp;<b>Attempting to re-establish connection to robot...</b>`,
        onEscape: false,
        closeButton: false,
        centerVertical: true
    });

    var ws = new ReconnectingWebSocket('ws://localhost:24321');
    ws.onerror = (event) => {
        console.log("WebSocket error");
        noConnectionModal.modal("show");
    }

    ws.onopen = (event) => {
        console.log("WebSocket connected");
        noConnectionModal.modal("hide");
        timeSeries.clear();
    }

    ws.onclose = (event) => {
        console.log("WebSocket closed");
        noConnectionModal.modal("show");
        timeSeries.clear();
    }

    ws.onmessage = (event) => {
        // console.log("Adding " + event.data);
        timeSeries.append(new Date().getTime(), event.data);
        redrawTsopDisplay(document.getElementById("tsopCanvas"));
    }
});