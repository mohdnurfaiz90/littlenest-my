import{CATEGORIES,listProducts}from"./data-service.js?v=1";
const config=window.LITTLENEST_CONFIG||{};
const grid=document.getElementById("product-grid");
const tabs=document.getElementById("category-tabs");
const search=document.getElementById("shop-search");
const count=document.getElementById("result-count");
const empty=document.getElementById("empty-state");
let products=[],category="Semua";
const icons={Semua:"♡",Baju:"♧",Mainan:"☆","Bahan Pelajaran":"▤",Makanan:"♨",Keperluan:"▢"};
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));
const money=n=>new Intl.NumberFormat("ms-MY",{style:"currency",currency:"MYR"}).format(Number(n)||0);
function whatsapp(item){const text=`Assalamualaikum, saya berminat dengan ${item.name} (Kod: ${item.code}), harga ${money(item.price)}. Masih ada stok?`;return`https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent(text)}`;}
function renderTabs(){tabs.innerHTML=CATEGORIES.map(x=>`<button class="${x===category?"active":""}" data-category="${esc(x)}"><span>${icons[x]}</span>${esc(x)}</button>`).join("");}
function render(){const q=search.value.trim().toLowerCase();const visible=products.filter(x=>(category==="Semua"||x.category===category)&&(!q||`${x.name} ${x.code}`.toLowerCase().includes(q)));count.textContent=`${visible.length} barang ditemui`;grid.innerHTML=visible.map(item=>{const sold=Number(item.stock)<=0;return`<article class="product-card ${sold?"sold-out":""}"><div class="product-image"><img src="${esc(item.image_url||"assets/littlenest-logo.png")}" alt="${esc(item.name)}" loading="lazy">${sold?'<span class="sold-label">Habis Stok</span>':""}</div><div class="product-info"><span class="product-code">${esc(item.code)}</span><h3>${esc(item.name)}</h3><strong class="product-price">${money(item.price)}</strong><p class="product-stock ${sold?"zero":""}">Stok: <b>${Number(item.stock)||0} unit</b></p><a class="whatsapp-button ${sold?"disabled":""}" ${sold?'aria-disabled="true"':`href="${whatsapp(item)}" target="_blank" rel="noopener"`}><span>◉</span>${sold?"Stok Habis":"Dapatkan"}</a></div></article>`;}).join("");empty.classList.toggle("hidden",visible.length>0);}
tabs.addEventListener("click",e=>{const button=e.target.closest("[data-category]");if(!button)return;category=button.dataset.category;renderTabs();render();});
search.addEventListener("input",render);
renderTabs();
try{products=await listProducts();render();}catch(err){count.textContent="Barang belum dapat dimuatkan";empty.classList.remove("hidden");empty.querySelector("p").textContent="Sila cuba semula sebentar lagi.";}
