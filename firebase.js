import { initializeApp }
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js"

import {
getFirestore,
collection,
onSnapshot
}
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js"

const firebaseConfig = {

apiKey:"APIKEY_ANDA",
authDomain:"PROJECT.firebaseapp.com",
projectId:"PROJECT_ID_ANDA",
storageBucket:"PROJECT.appspot.com",
messagingSenderId:"SENDER_ID_ANDA",
appId:"APP_ID_ANDA"

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
