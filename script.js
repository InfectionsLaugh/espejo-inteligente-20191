let reconocimiento;
var lista = [];  //prueba
var width = 200;
var height = 180;
var video = document.getElementById('video');
var canvas = document.getElementById('canvas');
var photo = document.getElementById('photo');
var startbutton = document.getElementById('start-button');
var streaming = false;
var despacito = "https://www.youtube.com/watch?v=kJQP7kiw5Fk";
var facebook = "https://www.facebook.com/?ref=logo";
var instagram = "https://www.instagram.com/?hl=en";

document.addEventListener('change', function (e) { });

if (!("webkitSpeechRecognition" in window)) 
{
    alert("sorry no se arma con la API weeee");
}
else 
{
    reconocimiento = new webkitSpeechRecognition();
    reconocimiento.lang = "en-US";                 //para establecer el lenguaje
    reconocimiento.continuous = true;
    reconocimiento.interim = true;
    reconocimiento.addEventListener("result", iniciar);
}

//Funcion iniciar
function iniciar(event) {

    for (i = event.resultIndex; i < event.results.length; i++) 
    {
        document.getElementById('texto').innerHTML = event.results[i][0].transcript;
        if (event.results[i][0].transcript.trim() == 'Jarvis') {
            var msg = new SpeechSynthesisUtterance('Hi Alondra!');
            window.speechSynthesis.speak(msg);
        }

        if (event.results[i][0].transcript.trim() == 'play despacito') {
            window.location.href = despacito;
        }

        if (event.results[i][0].transcript.trim() == 'Facebook') {
            console.log('si entre a fb wee');
            window.location.href = facebook;
        }

        if (event.results[i][0].transcript.trim() == 'Instagram') {
            console.log('si entre a insta wee');
            window.location.href = instagram;
        }

        if (event.results[i][0].transcript.trim() == 'take photo') {
            takepicture();
        }

        if (event.results[i][0].transcript.trim().includes('add to the list')) {
            var men = event.results[i][0].transcript.trim().split('add to the list');
            console.log(men);
            var msg = new SpeechSynthesisUtterance('im ready');
            window.speechSynthesis.speak(msg);
            
            //ponerlo en una lista
            console.log('sfsefsefsefs');
            var ul = document.getElementById("pendientes");
            //frase.value = "";          //limpiar contenido
            lista.push('<li>' + men[1].trim() + '</li>');
            ul.innerHTML = lista;
        }
    }
}

reconocimiento.start();
function takepicture() {
    var context = canvas.getContext('2d');
    if (width && height) {
        canvas.width = width;
        canvas.height = height;
        context.drawImage(video, 0, 0, width, height);

        var data = canvas.toDataURL('image/jpg');
        console.log(data);

        const i_t = tf.browser.fromPixels(canvas);
        const prediction = model.predict(i_t.expandDims(0));
        prediction.array().then(resp => {
            if (resp[0][0] > 0.5) {
                document.body.style.background = 'blue';  //si es hombre
            } else {
                document.body.style.background = '#de4217';   //si es mujer
            }
            console.log(resp);
        });
        prediction.print();
    } else {
        clearphoto();
    }
}

function clearphoto() {
    var context = canvas.getContext('2d');
    context.fillStyle = "#AAA";
    context.fillRect(0, 0, canvas.width, canvas.height);

    var data = canvas.toDataURL('image/jpg');
}

//Para mostrar la fecha
$(document).ready(async function () {
    model = await tf.loadLayersModel('model.json');  //modelo de la red neuronal

    navigator.mediaDevices.getUserMedia({ video: true, audio: false })
        .then(function (stream) {
            video.srcObject = stream;
            video.play();
        })
        .catch(function (e) {
            alert('ocurrio un error: ', e);
        });

    video.addEventListener('canplay', function (ev) {
        if (!streaming) {
            height = 180;
            console.log(width, height);

            video.setAttribute('width', width);
            video.setAttribute('height', height);
            canvas.setAttribute('width', width);
            canvas.setAttribute('height', height);
            streaming = true;
        }
    }, false);

    //Mostrar fecha
    var fecha = new Date();
    var dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
    var meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

    window.setInterval(function () {
        $('#horas').text(fecha.getHours());
        $('#minutos').text(fecha.getMinutes());
        $('#segundos').text(fecha.getSeconds());
        $('#date').text(dias[fecha.getDay() - 1] + ', ' + fecha.getDay() + ' de ' + meses[fecha.getMonth() - 1] + ' del ' + fecha.getFullYear());
        fecha = new Date();
    }, 1000);
});


