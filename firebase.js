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
authDomain:"PROJECT.firebaseapp.com",
projectId:"asat-2026",
storageBucket:"PROJECT.appspot.com",
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

onSnapshot(

collection(
db,
"login_status"
),

(snapshot)=>{

table.innerHTML=""

snapshot.forEach((doc)=>{

const data =
doc.data()

table.innerHTML += `

<tr>

<td>${doc.id}</td>

<td>${data.nama||'-'}</td>

<td>${data.kelas||'-'}</td>

<td class="ujian">

${data.status||'-'}

</td>

<td>

${data.mapel||'-'}

</td>

</tr>

`

})

}

)
