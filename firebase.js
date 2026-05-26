import { initializeApp }
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {

getFirestore,
collection,
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
// FIREBASE CONFIG
/////////////////////////////////////////////////

const firebaseConfig={

apiKey:"AIzaSyB7D9fM_Twg04mNnPIOhLZLq56as255wzc",

authDomain:"asat-2026.firebaseapp.com",

projectId:"asat-2026",

storageBucket:"asat-2026.appspot.com",

messagingSenderId:"99708731765",

appId:"1:99708731765:web:3fc4914a6264ffe2ee533c"

};

const app=
initializeApp(firebaseConfig);

const db=
getFirestore(app);

/////////////////////////////////////////////////
// MAPEL LIST
/////////////////////////////////////////////////

const mapelList=[

"Bahasa Indonesia",
"Bahasa Inggris",
"Bahasa Jawa",
"IPAS",
"Matematika",
"PJOK",
"Seni Rupa",
"Agama"

];

/////////////////////////////////////////////////
// REALTIME MONITORING
/////////////////////////////////////////////////

const tbody=
document.getElementById("tableBody");

const onlineCount=
document.getElementById("onlineCount");

onSnapshot(

collection(db,"login_status"),

(snapshot)=>{

tbody.innerHTML="";

let online=0;

snapshot.forEach((d)=>{

const data=d.data();

if(
data.status==="ONLINE"||
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

tbody.innerHTML+=`

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

onlineCount.innerText=
online;

}

);

/////////////////////////////////////////////////
// PANEL CONTROL
/////////////////////////////////////////////////

const controlPanel=
document.getElementById(
"controlPanel"
);

function loadControlPanel(){

controlPanel.innerHTML="";

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

controlPanel.innerHTML+=`

<div class="controlCard">

<h3>${mapel}</h3>

<button

onclick="toggleExam('${mapel}')"

style="background:${
status==="OPEN"
?
'green'
:
'red'
}"

>

${status}

</button>

</div>

`;

});

});

}

window.toggleExam=
async function(mapel){

const ref=
doc(
db,
"exam_control",
mapel
);

const snap=
await getDoc(ref);

const current=

snap.data()?.status
||
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

};

loadControlPanel();

/////////////////////////////////////////////////
// CSV UPLOAD FINAL
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
// INSERT NEW USERS
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
String(cols[0]).trim();

const password=
String(cols[1]).trim();

const nama=
String(cols[2]).trim();

const kelas=
String(cols[3]).trim();

const agama=
String(cols[4]).trim();

const sekolah=
String(cols[5]).trim();

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
"UPLOAD GAGAL"
);

}

};
