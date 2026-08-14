import{CATEGORIES,listProducts}from"./data-service.js?v=7";
const config=window.LITTLENEST_CONFIG||{};
const grid=document.getElementById("product-grid"),tabs=document.getElementById("category-tabs"),search=document.getElementById("shop-search"),count=document.getElementById("result-count"),empty=document.getElementById("empty-state");
let products=[],category="Semua";
const icons={Semua:"♡",Baju:"♧",Mainan:"☆","Bahan Pelajaran":"▤",Makanan:"♨",Keperluan:"▢"};
const platformNames={shopee:"Shopee",tiktok:"TikTok Shop"};
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));
const money=n=>n===null||n===""||!Number.isFinite(Number(n))?"Semak harga terkini":new Intl.NumberFormat("ms-MY",{style:"currency",currency:"MYR"}).format(Number(n));
function whatsapp(item){const text=`Assalamualaikum, saya berminat dengan ${item.name} (Kod: ${item.code}), harga ${money(item.price)}. Masih ada stok?`;return`https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent(text)}`;}
function renderTabs(){tabs.innerHTML=CATEGORIES.map(x=>`<button class="${x===category?"active":""}" data-category="${esc(x)}"><span>${icons[x]}</span>${esc(x)}</button>`).join("");}
function render(){
  const q=search.value.trim().toLowerCase(),visible=products.filter(x=>(category==="Semua"||x.category===category)&&(!q||`${x.name} ${x.code}`.toLowerCase().includes(q)));
  count.textContent=`${visible.length} barang ditemui`;
  grid.innerHTML=visible.map(item=>{
    const source=item.source_type||"own",own=source==="own",sold=own&&Number(item.stock)<=0,platform=platformNames[source]||"WhatsApp";
    const href=own?whatsapp(item):item.external_url;
    const stock=own?`<p class="product-stock ${sold?"zero":""}">Stok: <b>${Number(item.stock)||0} unit</b></p>`:`<p class="product-stock affiliate-stock">Harga dan stok terkini di ${platform}</p>`;
    const label=sold?"Stok Habis":own?"Dapatkan":`Lihat di ${platform}`;
    return `<article class="product-card ${sold?"sold-out":""}"><div class="product-image"><img src="${esc(item.image_url||"assets/littlenest-logo.png")}" alt="${esc(item.name)}" loading="lazy">${sold?'<span class="sold-label">Habis Stok</span>':source!=="own"?`<span class="platform-label ${source}">${esc(platform)}</span>`:""}</div><div class="product-info"><span class="product-code">${esc(item.code)}</span><h3>${esc(item.name)}</h3><strong class="product-price">${money(item.price)}</strong>${stock}<a class="whatsapp-button ${source} ${sold?"disabled":""}" ${sold?'aria-disabled="true"':`href="${esc(href)}" target="_blank" rel="noopener sponsored"`}><span>${own?"◉":"↗"}</span>${label}</a></div></article>`;
  }).join("");
  empty.classList.toggle("hidden",visible.length>0);
}
tabs.addEventListener("click",e=>{const button=e.target.closest("[data-category]");if(!button)return;category=button.dataset.category;renderTabs();render();});search.addEventListener("input",render);renderTabs();
try{products=await listProducts();render();}catch(err){count.textContent="Barang belum dapat dimuatkan";empty.classList.remove("hidden");empty.querySelector("p").textContent="Sila cuba semula sebentar lagi.";}
