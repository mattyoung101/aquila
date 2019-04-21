import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import css from "./style.styl"
// god I fucking love JavaScript
import $ from 'jquery';
window.jQuery = $;
window.$ = $;
import { TimeSeries, SmoothieChart } from 'smoothie';

console.log(`Aquila loaded`);

jQuery(document).ready(function(){
    // Randomly add a data point every 500ms
    var random = new TimeSeries();
    setInterval(function() {
        random.append(new Date().getTime(), Math.random() * 10000);
    }, 500);
      
    var chart = new SmoothieChart();
    chart.addTimeSeries(random, { strokeStyle: 'rgba(0, 255, 0, 1)', fillStyle: 'rgba(0, 255, 0, 0.2)', lineWidth: 4 });
    chart.streamTo(document.getElementById("tsopChart"), 500);
});