// FIREBASE IMPORT

import { initializeApp }
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js"

import {

getFirestore,
collection,
onSnapshot,
doc,
setDoc,
getDoc,
writeBatch

}

from
"https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js"



////////////////////////////////////////////////////////
// CONFIG
////////////////////////////////////////////////////////

const firebaseConfig={

apiKey:"AIzaSyB7D9fM_Twg04WNnPIOhLZLq56as255wzc",

authDomain:"asat-2026.firebaseapp.com",

projectId:"asat-2026",

storageBucket:"asat-2026.firebasestorage.app",

messagingSenderId:"99708731765",

appId:"1:99708731765:web:3fc4914a6264ffe2ee533c"

}

const app=
initializeApp(firebaseConfig)

const db=
getFirestore(app)



////////////////////////////////////////////////////////
// MAPEL
////////////////////////////////////////////////////////

const mapelList=[

"Bahasa Indonesia",
"Pancasila",
"Bahasa Inggris",
"Bahasa Jawa",
"IPAS",
"Matematika",
"PJOK",
"Seni Rupa",
"Agama"

]



////////////////////////////////////////////////////////
// LOGIN STATUS REALTIME
////////////////////////////////////////////////////////

const tbody=
document.getElementById("tableBody")

const onlineCount=
document.getElementById("onlineCount")

onSnapshot(

collection(
db,
"login_status"
),

(snapshot)=>{

tbody.innerHTML=""

let online=0

snapshot.forEach((d)=>{

const data=d.data()

if(

data.status==="ONLINE"
||
data.status==="UJIAN"

){

online++

}

let waktu="-"

if(data.waktu?.seconds){

waktu=

new Date(
data.waktu.seconds*1000
)

.toLocaleTimeString(
'id-ID'
)

}

tbody.innerHTML += `

<tr>

<td>${d.id}</td>

<td>${data.nama||"-"}</td>

<td>${data.kelas||"-"}</td>

<td style="color:red;font-weight:bold">

${data.status||"-"}

</td>

<td>${data.mapel||"-"}</td>

<td>${waktu}</td>

</tr>

`

})

onlineCount.innerText=
online

}

)



////////////////////////////////////////////////////////
// PANEL CONTROL
////////////////////////////////////////////////////////

const controlPanel=
document.getElementById(
"controlPanel"
)

function loadControlPanel(){

controlPanel.innerHTML=""

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
"btn_"+
mapel.replaceAll(
" ",
"_"
)

if(
!document.getElementById(id)
){

controlPanel.innerHTML += `

<div class="controlCard">

<h3>${mapel}</h3>

<button
id="${id}"
class="statusBtn">

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

btn.style.background=

status==="OPEN"

?

"#16a34a"

:

"#dc2626"

btn.onclick=()=>{

toggleExam(mapel)

}

}

})

})

}



////////////////////////////////////////////////////////
// TOGGLE
////////////////////////////////////////////////////////

window.toggleExam=
async function(mapel){

try{

const ref=
doc(
db,
"exam_control",
mapel
)

const snap=
await getDoc(ref)

const current=

snap.data()?.status
||
"CLOSED"

const newStatus=

current==="OPEN"

?

"CLOSED"

:

"OPEN"

await setDoc(

ref,

{
status:newStatus
},

{
merge:true
}

)

}
catch(err){

console.log(err)

alert(
"GAGAL UPDATE STATUS"
)

}

}



////////////////////////////////////////////////////////
// OPEN ALL
////////////////////////////////////////////////////////

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



////////////////////////////////////////////////////////
// CLOSE ALL
////////////////////////////////////////////////////////

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



////////////////////////////////////////////////////////
// UPLOAD PESERTA CSV
////////////////////////////////////////////////////////

window.uploadPeserta=
async function(){

try{

const file=

document
.getElementById(
"csvFile"
)
.files[0]

if(!file){

alert(
"Pilih file CSV."
)

return

}

const text=
await file.text()

const rows=
text
.trim()
.split(/\r?\n/)

const batch=
writeBatch(db)

let total=0

for(
let i=1;
i<rows.length;
i++
){

const cols=
rows[i]
.split(",")

if(
cols.length<6
)
continue

const username=
cols[0].trim()

const password=
cols[1].trim()

const nama=
cols[2].trim()

const kelas=
cols[3].trim()

const agama=
cols[4].trim()

const sekolah=
cols[5].trim()

batch.set(

doc(
db,
"users",
username
),

{

username:username,

password:password,

nama:nama,

kelas:kelas,

agama:agama,

sekolah:sekolah,

login:false,

status_ujian:"BELUM_MULAI"

}

)

total++

}

await batch.commit()

document
.getElementById(
"uploadStatus"
)
.innerText=

"✅ Upload berhasil : "
+
total
+
" peserta"

alert(
"UPLOAD BERHASIL"

)

}
catch(err){

console.error(err)

alert(
"UPLOAD GAGAL"

)

}

}



////////////////////////////////////////////////////////
// START
////////////////////////////////////////////////////////

loadControlPanel()
