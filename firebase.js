import { initializeApp }
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js"

import {
getFirestore,
collection,
onSnapshot
}
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js"

const firebaseConfig = {

apiKey:"AIzaSyB7D9fM_Twg04mNnPIOhLZLq56as255wzc",
authDomain:"asat-2026.firebaseapp.com",
projectId:"asat-2026",
storageBucket:"asat-2026.firebasestorage.app",
messagingSenderId:"99708731765",
appId:"1:99708731765:web:3fc4914a6264ffe2ee533c"

}

const app =
initializeApp(firebaseConfig)

const db =
getFirestore(app)

const table =
document.getElementById(
"tableBody"
)

console.log("Firebase CONNECTED")

onSnapshot(

collection(
db,
"login_status"
),

(snapshot)=>{

console.log(
"JUMLAH DATA = ",
snapshot.size
)

table.innerHTML=""

snapshot.forEach((doc)=>{

const data =
doc.data()

console.log(
"DOC:",
doc.id,
data
)

table.innerHTML += `

<tr>

<td>${doc.id}</td>

<td>${data.nama||'-'}</td>

<td>${data.kelas||'-'}</td>

<td>${data.status||'-'}</td>

<td>${data.mapel||'-'}</td>

</tr>

`

})

}

)
