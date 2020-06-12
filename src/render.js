const videoElement = document.querySelector("video");
const startBtn = document.querySelector("#startBtn");
const stopBtn = document.querySelector("#stopBtn");
const selectBtn = document.querySelector("#windowSelectBtn");

const { desktopCapturer, remote } = require("electron");
const { Menu } = remote;
const http = require("http");
const fs = require("fs");




async function getVideoSrc() {
    const inputSrc = await desktopCapturer.getSources({
        types: ['window', 'screen']
    });
    const optionSrc = Menu.buildFromTemplate(
        inputSrc.map(src => {
            return {
                label: src.name,
                click: () => selectSrc(src)
            }
        })
    )

    optionSrc.popup();
}

async function selectSrc(src){
    selectBtn.innerText = src.name;
    
    const constraints = {
        audio: false,
        video: {
            mandatory: {
                chromeMediaSource: "desktop",
                chromeMediaSourceId: src.id
            }
        }
    }

    var stream = await navigator.mediaDevices.getUserMedia(constraints);
    videoElement.srcObject = stream;
    videoElement.play();

    http.createServer(function (req, res) {
        if(req.url == "/video"){
            // res.writeHead(206);
            const options = {mimeType: "video/webm; codecs=vp9"};
            let mediaRecorder = new MediaRecorder(stream,options);
            alert(mediaRecorder.constructor.name);
        }
        else {
            res.writeHead(200);
            res.end(fs.readFileSync("src/subIndex.html"));
        }
    }).listen(80);
}


