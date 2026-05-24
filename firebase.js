// FIREBASE IMPORT

import { initializeApp }

from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js"

import {

getFirestore,
collection,
onSnapshot,
doc,
setDoc

}

from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js"



//////////////////////////////////////////////////////
// FIREBASE CONFIG
//////////////////////////////////////////////////////

const firebaseConfig={

apiKey:"AIzaSyB7D9fM_Twg04mNnPIOhLZLq56as255wzc",

authDomain:"asat-2026.firebaseapp.com",

projectId:"asat-2026",

storageBucket:"asat-2026.firebasestorage.app",

messagingSenderId:"99708731765",

appId:"1:99708731765:web:3fc4914a6264ffe2ee533c"

}



//////////////////////////////////////////////////////
// INIT
//////////////////////////////////////////////////////

const app=
initializeApp(firebaseConfig)

const db=
getFirestore(app)



//////////////////////////////////////////////////////
// MAPEL
//////////////////////////////////////////////////////

const mapelList=[

"Bahasa Indonesia",
"Bahasa Inggris",
"Bahasa Jawa",
"IPAS",
"Matematika",
"PJOK",
"Seni Rupa",
"Agama"

]



//////////////////////////////////////////////////////
// LOGIN STATUS REALTIME
//////////////////////////////////////////////////////

const tbody=
document.getElementById(
"tableBody"
)

const onlineCount=
document.getElementById(
"onlineCount"
)

onSnapshot(

collection(
db,
"login_status"
),

(snapshot)=>{

tbody.innerHTML=""

let online=0

snapshot.forEach((docu)=>{

const data=
docu.data()

if(

data.status==="ONLINE"||
data.status==="UJIAN"

){

online++

}

tbody.innerHTML += `

<tr>

<td>${docu.id}</td>

<td>${data.nama||"-"}</td>

<td>${data.kelas||"-"}</td>

<td style="color:red;font-weight:bold">

${data.status||"-"}

</td>

<td>${data.mapel||"-"}</td>

<td>

${

data.waktu

?

new Date(
data.waktu.seconds*1000
).toLocaleTimeString()

:

"-"

}

</td>

</tr>

`

})

onlineCount.innerText=
online

}

)



//////////////////////////////////////////////////////
// CONTROL PANEL
//////////////////////////////////////////////////////

const controlDiv=
document.getElementById(
"controlPanel"
)



function loadControlPanel(){

controlDiv.innerHTML=""

mapelList.forEach(

(mapel)=>{

const id=

"btn_"+
mapel.replaceAll(
" ",
"_"
)

onSnapshot(

doc(
db,
"exam_control",
mapel
),

(snapshot)=>{

const data=
snapshot.data()||{}

const status=
data.status||
"CLOSED"



if(

!document.getElementById(id)

){

controlDiv.innerHTML += `

<div class="controlCard">

<h3>

${mapel}

</h3>

<button

id="${id}"

class="statusBtn
${

status==="OPEN"

?

"green"

:

"red"

}"

>

${status}

</button>

</div>

`

}



const btn=

document.getElementById(id)

if(btn){

btn.innerText=
status

btn.className=

`statusBtn
${

status==="OPEN"

?

"green"

:

"red"

}`

btn.onclick=()=>{

toggleExam(
mapel,
status
)

}

}

}

)

}

)

}



//////////////////////////////////////////////////////
// TOGGLE
//////////////////////////////////////////////////////

window.toggleExam=
async function(

mapel,
status

){

const newStatus=

status==="OPEN"

?

"CLOSED"

:

"OPEN"

try{

await setDoc(

doc(
db,
"exam_control",
mapel
),

{

status:newStatus

},

{

merge:true

}

)

}

catch(err){

console.error(err)

alert(err.message)

}

}



//////////////////////////////////////////////////////
// OPEN ALL
//////////////////////////////////////////////////////

window.openAllExam=
async function(){

for(

const mapel
of
mapelList

){

await setDoc(

doc(
db,
"exam_control",
mapel
),

{

status:"OPEN"

},

{

merge:true

}

)

}

alert(
"SEMUA UJIAN DIBUKA"
)

}



//////////////////////////////////////////////////////
// CLOSE ALL
//////////////////////////////////////////////////////

window.closeAllExam=
async function(){

for(

const mapel
of
mapelList

){

await setDoc(

doc(
db,
"exam_control",
mapel
),

{

status:"CLOSED"

},

{

merge:true

}

)

}

alert(
"SEMUA UJIAN DITUTUP"
)

}



//////////////////////////////////////////////////////
// LOAD
//////////////////////////////////////////////////////

loadControlPanel()
