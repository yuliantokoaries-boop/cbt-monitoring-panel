import { initializeApp }
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {

getFirestore,
collection,
query,
orderBy,
limit,
onSnapshot,
doc,
setDoc,
getDoc,
writeBatch,
getDocs

}

from
"https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

/////////////////////////////////////////////////
// CONFIG
/////////////////////////////////////////////////

const firebaseConfig={

apiKey:"AIzaSyB7D9fM_Twg04mNnPIOhLZLq56as255wzc",

authDomain:"asat-2026.firebaseapp.com",

projectId:"asat-2026",

storageBucket:"asat-2026.firebasestorage.app",

messagingSenderId:"99708731765",

appId:"1:99708731765:web:3fc4914a6264ffe2ee533c"

};

const app=
initializeApp(firebaseConfig);

const db=
getFirestore(app);

/////////////////////////////////////////////////
// MAPEL
/////////////////////////////////////////////////

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

];

/////////////////////////////////////////////////
// FAST MONITORING
/////////////////////////////////////////////////

const tbody=
document.getElementById(
"tableBody"
);

const onlineCount=
document.getElementById(
"onlineCount"
);

const loginQuery=

query(

collection(
db,
"login_status"
),

orderBy(
"waktu",
"desc"
),

limit(200)

);

onSnapshot(

loginQuery,

(snapshot)=>{

let html="";

let online=0;

snapshot.forEach((d)=>{

const data=d.data();

if(
data.status==="ONLINE"
||
data.status==="UJIAN"
){
online++;
}

let waktu="-";

if(data.waktu?.seconds){

waktu=

new Date(
data.waktu.seconds*1000
)

.toLocaleTimeString(
'id-ID'
);

}

html += `

<tr>

<td>${d.id}</td>

<td>${data.nama||"-"}</td>

<td>${data.kelas||"-"}</td>

<td>${data.status||"-"}</td>

<td>${data.mapel||"-"}</td>

<td>${waktu}</td>

</tr>

`;

});

tbody.innerHTML=
html;

onlineCount.innerText=
online;

}

);

/////////////////////////////////////////////////
// FAST PANEL CONTROL
/////////////////////////////////////////////////

const controlPanel=
document.getElementById(
"controlPanel"
);

onSnapshot(

collection(
db,
"exam_control"
),

(snapshot)=>{

let html="";

const firebaseMapel={};

snapshot.forEach((d)=>{

firebaseMapel[d.id]=
d.data().status||
"CLOSED";

});

mapelList.forEach((mapel)=>{

const status=

firebaseMapel[mapel]
||
"CLOSED";

html += `

<div class="controlCard">

<h3>${mapel}</h3>

<button

onclick="toggleExam('${mapel}')"

style="
background:${
status==="OPEN"
?
'#16a34a'
:
'#dc2626'
};
color:white;
padding:12px;
border:none;
border-radius:8px;
cursor:pointer;
font-weight:bold;
width:100%;
"

>

${status}

</button>

</div>

`;

});

controlPanel.innerHTML=
html;

}

);

/////////////////////////////////////////////////
// TOGGLE
/////////////////////////////////////////////////

window.toggleExam=
async function(mapel){

try{

const ref=
doc(
db,
"exam_control",
mapel
);

const snap=
await getDoc(ref);

const current=

snap.exists()

?

snap.data().status

:

"CLOSED";

const next=

current==="OPEN"

?

"CLOSED"

:

"OPEN";

await setDoc(

ref,

{
status:next
},

{
merge:true
}

);

}
catch(err){

console.error(err);

alert(
"Gagal update status"
);

}

};

/////////////////////////////////////////////////
// CREATE MAPEL AUTO
/////////////////////////////////////////////////

async function initMapel(){

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

);

}

}

initMapel();

/////////////////////////////////////////////////
// FAST CSV UPLOAD
/////////////////////////////////////////////////

window.uploadPeserta=
async function(){

try{

const file=

document
.getElementById(
"csvFile"
)
.files[0];

if(!file){

alert(
"Pilih file CSV"
);

return;

}

const text=
await file.text();

const rows=

text
.trim()
.split(/\r?\n/);

const batch=
writeBatch(db);

const oldUsers=

await getDocs(

collection(
db,
"users"
)

);

oldUsers.forEach((d)=>{

batch.delete(

doc(
db,
"users",
d.id
)

);

});

let total=0;

for(

let i=1;

i<rows.length;

i++

){

const cols=

rows[i].includes(";")

?

rows[i].split(";")

:

rows[i].split(",");

if(
cols.length<6
)
continue;

const username=
cols[0].trim();

const password=
cols[1].trim();

const nama=
cols[2].trim();

const kelas=
cols[3].trim();

const agama=
cols[4].trim();

const sekolah=
cols[5].trim();

batch.set(

doc(
db,
"users",
username
),

{

username,
password,
nama,
kelas,
agama,
sekolah,
login:false,
status_ujian:
"BELUM_MULAI"

}

);

total++;

}

await batch.commit();

alert(

"UPLOAD BERHASIL : "

+

total

+

" peserta"

);

}
catch(err){

console.error(err);

alert(
"UPLOAD GAGAL : "
+
err.message
);

}

};
