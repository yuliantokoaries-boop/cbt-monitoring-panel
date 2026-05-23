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

const firebaseConfig = {

apiKey: "AIzaSyB7D9fM_Twg04mNnPIOhLZLq56as255wzc",

authDomain: "asat-2026.firebaseapp.com",

projectId: "asat-2026",

storageBucket: "asat-2026.firebasestorage.app",

messagingSenderId: "99708731765",

appId: "1:99708731765:web:3fc4914a6264ffe2ee533c"

}



//////////////////////////////////////////////////////
// INIT FIREBASE
//////////////////////////////////////////////////////

const app =
initializeApp(
firebaseConfig
)

const db =
getFirestore(app)



//////////////////////////////////////////////////////
// MAPEL LIST
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
// REALTIME LOGIN STATUS
//////////////////////////////////////////////////////

const tbody =
document.getElementById(
"tableBody"
)

const onlineCount =
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

tbody.innerHTML +=`

<tr>

<td>${docu.id}</td>

<td>${data.nama||"-"}</td>

<td>${data.kelas||"-"}</td>

<td style="color:red;font-weight:bold">

${data.status||"-"}

</td>

<td>${data.mapel||"-"}</td>

<td>

${data.waktu
?
new Date(
data.waktu.seconds*1000
).toLocaleTimeString()
:
"-"}

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

const id=
"btn_"+mapel
.replaceAll(" ","_")

if(
!document.getElementById(id)
){

controlDiv.innerHTML +=`

<div style="margin:12px">

<h3>${mapel}</h3>

<button

id="${id}"

onclick="toggleExam(

'${mapel}',

'${status}'

)"

style="

padding:10px 20px;

border:none;

border-radius:8px;

cursor:pointer;

background:

${status==="OPEN"
?
'green'
:
'red'}

;

color:white;

font-weight:bold;

"

>

${status}

</button>

</div>

`

}

else{

const btn=
document.getElementById(id)

btn.innerText=
status

btn.style.background=

status==="OPEN"
?
"green"
:
"red"

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
// TOGGLE EXAM
//////////////////////////////////////////////////////

window.toggleExam = async function(

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
// BUKA SEMUA
//////////////////////////////////////////////////////

window.openAllExam =
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
// TUTUP SEMUA
//////////////////////////////////////////////////////

window.closeAllExam =
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
// LOAD PANEL
//////////////////////////////////////////////////////

loadControlPanel()
