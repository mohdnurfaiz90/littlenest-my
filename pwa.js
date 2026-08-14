let deferredInstallPrompt = null;
const isStandalone = () => matchMedia("(display-mode: standalone)").matches || navigator.standalone === true;

function showInstallHelp() {
  document.getElementById("install-help-dialog")?.remove();
  const dialog = document.createElement("dialog");
  dialog.id = "install-help-dialog";
  dialog.className = "install-help-dialog";
  dialog.innerHTML = `<div><img src="assets/littlenest-logo.png" alt=""><h2>${isStandalone()?"Manager sudah dipasang":"Pasang LittleNest Manager"}</h2><p>${isStandalone()?"LittleNest Manager sudah dibuka sebagai aplikasi.":"Dalam Chrome, tekan menu tiga titik dan pilih Install app atau Create shortcut. Pada telefon, pilih Add to Home screen."}</p><button>Faham</button></div>`;
  document.body.append(dialog);
  dialog.querySelector("button").onclick=()=>dialog.close();
  dialog.addEventListener("close",()=>dialog.remove());
  dialog.showModal();
}

async function requestInstall(){
  if(isStandalone()||!deferredInstallPrompt)return showInstallHelp();
  deferredInstallPrompt.prompt();
  await deferredInstallPrompt.userChoice;
  deferredInstallPrompt=null;
}
document.addEventListener("click",e=>{if(e.target.closest("[data-install-app]"))requestInstall();});
window.addEventListener("beforeinstallprompt",e=>{e.preventDefault();deferredInstallPrompt=e;});
if("serviceWorker" in navigator)window.addEventListener("load",()=>navigator.serviceWorker.register("service-worker.js").catch(()=>{}));
