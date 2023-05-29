function ñ(el) { switch (el.charAt(0)) { case "#":  return document.querySelector(el); case ".":  return Array.from(document.querySelectorAll(el)); default:   return document.getElementsByTagName(el); } }
function ConmuteClassAndInner(element, c1, c2){ element.classList.add(c1); element.classList.remove(c2); }
Element.prototype.ñappend = function(newE) { this.appendChild(newE); }
Element.prototype.ñclick = function(callback) { this.addEventListener("click", (e)=> { callback(e); }); };

const timeMsg = 5
const turns = 4
const timeAnim = 4
const urlParams = new URLSearchParams(window.location.search);
const actualQuestion=   Array.from(urlParams.values())[0]??-1;
const actualTarget=  parseInt( Array.from(urlParams.values())[1]??-1 );
const pointsBySuccess = 100
const timeByAns = 59


let countdownTimer = {}
let countdownTimer2 = {}
let countdownTimer3 = {}
let timeleft = timeByAns-1
let ended = false

function RandomInt(max) {
    return Math.floor(Math.random() * max);
}

function GoTo(url,par) {
    location.href = './HTML/'+url+'.html'+'?'+par
}

function ShowMessageCharacter(id) {
    if(id%2==0){
        let s_mt = new Audio('../audio/Manuel.wav');
        s_mt.play();
    }
    let msg = ` <img src="../Images/Ventana${id}.jpg" id="BackgroundImageMsg" alt=""> `
    ñ('#messageCharacter').innerHTML =msg
}

window.addEventListener("load",()=>{
    
    ñ("#playGame")?.ñclick(() => SetNewGame() );
    ñ("#spinRoulette")?.ñclick(()=> Spin());
    ñ("#nextQuestion")?.ñclick(()=> GoTo('../Ruleta',''));
    if(!JSON.parse(localStorage.instructed))
        countdownTimer3 = setInterval(() => {
            clearInterval(countdownTimer3);
            ñ('#instructions')?.setAttribute('nodisplay', true) 
            localStorage.setItem("instructed", true);
            localStorage.setItem("time", Date.now());
            RunTimer()
        }, 5000);
    else
        ñ('#instructions')?.setAttribute('nodisplay', true) 
    
    if(parseInt(actualQuestion)>=0)
        SetQuestion(getQuestions()[actualQuestion]);
    if(ñ(".NumerosTiempo").length > 0 && JSON.parse(localStorage.instructed) )
        RunTimer();

});

function SetNewGame() {
    GoTo('Ruleta','')
    ended = false
    localStorage.setItem("time", Date.now());

    localStorage.setItem("instructed", false);
    localStorage.setItem("score", 0);
    localStorage.answered = JSON.stringify([]);
    localStorage.rouletted = JSON.stringify([]);
}

function SetQuestion(q) {
    // RunTimer()
    ñ('#BackgroundImage').src =`../Images/Fondo${actualTarget%2==0?"MT":actualTarget}.jpg`
    ñ('#statement').innerHTML = q.statement
    q.Answers.forEach((ans,i) =>{ 
        ñ('#ans'+i).innerHTML = ans.text;
        ñ('#ans'+i).ñclick(()=> Answer(ans));
    });
}

function Answer(ans) {
    let s_ans = new Audio('../audio/'+(ans.isCorrect?'Ganar.mp3':'Fallar.mp3'));
    s_ans.play();
    let classTarget = ans.isCorrect ?'RespuestaCorrecta':'RespuestaIncorrecta';
    ñ('#questionBlock').classList.add(ans.isCorrect? "PreguntaCorrecta":"PreguntaIncorrecta");
    ñ((ans.isCorrect?'#':'#in')+'correctText').removeAttribute('nodisplay')
    localStorage.setItem("score", parseInt(localStorage.getItem("score"))+(ans.isCorrect? pointsBySuccess:0));
    AnimateAnswer(ñ('#ans'+ans.id), classTarget,  120);
}


const AnimateAnswer = ( element, classTarget, interval)=>{
    ñ('#contRespuestas').classList.add('avoidEvents');
    ConmuteClassAndInner(element,classTarget,'dumb')
    setTimeout(() => {ConmuteClassAndInner(element,'dumb',classTarget)}, interval);
    setTimeout(() => {ConmuteClassAndInner(element,classTarget,'dumb')}, interval*2);
    setTimeout(() => {ConmuteClassAndInner(element,'dumb',classTarget)}, interval*3);
    setTimeout(() => {ConmuteClassAndInner(element,classTarget,'dumb')}, interval*4);
    setTimeout(() => { ñ('#nextQuestion').removeAttribute('transparent');}, interval*5);
}

function Spin(){
    // RunTimer();
    let s_ruleta = new Audio('../audio/Ruleta.wav');
    s_ruleta.play();
    let rouletted =Array.from(JSON.parse(localStorage.rouletted))
    ñ('#spinRoulette').classList.add('avoidEvents');
    let target = -1
    while(target < 0  ){
        let n1 = RandomInt(6) 
        if(rouletted.includes(n1) && rouletted.length < 6)
            continue
        target = n1
    }
    AddAnim(turns*360+target*60);
    setTimeout(() => {ShowMessageCharacter(target);GoQuestion(target)}, timeAnim*1000)
}

function GoQuestion(target) {
    qId= SelectQuestion(target);
    let answered  = Array.from(JSON.parse(localStorage.answered))
    answered.push(qId) 
    let rouletted  = Array.from(JSON.parse(localStorage.rouletted))
    rouletted.push(target) 
    localStorage.answered = JSON.stringify(answered);
    localStorage.rouletted = JSON.stringify(rouletted);
    countdownTimer2 = setTimeout(() => {if(!ended)GoTo('../Pregunta',`q=${qId}&t=${target}`)}, (timeMsg*1000)-50);
}

function SelectQuestion(target) {
    let answered = Array.from(JSON.parse(localStorage.answered))
    let idQ = -1
    while(idQ < 0  ){
        let n1 = RandomInt(30) 
        if(answered.includes(n1) || isCategory(n1, target))
            continue
        idQ = n1
    }
    return idQ
}
function isCategory(idq, target) {
    result = (target%2 ===0 && idq < 15 ) || (target%2 !==0 && idq > 14 )
    return result
}
const RunTimer = ()=>{
    timeleft = timeByAns-parseInt((Date.now()- localStorage.getItem("time"))/1000);
    ñ(".NumerosTiempo")[0].textContent =timeleft+1
    countdownTimer = setInterval(() => {
        ñ(".NumerosTiempo")[0].textContent =timeleft
        timeleft -= 1;
        if (timeleft < 0) {
            ShowModalEnd()
        }
    }, 1000);
}

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

function ShowModalEnd() {
    return new Promise((resolve,reject)=>{
        clearInterval(countdownTimer);
        ended = true
        let modalEnd = `
            <div class="ContenedorPuntaje">
                <div class="OverlayFinal"></div>
                <div class="PuntajeFinal">
                    <span class="NumeroPuntaje">${localStorage.getItem("score")}</span> <br>
                    <span> PUNTOS </span>
                </div>
                <a href="javascript:GoTo('../../index')" class="BotonFinalizar">FINALIZAR</a>
            </div>
            `
        resolve(ñ('#modalEnd').innerHTML =modalEnd);
    });
}

function getQuestions() {
    let data = `
       [
    {
        "Questions":[
            {
                "id": "0",
                "statement": "¿Cuántos días dura el ciclo menstrual femenino?",
                "Answers":[
                    {
                        "id":"0",
                        "text":"15 días aproximadamente.",
                        "isCorrect": false 
                    },
                    {
                        "id":"1",
                        "text":"28 días aproximadamente.",
                        "isCorrect": true 
                    },
                    {
                        "id":"2", 
                        "text":"55 días aproximadamente.",
                        "isCorrect": false 
                    }
                ]
            },
            {
                "id": "1",
                "statement": "¿Cuál de estos no es un síntoma premenstrual?",
                "Answers":[
                    {
                        "id":"0",
                        "text":"Acné.",
                        "isCorrect": false 
                    },
                    {
                        "id":"1",
                        "text":"Cambios de humor.",
                        "isCorrect": false 
                    },
                    {
                        "id":"2",
                        "text":"Manchas en la piel. ",
                        "isCorrect": true 
                    }
                ]
            },
            {
                "id": "2",
                "statement": "¿Qué alimentos debo evitar durante la menstruación?",
                "Answers":[
                    {
                        "id":"0",
                        "text":"Frutas y verduras.",
                        "isCorrect": false 
                    },
                    {
                        "id":"1",
                        "text":"Sal, azúcares refinadas, embutidos y cafeina.",
                        "isCorrect": true 
                    },
                    {
                        "id":"2",
                        "text":"Verduras, cafeína, fritos, cereales y proteína.",
                        "isCorrect": false 
                    }
                ]
            },
            {
                "id": "3",
                "statement": "¿Cómo sé si el tampón está bien puesto?",
                "Answers":[
                    {
                        "id":"0",
                        "text":"Lo sientes y se te dificulta caminar.",
                        "isCorrect": false 
                    },
                    {
                        "id":"1",
                        "text":"Si no lo sientes lo hiciste muy bien, el cordón siempre debe colgar fuera del cuerpo.",
                        "isCorrect": true 
                    },
                    {
                        "id":"2",
                        "text":"El cordón no se ve y se siente muy incómodo.",
                        "isCorrect": false 
                    }
                ]
            },
            {
                "id": "4",
                "statement": "¿Cuál es el tiempo máximo que debo tener puesto un tampón?",
                "Answers":[
                    {
                        "id":"0",
                        "text":"8 horas.",
                        "isCorrect": true 
                    },
                    {
                        "id":"1",
                        "text":"12 horas.",
                        "isCorrect": false 
                    },
                    {
                        "id":"2",
                        "text":"4 horas.",
                        "isCorrect": false 
                    }
                ]
            },
            {
                "id": "5",
                "statement": "¿Qué actividades pueden ayudarme a sentirme mejor durante mi periodo?",
                "Answers":[
                    {
                        "id":"0",
                        "text":"Hacer ejercicio.",
                        "isCorrect": false 
                    },
                    {
                        "id":"1",
                        "text":"Comer saludablemente.",
                        "isCorrect": false 
                    },
                    {
                        "id":"2",
                        "text":"Todas las anteriores.",
                        "isCorrect": true 
                    }
                ]
            },
            {
                "id": "6",
                "statement": "¿Sabes para que sirve el calendario que encuentras en la página de Kótex?",
                "Answers":[
                    {
                        "id":"0",
                        "text":"Esta calculadora te ayuda a recordar las fechas de cumpleaños de todos tus amigos.",
                        "isCorrect": false
                    },
                    {
                        "id":"1",
                        "text":"Esta calculadora del periodo te ayuda a rastrear tu ovulación e incluso predecir tus futuros periodos.",
                        "isCorrect": true 
                    },
                    {
                        "id":"2",
                        "text":"Esta calculadora te ayuda a elaborar un presupuesto con tus gastos personales.",
                        "isCorrect": false 
                    }
                ]
            },
            {
                "id": "7",
                "statement": "¿Existe algún producto Kótex especialmente diseñado para las chicas que se encuentran en los primeros años del periodo menstrual?",
                "Answers":[
                    {
                        "id":"0",
                        "text":"No",
                        "isCorrect": false 
                    },
                    {
                        "id":"1",
                        "text":"La edad no importa",
                        "isCorrect": false 
                    },
                    {
                        "id":"2",
                        "text":"Si, Kótex Teens.",
                        "isCorrect": true 
                    }
                ]
            },
            {
                "id": "8",
                "statement": "Kótex puro y natural tiene las siguientes características:",
                "Answers":[
                    {
                        "id":"0",
                        "text":"Con una cobertura sintética, posee colorantes y fragancias, está hecha con fibras naturales y cuenta con una cobertura extra suave.",
                        "isCorrect": false 
                    },
                    {
                        "id":"1",
                        "text":"Con una cobertura suave como el algodón, no posee colorantes ni fragancias, está hecha con fibras naturales y cuenta con una cobertura extra suave. ",
                        "isCorrect": true 
                    },
                    {
                        "id":"2",
                        "text":"Con una cobertura suave, posee fragancias dulces, está hecha con fibras artificiales.",
                        "isCorrect": false 
                    }
                ]
            },
            {
                "id": "9",
                "statement": "¿Por qué Kótex Día & Noche es ideal para usar en cualquier momento del periodo?",
                "Answers":[
                    {
                        "id":"0",
                        "text":"Con forma anatómica y alargada, se adapta a diferentes posiciones durante el día y la noche.",
                        "isCorrect": false 
                    },
                    {
                        "id":"1",
                        "text":"Cuenta con un insta centro que absorbe rápidamente el flujo, distribuyéndolo a lo largo de la toalla.",
                        "isCorrect": false 
                    },
                    {
                        "id":"2",
                        "text":"Todas las anteriores.",
                        "isCorrect": true 
                    }
                ]
            },
            {
                "id": "10",
                "statement": "Luego de la menarquia o primera regla no se crece más.",
                "Answers":[
                    {
                        "id":"0",
                        "text":"Verdadero.",
                        "isCorrect": false 
                    },
                    {
                        "id":"1",
                        "text":"Falso.",
                        "isCorrect": true 
                    },
                    {
                        "id":"2",
                        "text":"Depende de cada persona.",
                        "isCorrect": false 
                    }
                ]
            },
            {
                "id": "11",
                "statement": "¿Cuál es el color normal de la menstruación?",
                "Answers":[
                    {
                        "id":"0",
                        "text":"Varía según el ciclo.",
                        "isCorrect": true 
                    },
                    {
                        "id":"1",
                        "text":"Rojo oscuro.",
                        "isCorrect": false 
                    },
                    {
                        "id":"2",
                        "text":"Marrón.",
                        "isCorrect": false 
                    }
                ]
            },
            {
                "id": "12",
                "statement": "¿Sabes que significa SPM?",
                "Answers":[
                    {
                        "id":"0",
                        "text":"Sin Pensarlo Mucho.",
                        "isCorrect": false 
                    },
                    {
                        "id":"1",
                        "text":"Síndrome Pre Menstrual.",
                        "isCorrect": true 
                    },
                    {
                        "id":"2",
                        "text":"Science People Mark.",
                        "isCorrect": false 
                    }
                ]
            },
            {
                "id": "13",
                "statement": "¿Sí nadas teniendo la regla, los tiburones te atacarán?",
                "Answers":[
                    {
                        "id":"0",
                        "text":"Es verdad, no debes entrar al mar.",
                        "isCorrect": false 
                    },
                    {
                        "id":"1",
                        "text":"Aunque la sangre atrae a los tiburones, el riesgo de que te muerda uno no aumenta cuando tienes tu periodo.",
                        "isCorrect": true 
                    },
                    {
                        "id":"2",
                        "text":"Tiburones y cualquier animal también lo percibirá.",
                        "isCorrect": false 
                    }
                ]
            },
            {
                "id": "14",
                "statement": "¿Cuando varias mujeres conviven o se juntan, pueden \\\"sincronizarse\\\" y tener el periodo al mismo tiempo?",
                "Answers":[
                    {
                        "id":"0",
                        "text":"Es absurdo",
                        "isCorrect": false 
                    },
                    {
                        "id":"1",
                        "text":"100% comprobado",
                        "isCorrect": false 
                    },
                    {
                        "id":"2",
                        "text":"Algunas investigaciones indican que es cierto, pero otras muestras que no. Aunque es difícil de demostrar, es posible que sí haya algo de cierto en este mito.",
                        "isCorrect": true 
                    }
                ]
            },
            {
                "id": "15",
                "statement": "¿Cuál es la fecha de nacimiento de Manuel Turizo?",
                "Answers":[
                    {
                        "id":"0",
                        "text":"12 de abril de 2001.",
                        "isCorrect": false 
                    },
                    {
                        "id":"1",
                        "text":"12 de abril de 2000.",
                        "isCorrect": true 
                    },
                    {
                        "id":"2",
                        "text":"12 de marzo de 2000.",
                        "isCorrect": false 
                    }
                ]
            },
            {
                "id": "16",
                "statement": "¿Cómo se llama el hermano de Manuel Turizo?",
                "Answers":[
                    {
                        "id":"0",
                        "text":"Daniel Turizo.",
                        "isCorrect": false 
                    },
                    {
                        "id":"1",
                        "text":"Juan Turizo.",
                        "isCorrect": false 
                    },
                    {
                        "id":"2",
                        "text":"Julián Turizo.",
                        "isCorrect": true 
                    }
                ]
            },
            {
                "id": "17",
                "statement": "¿En qué ciudad de Colombia nació Manuel Turizo?",
                "Answers":[
                    {
                        "id":"0",
                        "text":"Medellín.",
                        "isCorrect": false 
                    },
                    {
                        "id":"1",
                        "text":"Cartagena.",
                        "isCorrect": false 
                    },
                    {
                        "id":"2",
                        "text":"Montería.",
                        "isCorrect": true 
                    }
                ]
            },
            {
                "id": "18",
                "statement": "¿Cuál fue el primer artista con el que Manuel hizo una colaboración?",
                "Answers":[
                    {
                        "id":"0",
                        "text":"Rosalía.",
                        "isCorrect": false 
                    },
                    {
                        "id":"1",
                        "text":"Nicky Jam.",
                        "isCorrect": true 
                    },
                    {
                        "id":"2",
                        "text":"Maluma.",
                        "isCorrect": false 
                    }
                ]
            },
            {
                "id": "19",
                "statement": "¿A qué novela pertenece la canción \\\"Soy una cantante\\\"?",
                "Answers":[
                    {
                        "id":"0",
                        "text":"La reina del flow.",
                        "isCorrect": true 
                    },
                    {
                        "id":"1",
                        "text":"La hija del mariachi.",
                        "isCorrect": false 
                    },
                    {
                        "id":"2",
                        "text":"Buscando una estrella.",
                        "isCorrect": false 
                    }
                ]
            },
            {
                "id": "20",
                "statement": "¿Qué nombre recibió la primera gira de Manuel Turizo en 2019?",
                "Answers":[
                    {
                        "id":"0",
                        "text":"ADN Tour.",
                        "isCorrect": true 
                    },
                    {
                        "id":"1",
                        "text":"Dopamina Tour.",
                        "isCorrect": false 
                    },
                    {
                        "id":"2",
                        "text":"2000 Tour.",
                        "isCorrect": false 
                    }
                ]
            },
            {
                "id": "21",
                "statement": "¿Comida favorita?",
                "Answers":[
                    {
                        "id":"0",
                        "text":"Hamburguesa.",
                        "isCorrect": false 
                    },
                    {
                        "id":"1",
                        "text":"Mote de queso.",
                        "isCorrect": true 
                    },
                    {
                        "id":"2",
                        "text":"Bandeja paisa.",
                        "isCorrect": false 
                    }
                ]
            },
            {
                "id": "22",
                "statement": "¿Cantantes favoritos?",
                "Answers":[
                    {
                        "id":"0",
                        "text":"Juan Luis Guerra, Willie Colón y The Weekend.",
                        "isCorrect": false 
                    },
                    {
                        "id":"1",
                        "text":"Juan Luis Guerra, Rubén Blades y The Weekend.",
                        "isCorrect": false 
                    },
                    {
                        "id":"2",
                        "text":"Juan Luis Guerra, Rubén Blades y Bruno Mars.",
                        "isCorrect": true 
                    }
                ]
            },
            {
                "id": "23",
                "statement": "¿Qué animal le encanta a Manuel Turizo?",
                "Answers":[
                    {
                        "id":"0",
                        "text":"Los gatos.",
                        "isCorrect": false 
                    },
                    {
                        "id":"1",
                        "text":"Los perros.",
                        "isCorrect": false 
                    },
                    {
                        "id":"2",
                        "text":"Los caballos.",
                        "isCorrect": true 
                    }
                ]
            },
            {
                "id": "24",
                "statement": "¿Cuántas novias ha tenido Manuel Turizo?",
                "Answers":[
                    {
                        "id":"0",
                        "text":"5.",
                        "isCorrect": false 
                    },
                    {
                        "id":"1",
                        "text":"3.",
                        "isCorrect": true 
                    },
                    {
                        "id":"2",
                        "text":"2.",
                        "isCorrect": false 
                    }
                ]
            },
            {
                "id": "25",
                "statement": "¿Un sueño por cumplir?",
                "Answers":[
                    {
                        "id":"0",
                        "text":"Llenar el estadio de Montería.",
                        "isCorrect": true 
                    },
                    {
                        "id":"1",
                        "text":"Saltar en paracaidas.",
                        "isCorrect": false 
                    },
                    {
                        "id":"2",
                        "text":"Tener una gira por Europa.",
                        "isCorrect": false 
                    }
                ]
            },
            {
                "id": "26",
                "statement": "¿Dónde fue su primer concierto?",
                "Answers":[
                    {
                        "id":"0",
                        "text":"En Medellín en una gira de colegios.",
                        "isCorrect": false 
                    },
                    {
                        "id":"1",
                        "text":"En Montería en una discoteca.",
                        "isCorrect": true 
                    },
                    {
                        "id":"2",
                        "text":"En Montería en un festival.",
                        "isCorrect": false 
                    }
                ]
            },
            {
                "id": "27",
                "statement": "¿Qué tipo de series le gusta ver a Manuel Turizo?",
                "Answers":[
                    {
                        "id":"0",
                        "text":"De época.",
                        "isCorrect": true 
                    },
                    {
                        "id":"1",
                        "text":"Comedia.",
                        "isCorrect": false 
                    },
                    {
                        "id":"2",
                        "text":"Comedia romántica.",
                        "isCorrect": false 
                    }
                ]
            },
            {
                "id": "28",
                "statement": "¿Comida que no le gusta?",
                "Answers":[
                    {
                        "id":"0",
                        "text":"El aguacate.",
                        "isCorrect": false 
                    },
                    {
                        "id":"1",
                        "text":"La cebolla.",
                        "isCorrect": false 
                    },
                    {
                        "id":"2",
                        "text":"La guanabana.",
                        "isCorrect": true 
                    }
                ]
            },
            {
                "id": "29",
                "statement": "¿Álbum favorito de Manuel Turizo?",
                "Answers":[
                    {
                        "id":"0",
                        "text":"Dopamina.",
                        "isCorrect": false 
                    },
                    {
                        "id":"1",
                        "text":"ADN.",
                        "isCorrect": false 
                    },
                    {
                        "id":"2",
                        "text":"2000.",
                        "isCorrect": true 
                    }
                ]
            }
        ]   
    }
]

    `
    return JSON.parse(data)[0].Questions
    
}