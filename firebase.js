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

const kelas4Config={

apiKey:"AIzaSyAQiDpPmYwKl6lLzGSBqxDibZcoDXKSPe0",

authDomain:"asat-kelas4.firebaseapp.com",

projectId:"asat-kelas4",

storageBucket:"asat-kelas4.firebasestorage.app",

messagingSenderId:"534921636931",

appId:"1:534921636931:web:3b1bb46c8ffa6ed6d278f6"

};

const kelas5Config={

apiKey:"AIzaSyAWRhXgqPNkt1vocmQnl6Ihv6tOuOeytmo",

authDomain:"asat-kelas5.firebaseapp.com",

projectId:"asat-kelas5",

storageBucket:"asat-kelas5.firebasestorage.app",

messagingSenderId:"859842323809",

appId:"1:859842323809:web:03f2e3e125516310fb1120"

};

const controlConfig={

apiKey:"AIzaSyAB9Gi7LPB3k0l4y869FM_6TMR9bYkwTpo",

authDomain:"asat-control.firebaseapp.com",

projectId:"asat-control",

storageBucket:"asat-control.firebasestorage.app",

messagingSenderId:"154888610054",

appId:"1:154888610054:web:c9f6e6c7486644fe033e87"

};

/////////////////////////////////////////////////
// APP
/////////////////////////////////////////////////

const kelas4App=
initializeApp(
kelas4Config,
"KELAS4"
);

const kelas5App=
initializeApp(
kelas5Config,
"KELAS5"
);

const controlApp=
initializeApp(
controlConfig,
"CONTROL"
);

const kelas4DB=
getFirestore(
kelas4App
);

const kelas5DB=
getFirestore(
kelas5App
);

const controlDB=
getFirestore(
controlApp
);

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
// ELEMENT
/////////////////////////////////////////////////

const tbody=
document.getElementById(
"tableBody"
);

const onlineCount=
document.getElementById(
"onlineCount"
);

const controlPanel=
document.getElementById(
"controlPanel"
);

const searchInput=
document.getElementById(
"searchInput"
);

const kelasFilter=
document.getElementById(
"kelasFilter"
);

let allData=[];

let kelas4Cache={};

let kelas5Cache={};
/////////////////////////////////////////////////
// MERGE CACHE
/////////////////////////////////////////////////

function mergeData(){

allData=[

...Object.values(
kelas4Cache
),

...Object.values(
kelas5Cache
)

];

renderTable();

}

/////////////////////////////////////////////////
// MONITORING KELAS4
/////////////////////////////////////////////////

const kelas4Query=

query(

collection(
kelas4DB,
"login_status"
),

limit(300)

);

onSnapshot(

kelas4Query,

(snapshot)=>{

kelas4Cache={};

snapshot.forEach((d)=>{

kelas4Cache[d.id]={

id:d.id,

server:"KELAS4",

...d.data()

};

});

mergeData();

}

);

/////////////////////////////////////////////////
// MONITORING KELAS5
/////////////////////////////////////////////////

const kelas5Query=

query(

collection(
kelas5DB,
"login_status"
),

limit(300)

);

onSnapshot(

kelas5Query,

(snapshot)=>{

kelas5Cache={};

snapshot.forEach((d)=>{

kelas5Cache[d.id]={

id:d.id,

server:"KELAS5",

...d.data()

};

});

mergeData();

}

);

/////////////////////////////////////////////////
// FORMAT WAKTU
/////////////////////////////////////////////////

function formatWaktu(waktu){

if(!waktu)
return "-";

try{

if(waktu.seconds){

return new Date(

waktu.seconds*1000

).toLocaleTimeString(
"id-ID"
);

}

return new Date(
waktu
).toLocaleTimeString(
"id-ID"
);

}
catch(err){

return "-";

}

}
/////////////////////////////////////////////////
// RENDER TABLE
/////////////////////////////////////////////////

function renderTable(){

let html="";
let online=0;

const keyword =
searchInput.value.toLowerCase();

const filter =
kelasFilter.value;

let filteredData=[...allData];

if(
filteredData.length>500
&&
!keyword
){
filteredData=
filteredData.slice(0,500);
}

filteredData.forEach((d)=>{

if(
filter!=="all"
&&
d.kelas!==filter
){
return;
}

const text=(
`${d.id||""}
${d.nama||""}
${d.kelas||""}`
).toLowerCase();

if(
keyword
&&
!text.includes(keyword)
){
return;
}

if(
d.status==="ONLINE"
||
d.status==="UJIAN"
){
online++;
}

html+=`
<tr>
<td>${d.id||"-"}</td>
<td>${d.nama||"-"}</td>
<td>${d.kelas||"-"}</td>
<td>${d.server||"-"}</td>
<td>${d.status||"-"}</td>
<td>${d.mapel||"-"}</td>
<td>${formatWaktu(d.waktu)}</td>
</tr>
`;

});

tbody.innerHTML=html;
onlineCount.innerText=
onlineCount.textContent=
online;

}

/////////////////////////////////////////////////
// SEARCH FILTER
/////////////////////////////////////////////////

searchInput
.addEventListener(
"input",
renderTable
);

kelasFilter
.addEventListener(
"change",
renderTable
);
/////////////////////////////////////////////////
// PANEL CONTROL REALTIME
/////////////////////////////////////////////////

onSnapshot(

collection(
controlDB,
"exam_control"
),

(snapshot)=>{

let html="";

const mapelStatus={};

snapshot.forEach((d)=>{

mapelStatus[d.id]=

d.data().status
||
"CLOSED";

});

mapelList.forEach((mapel)=>{

const status=

mapelStatus[mapel]
||
"CLOSED";

html += `

<div class="controlCard">

<h3>

${mapel}

</h3>

<button

class="statusBtn"

onclick="toggleExam('${mapel}')"

style="

background:${
status==="OPEN"
?
'#16a34a'
:
'#dc2626'
};

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
// TOGGLE MAPEL
/////////////////////////////////////////////////

window.toggleExam=
async function(mapel){

try{

const ref=

doc(

controlDB,

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

" CLOSED"

:

"OPEN";

await setDoc(

ref,

{

status:
next.trim()

},

{

merge:true

}

);

}
catch(err){

console.error(err);

alert(
"Gagal update mapel"
);

}

};

/////////////////////////////////////////////////
// OPEN ALL
/////////////////////////////////////////////////

window.openAllExam=
async function(){

try{

for(
const mapel
of
mapelList
){

await setDoc(

doc(

controlDB,

"exam_control",

mapel

),

{

status:"OPEN"

},

{

merge:true

}

);

}

}
catch(err){

console.error(err);

}

};

/////////////////////////////////////////////////
// CLOSE ALL
/////////////////////////////////////////////////

window.closeAllExam=
async function(){

try{

for(
const mapel
of
mapelList
){

await setDoc(

doc(

controlDB,

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
catch(err){

console.error(err);

}

};

/////////////////////////////////////////////////
// INIT MAPEL SAFE
/////////////////////////////////////////////////

async function initMapel(){

for(
const mapel
of
mapelList
){

const ref=

doc(

controlDB,

"exam_control",

mapel

);

const snap=
await getDoc(ref);

if(
!snap.exists()
){

await setDoc(

ref,

{

status:"CLOSED"

}

);

}

}

}

initMapel();
/////////////////////////////////////////////////
// UPLOAD CSV PER KELAS
/////////////////////////////////////////////////

window.uploadPeserta=
async function(){

try{

const kelasUpload=

document
.getElementById(
"uploadKelas"
)
.value;

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

const db=

kelasUpload==="4"

?

kelas4DB

:

kelas5DB;

const text=
await file.text();

const rows=

text
.trim()
.split(/\r?\n/);

let batch=
writeBatch(db);

let counter=0;

/////////////////////////////////////////////////
// DELETE OLD USERS
/////////////////////////////////////////////////

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

/////////////////////////////////////////////////
// INSERT USERS
/////////////////////////////////////////////////

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

counter++;

total++;

if(
counter>=400
){

await batch.commit();

batch=
writeBatch(db);

counter=0;

}

}

if(counter>0){

await batch.commit();

}

document
.getElementById(
"uploadStatus"
)
.innerHTML=

`✅ Upload ${total} peserta
ke SERVER KELAS ${kelasUpload}`;

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

/////////////////////////////////////////////////
// EXPORT CSV
/////////////////////////////////////////////////

window.exportCSV=
function(){

let csv=

"Username,Nama,Kelas,Server,Status,Mapel,Waktu\n";

allData.forEach((d)=>{

let waktu="-";

if(
d.waktu?.seconds
){

waktu=

new Date(

d.waktu.seconds*1000

)

.toLocaleTimeString(
'id-ID'
);

}

csv +=

`${d.id||""},`

+

`${d.nama||""},`

+

`${d.kelas||""},`

+

`${d.server||""},`

+

`${d.status||""},`

+

`${d.mapel||""},`

+

`${waktu}\n`;

});

const blob=

new Blob(

[csv],

{

type:
'text/csv'

}

);

const a=

document
.createElement(
'a'
);

a.href=

URL.createObjectURL(
blob
);

a.download=

"cbt_monitoring.csv";

a.click();

};

/////////////////////////////////////////////////
// FINAL READY
/////////////////////////////////////////////////

console.log(

"✅ MULTI SERVER READY"

);
setInterval(()=>{

const now=
Date.now();

allData=

allData.filter((d)=>{

const ts=

d.waktu?.seconds
||
d.Waktu?.seconds;

if(!ts)
return true;

return(

now-

ts*1000

)

<

7200000;

});

renderTable();

},

60000);
