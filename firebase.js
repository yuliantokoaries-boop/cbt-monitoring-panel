import { initializeApp }
from
"https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
getFirestore,
collection,
onSnapshot
}
from
"https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {

apiKey:"PASTE_APIKEY",

authDomain:"asat-2026.firebaseapp.com",

projectId:"asat-2026",

storageBucket:"asat-2026.appspot.com",

messagingSenderId:"99708731765",

appId:"PASTE_APPID"

};

const app =
initializeApp(firebaseConfig);

const db =
getFirestore(app);

const tableBody =
document.getElementById(
"tableBody"
);

onSnapshot(

collection(
db,
"login_status"
),

(snapshot)=>{

tableBody.innerHTML="";

snapshot.forEach(

(doc)=>{

const data =
doc.data();

tableBody.innerHTML +=`

<tr>

<td>${doc.id}</td>

<td>${data.nama || ""}</td>

<td>${data.sekolah || ""}</td>

<td>${data.kelas || ""}</td>

<td class="online">
${data.status || ""}
</td>

<td>
${data.mapel || "-"}
</td>

<td>
${data.waktu?.toDate()
.toLocaleString() || ""}
</td>

</tr>

`;

}

)

}

)
