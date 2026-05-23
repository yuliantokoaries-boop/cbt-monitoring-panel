import { initializeApp }
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js"

import {
getFirestore,
collection,
onSnapshot
}
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js"

const firebaseConfig={

apiKey:"AIzaSyB7D9fM_Twg04mNnPIOhLZLq56as255wzc",

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

const table=
document.getElementById(
"tableBody"
)

const totalOnline=
document.getElementById(
"totalOnline"
)

const searchBox=
document.getElementById(
"search"
)

const kelasFilter=
document.getElementById(
"kelasFilter"
)

let allData=[]

function renderData(){

table.innerHTML=""

const keyword=
searchBox.value
.toLowerCase()

const kelas=
kelasFilter.value

let onlineCount=0

allData

.filter(item=>{

const cocokSearch=

item.username
.toLowerCase()
.includes(keyword)

||

(item.nama||"")
.toLowerCase()
.includes(keyword)

const cocokKelas=

kelas==""

||

item.kelas==kelas

return cocokSearch
&&
cocokKelas

})

.forEach(item=>{

if(
item.status=="ONLINE"
||
item.status=="UJIAN"
){

onlineCount++

}

table.innerHTML += `

<tr>

<td>${item.username}</td>

<td>${item.nama||'-'}</td>

<td>${item.kelas||'-'}</td>

<td>

<span class="${
item.status=="UJIAN"
?
'ujian'
:
'online'
}">

${item.status||'-'}

</span>

</td>

<td>${item.mapel||'-'}</td>

<td>

${

item.waktu

?

new Date(
item.waktu.seconds*1000
).toLocaleTimeString()

:

'-'

}

</td>

</tr>

`

})

totalOnline.innerText=

"ONLINE : "
+
onlineCount

}

onSnapshot(

collection(
db,
"login_status"
),

(snapshot)=>{

allData=[]

snapshot.forEach((doc)=>{

allData.push({

username:doc.id,

...doc.data()

})

})

renderData()

}

)

searchBox.addEventListener(
"input",
renderData
)

kelasFilter.addEventListener(
"change",
renderData
)
document

.getElementById(
"exportBtn"
)

.addEventListener(

"click",

()=>{

let csv=

"Username,Nama,Kelas,Status,Mapel\n"

allData.forEach(item=>{

csv +=

`${item.username},${item.nama||''},${item.kelas||''},${item.status||''},${item.mapel||''}\n`

})

const blob=

new Blob([csv])

const url=

URL.createObjectURL(blob)

const a=
document.createElement("a")

a.href=url

a.download=

"cbt-monitoring.csv"

a.click()

}
)
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

const controlPanel=

document.getElementById(
"controlPanel"
)

function loadControlPanel(){

controlPanel.innerHTML=""

mapelList.forEach(

(mapel)=>{

db.collection(
"exam_control"
)

.doc(mapel)

.onSnapshot(

(doc)=>{

const data=
doc.data()||{}

const status=

data.status
||
"CLOSED"

renderCard(

mapel,
status

)

}

)

}

)

}

function renderCard(

mapel,
status

){

let color=

status=="OPEN"

?
"#2E7D32"

:
"#C62828"

controlPanel.innerHTML +=`

<div style="

background:white;
padding:16px;
margin:10px 0;
border-radius:12px;
box-shadow:0 2px 6px rgba(0,0,0,0.1);

">

<h3>

${mapel}

</h3>

<button

style="

background:${color};
color:white;
padding:10px 20px;
border:none;
border-radius:10px;
cursor:pointer;

"

onclick="toggleExam(

'${mapel}',
'${status}'

)"

>

${status}

</button>

</div>

`

}

window.toggleExam=

function(

mapel,
status

){

const newStatus=

status=="OPEN"

?

"CLOSED"

:

"OPEN"

db.collection(
"exam_control"
)

.doc(mapel)

.update({

status:newStatus

})

}

window.openAll=()=>{

mapelList.forEach(

(mapel)=>{

db.collection(
"exam_control"
)

.doc(mapel)

.update({

status:"OPEN"}

)

}

)

}

window.closeAll=()=>{

mapelList.forEach(

(mapel)=>{

db.collection(
"exam_control"
)

.doc(mapel)

.update({

status:"CLOSED"}

)

}

)

}

loadControlPanel()
