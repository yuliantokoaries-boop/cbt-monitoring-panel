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
