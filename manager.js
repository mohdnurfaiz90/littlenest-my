import{CATEGORIES,storageMode,signIn,listProducts,makeCode,saveProduct,updateProduct,deleteProduct,uploadProductImage,resolveAffiliateMetadata,detectPlatform}from"./data-service.js?v=7";

const $=id=>document.getElementById(id);
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));
const money=n=>n===null||n===""||!Number.isFinite(Number(n))?"Semak harga":`RM ${Number(n).toFixed(2)}`;
const sourceLabel={own:"Barang sendiri",shopee:"Shopee",tiktok:"TikTok"};
let products=[],token=sessionStorage.getItem("littlenest-token")||"",selectedCategory="Semua",editing=null,pendingDelete=null,imageUrl="",metadataStatus="manual";
const loginScreen=$("login-screen"),app=$("manager-app"),list=$("manager-list"),drawer=$("product-drawer"),backdrop=$("drawer-backdrop"),form=$("product-form");

function toast(message,type="ok"){const el=$("toast");el.textContent=message;el.className=`toast show ${type}`;setTimeout(()=>el.className="toast",3000);}
function getSource(){return form.querySelector('input[name="source-type"]:checked')?.value||"own";}
function showApp(email="Pemilik Kedai"){loginScreen.classList.add("hidden");app.classList.remove("hidden");$("manager-email").textContent=email;load();}
async function load(){try{products=await listProducts({includeHidden:true});render();}catch(e){toast(e.message,"error");}}
function renderTabs(){const tabs=$("manager-tabs");tabs.innerHTML=CATEGORIES.map(x=>`<button class="${x===selectedCategory?"active":""}" data-category="${esc(x)}">${esc(x)}</button>`).join("");}
function sourceBadge(item){const source=item.source_type||"own";return `<span class="source-badge ${source}">${esc(sourceLabel[source]||source)}</span>`;}
function render(){
  renderTabs();
  const q=$("manager-search").value.trim().toLowerCase();
  const visible=products.filter(x=>(selectedCategory==="Semua"||x.category===selectedCategory)&&(!q||`${x.name} ${x.code}`.toLowerCase().includes(q)));
  $("manager-count").textContent=products.length;
  list.innerHTML=visible.map(item=>{
    const source=item.source_type||"own";
    const sourceCell=source==="own"?`<div class="stock-control"><button data-action="stock-down" aria-label="Kurangkan stok">−</button><b>${Number(item.stock)||0}</b><button data-action="stock-up" aria-label="Tambah stok">＋</button></div>`:sourceBadge(item);
    return `<article class="manager-row" data-id="${esc(item.id)}"><div class="manager-product"><img src="${esc(item.image_url||"assets/littlenest-logo.png")}" alt=""><div><small>${esc(item.code)}</small><strong>${esc(item.name)}</strong>${sourceBadge(item)}</div></div><strong class="row-price">${money(item.price)}</strong>${sourceCell}<span>${esc(item.category)}</span><span class="status ${item.active?"active":"hidden-status"}">${item.active?"Dipaparkan":"Disorok"}</span><div class="row-actions"><button data-action="edit">Edit</button><button data-action="toggle">${item.active?"Sorok":"Papar"}</button><button class="delete" data-action="delete">Buang</button></div></article>`;
  }).join("");
  $("manager-empty").classList.toggle("hidden",visible.length>0);
}

function setSource(source,{clear=false}={}){
  const radio=form.querySelector(`input[name="source-type"][value="${source}"]`);if(radio)radio.checked=true;
  const affiliate=source!=="own";
  $("affiliate-link-panel").classList.toggle("hidden",!affiliate);
  $("stock-field").classList.toggle("hidden",affiliate);
  $("price-current-field").classList.toggle("hidden",!affiliate);
  $("image-url-field").classList.toggle("hidden",!affiliate);
  $("product-stock").required=!affiliate;
  $("product-price").required=!affiliate;
  $("product-url").required=affiliate;
  $("lookup-note").className="lookup-note";
  $("lookup-note").textContent=affiliate?"Sistem akan cuba cari gambar, nama dan harga. Abg masih boleh semak atau betulkan.":"";
  if(clear){$("product-url").value="";$("price-current").checked=affiliate;metadataStatus=affiliate?"pending":"manual";}
}

function openDrawer(item=null){
  editing=item;imageUrl=item?.image_url||"";metadataStatus=item?.metadata_status||"manual";
  $("drawer-title").textContent=item?"Edit Barang":"Tambah Barang";
  $("product-id").value=item?.id||"";$("product-code").value=item?.code||"";$("product-name").value=item?.name||"";
  $("product-category").value=item?.category||"Baju";$("product-price").value=item?.price??"";$("product-stock").value=item?.stock??1;
  $("product-url").value=item?.external_url||"";$("product-image-url").value=item?.image_url||"";$("price-current").checked=item?.price==null;
  $("product-active").checked=item?.active??true;setSource(item?.source_type||"own");updatePreview();
  drawer.classList.add("open");drawer.setAttribute("aria-hidden","false");backdrop.classList.remove("hidden");
}
function closeDrawer(){drawer.classList.remove("open");drawer.setAttribute("aria-hidden","true");backdrop.classList.add("hidden");form.reset();editing=null;imageUrl="";metadataStatus="manual";setSource("own");updatePreview();}
function updatePreview(){const box=$("image-preview");box.classList.toggle("hidden",!imageUrl);if(imageUrl)box.querySelector("img").src=imageUrl;}

$("product-category").innerHTML=CATEGORIES.filter(x=>x!=="Semua").map(x=>`<option>${x}</option>`).join("");
$("login-form").addEventListener("submit",async e=>{e.preventDefault();const note=$("login-note");note.textContent="Sedang log masuk…";try{const data=await signIn($("login-email").value,$("login-password").value);token=data.access_token;sessionStorage.setItem("littlenest-token",token);sessionStorage.setItem("littlenest-email",data.user?.email||$("login-email").value);showApp(data.user?.email);note.textContent="";}catch(err){note.textContent=err.message;}});
$("logout-button").onclick=()=>{sessionStorage.removeItem("littlenest-token");sessionStorage.removeItem("littlenest-email");location.reload();};
$("add-product").onclick=()=>openDrawer();$("close-drawer").onclick=closeDrawer;$("cancel-product").onclick=closeDrawer;backdrop.onclick=closeDrawer;
$("manager-tabs").addEventListener("click",e=>{const b=e.target.closest("[data-category]");if(!b)return;selectedCategory=b.dataset.category;render();});$("manager-search").addEventListener("input",render);
$("source-selector").addEventListener("change",()=>setSource(getSource(),{clear:true}));
$("product-file").addEventListener("change",e=>{const file=e.target.files[0];if(file){imageUrl=URL.createObjectURL(file);updatePreview();}});
$("product-image-url").addEventListener("input",e=>{if(e.target.value.trim()){imageUrl=e.target.value.trim();updatePreview();}});
$("remove-image").onclick=()=>{imageUrl="";$("product-file").value="";$("product-image-url").value="";updatePreview();};

$("lookup-product").onclick=async()=>{
  const button=$("lookup-product"),note=$("lookup-note"),url=$("product-url").value.trim(),source=getSource();
  if(!url)return toast("Tampal link produk dahulu","error");
  const detected=detectPlatform(url);if(!detected)return toast("Link mesti daripada Shopee atau TikTok","error");
  if(detected!==source){setSource(detected);toast(`Sistem menukar pilihan kepada ${sourceLabel[detected]}`);}
  button.disabled=true;button.innerHTML="<span>◌</span> Sedang mencari…";note.className="lookup-note loading";note.textContent="Sedang membaca maklumat produk…";
  try{
    const data=await resolveAffiliateMetadata(url,token);
    if(data.name)$("product-name").value=data.name;if(data.price!=null){$("product-price").value=data.price;$("price-current").checked=false;}else{$("price-current").checked=true;}
    if(data.image_url){imageUrl=data.image_url;$("product-image-url").value=data.image_url;updatePreview();}
    metadataStatus=data.status||"fetched";note.className=`lookup-note ${metadataStatus==="fetched"?"success":"warning"}`;
    note.textContent=metadataStatus==="fetched"?"Maklumat berjaya ditemui. Sila semak sebelum simpan.":"Sebahagian maklumat tidak dapat dibaca. Isi atau betulkan ruangan yang masih kosong.";
  }catch(err){metadataStatus="failed";note.className="lookup-note warning";note.textContent=`Carian automatik belum berjaya: ${err.message}. Abg boleh isi maklumat secara manual.`;toast("Ruangan manual telah dibuka","error");}
  finally{button.disabled=false;button.innerHTML="<span>✦</span> Cari semula";}
};

form.addEventListener("submit",async e=>{
  e.preventDefault();const save=$("save-product"),source=getSource();save.disabled=true;save.textContent="Menyimpan…";
  try{
    const category=$("product-category").value,file=$("product-file").files[0],externalUrl=$("product-url").value.trim();
    if(source!=="own"&&detectPlatform(externalUrl)!==source)throw new Error(`Masukkan link ${sourceLabel[source]} yang sah`);
    if(!$("product-name").value.trim())throw new Error("Nama produk masih kosong. Tekan cari atau isi nama secara manual.");
    if(source!=="own"&&!$("price-current").checked&&$("product-price").value==="")throw new Error("Isi harga atau tandakan ‘Harga berubah-ubah’");
    if(file)imageUrl=await uploadProductImage(file,token);
    const currentPrice=source!=="own"&&$("price-current").checked;
    const product={id:editing?.id,code:$("product-code").value.trim()||makeCode(category,products),name:$("product-name").value.trim(),category,price:currentPrice?null:Number($("product-price").value),stock:source==="own"?Number($("product-stock").value):null,image_url:imageUrl||$("product-image-url").value.trim(),active:$("product-active").checked,position:editing?.position||products.length+1,source_type:source,external_url:source==="own"?null:externalUrl,metadata_status:source==="own"?"manual":metadataStatus,last_checked_at:source==="own"?null:new Date().toISOString()};
    await saveProduct(product,token);closeDrawer();await load();toast("Barang berjaya disimpan");
  }catch(err){toast(err.message,"error");}finally{save.disabled=false;save.textContent="Simpan Barang";}
});

list.addEventListener("click",async e=>{const button=e.target.closest("[data-action]");if(!button)return;const item=products.find(x=>String(x.id)===button.closest("[data-id]").dataset.id);if(!item)return;const action=button.dataset.action;if(action==="edit")return openDrawer(item);if(action==="delete"){pendingDelete=item;$("confirm-modal").classList.remove("hidden");return;}try{if(action==="toggle")await updateProduct(item.id,{active:!item.active},token);if(action==="stock-up"&&(!item.source_type||item.source_type==="own"))await updateProduct(item.id,{stock:Number(item.stock)+1},token);if(action==="stock-down"&&(!item.source_type||item.source_type==="own"))await updateProduct(item.id,{stock:Math.max(0,Number(item.stock)-1)},token);await load();toast("Perubahan disimpan");}catch(err){toast(err.message,"error");}});
$("cancel-delete").onclick=()=>{$("confirm-modal").classList.add("hidden");pendingDelete=null;};$("confirm-delete").onclick=async()=>{if(!pendingDelete)return;try{await deleteProduct(pendingDelete.id,token);$("confirm-modal").classList.add("hidden");pendingDelete=null;await load();toast("Barang telah dibuang");}catch(err){toast(err.message,"error");}};
renderTabs();setSource("own");if(token||storageMode==="demo")showApp(sessionStorage.getItem("littlenest-email")||"Pratonton Setempat");
