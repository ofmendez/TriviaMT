function ñ(el) { switch (el.charAt(0)) { case "#":  return document.querySelector(el); case ".":  return Array.from(document.querySelectorAll(el)); default:   return document.getElementsByTagName(el); } }
Element.prototype.ñappend = function(newE) { this.appendChild(newE); }
Element.prototype.ñclick = function(callback) { this.addEventListener("click", (e)=> { callback(e); }); };

const turns = 4
timeAnim = 5

function RandomInt(max) {
    return Math.floor(Math.random() * max);
}
function GoTo(url,par) {
    location.href = './HTML/'+url+'.html'+'?'+par
}

function ShowModalEnd(pts) {
    return new Promise((resolve,reject)=>{
        let modalEnd = `
            <div class="ContenedorPuntaje">
                <div class="OverlayFinal"></div>
                <div class="PuntajeFinal">
                    <span class="NumeroPuntaje">100</span>
                    <br>
                    <span> ${pts} </span>
                </div>
                <a class="BotonFinalizar">FINALIZAR</a>
            </div>
            `
        resolve(ñ('#modalEnd').innerHTML =modalEnd);
    });
}

function ShowMessageCharacter(id) {
    return new Promise((resolve,reject)=>{
        let msg = `
            <img src="../Images/Ventana${id}.jpg" id="BackgroundImageMsg" alt="">
        `
        resolve(ñ('#messageCharacter').innerHTML =msg);
    });
}

window.addEventListener("load",()=>{
    ñ("#playGame")?.ñclick(() => GoTo('Ruleta','') );
    ñ("#spinRoulette")?.ñclick(()=> Spin());
    console.log(ñ('#contRespuestas'));
});

function AddAnim(rot) {
    let styleSheet = document.createElement("style")
    styleSheet.innerText = `
        .FondoRuleta{ 
            animation: rAnim ${timeAnim}s cubic-bezier(0.4, 0, 0.2, 1); 
            animation-fill-mode: forwards;
        }
        @keyframes rAnim {
            from { transform: rotate(0deg); }
            to { transform: rotate(${rot}deg); }
        }
    `
    document.head.appendChild(styleSheet)
}

function Spin(){
    target = RandomInt(6);
    AddAnim(turns*360+target*60);
    setTimeout(() => {ShowMessageCharacter(target);GoQuestion(target)}, timeAnim*1000)
}

function GoQuestion(qId) {
    setTimeout(() => {GoTo('../Pregunta',`q=${qId}`)}, 1950);
}
