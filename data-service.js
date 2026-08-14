const config=window.LITTLENEST_CONFIG||{};
const isLocal=["localhost","127.0.0.1"].includes(location.hostname);
const isConfigured=Boolean(config.supabaseUrl&&config.supabaseAnonKey)&&!isLocal;
const demoKey="littlenest-products-demo-v4";

export const CATEGORIES=["Semua","Baju","Mainan","Bahan Pelajaran","Makanan","Keperluan"];
export const CATEGORY_PREFIX={Baju:"BJ",Mainan:"MN","Bahan Pelajaran":"BP",Makanan:"MK",Keperluan:"KP"};
export const storageMode=isConfigured?"online":"demo";

const seed=[
  {id:"demo-1",code:"LN-BJ-001",name:"Baju Baby Romper Bunga",category:"Baju",price:29.9,stock:18,image_url:"https://images.unsplash.com/photo-1522771930-78848d9293e8?auto=format&fit=crop&w=900&q=85",active:true,position:1},
  {id:"demo-2",code:"LN-MN-002",name:"Teddy Bear Lembut 30cm",category:"Mainan",price:49.9,stock:12,image_url:"https://images.unsplash.com/photo-1559454403-b8fb88521f11?auto=format&fit=crop&w=900&q=85",active:true,position:2},
  {id:"demo-3",code:"LN-BP-003",name:"Set Alat Tulis Comel 8 dalam 1",category:"Bahan Pelajaran",price:19.9,stock:25,image_url:"https://images.unsplash.com/photo-1452860606245-08befc0ff44b?auto=format&fit=crop&w=900&q=85",active:true,position:3},
  {id:"demo-4",code:"LN-MK-004",name:"Biskut Bayi Pisang",category:"Makanan",price:12.5,stock:30,image_url:"https://images.unsplash.com/photo-1606312619070-d48b4c652a52?auto=format&fit=crop&w=900&q=85",active:true,position:4},
  {id:"demo-5",code:"LN-KP-005",name:"Beg Sandang Kanak-kanak",category:"Keperluan",price:39.9,stock:15,image_url:"https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=85",active:true,position:5},
  {id:"demo-6",code:"LN-BJ-006",name:"Dress Princess Pink",category:"Baju",price:39.9,stock:0,image_url:"https://images.unsplash.com/photo-1519457431-44ccd64a579b?auto=format&fit=crop&w=900&q=85",active:true,position:6},
  {id:"demo-7",code:"LN-KP-007",name:"Penbose 50PCS Baby Pull-ups Pants & Disposable Diaper Tape",category:"Keperluan",price:null,stock:null,image_url:"https://p16-oec-sg.ibyteimg.com/tos-alisg-i-aphluv4xwc-sg/5365a32d9eb94ee6bd544f9ef5d816f3~tplv-aphluv4xwc-resize-jpeg:800:800.jpeg?dr=15584&t=555f072d&ps=933b5bde&shp=2408c917&shcp=32ce9e9e&idc=my&from=604555543",active:true,position:7,source_type:"tiktok",external_url:"https://vt.tiktok.com/ZS9khRacqHgcy-Te6oi/",metadata_status:"fetched"},
  {id:"demo-8",code:"LN-KP-008",name:"Selimut Kanak Cartoon Soft Comforter Aircond Quilt 110x150cm",category:"Keperluan",price:null,stock:null,image_url:"https://p16-oec-sg.ibyteimg.com/tos-alisg-i-aphluv4xwc-sg/3d86af44804a4602be4fd8326bedba22~tplv-aphluv4xwc-resize-jpeg:800:800.jpeg?dr=15584&t=555f072d&ps=933b5bde&shp=2408c917&shcp=32ce9e9e&idc=my&from=604555543",active:true,position:8,source_type:"tiktok",external_url:"https://vt.tiktok.com/ZS9khRQEY5Vk1-FBx9g/",metadata_status:"fetched"},
  {id:"demo-9",code:"LN-BJ-009",name:"JC BABY Bayi Perempuan Romper Baru Lahir",category:"Baju",price:null,stock:null,image_url:"https://p16-oec-sg.ibyteimg.com/tos-alisg-i-aphluv4xwc-sg/6cc451b5f7e74ae9abe4c1d93653f796~tplv-aphluv4xwc-resize-webp:260:260.webp?dr=15582&t=555f072d&ps=933b5bde&shp=7745054a&shcp=9b759fb9&idc=my&from=2001012042",active:true,position:9,source_type:"tiktok",external_url:"https://vt.tiktok.com/ZS9khR4LeRvB9-KVDHT/",metadata_status:"fetched"},
  {id:"demo-10",code:"LN-BJ-010",name:"Sleepsuit Bayi Bunga Little Sister",category:"Baju",price:8,stock:1,image_url:"assets/products/own-baju-010-little-sister.png",active:true,position:10,source_type:"own"},
  {id:"demo-11",code:"LN-BJ-011",name:"Sleepsuit Bayi Motif Buah Pear",category:"Baju",price:8,stock:1,image_url:"assets/products/own-baju-011-pear.png",active:true,position:11,source_type:"own"},
  {id:"demo-12",code:"LN-BJ-012",name:"Romper Bayi Motif Arnab",category:"Baju",price:4,stock:1,image_url:"assets/products/own-baju-012-arnab.png",active:true,position:12,source_type:"own"},
  {id:"demo-13",code:"LN-BJ-013",name:"Romper Bayi Motif Safari",category:"Baju",price:5,stock:1,image_url:"assets/products/own-baju-013-safari.png",active:true,position:13,source_type:"own"},
  {id:"demo-14",code:"LN-BJ-014",name:"Sleepsuit Zip Bayi Motif Awan",category:"Baju",price:6,stock:1,image_url:"assets/products/own-baju-014-awan.png",active:true,position:14,source_type:"own"},
  {id:"demo-15",code:"LN-BJ-015",name:"Sleepsuit Zip Bayi Motif Kenderaan Binaan",category:"Baju",price:6,stock:1,image_url:"assets/products/own-baju-015-kenderaan.png",active:true,position:15,source_type:"own"}
];

function demoRead(){try{return JSON.parse(localStorage.getItem(demoKey))||seed;}catch{return seed;}}
function demoWrite(items){localStorage.setItem(demoKey,JSON.stringify(items));}
function headers(token){return{apikey:config.supabaseAnonKey,Authorization:`Bearer ${token||config.supabaseAnonKey}`,"Content-Type":"application/json"};}
async function api(path,options={}){const r=await fetch(`${config.supabaseUrl}${path}`,{...options,headers:{...headers(options.token),...(options.headers||{})}});const data=await r.json().catch(()=>null);if(!r.ok)throw new Error(data?.message||data?.error||data?.error_description||data?.hint||"Permintaan tidak berjaya");return data;}

export async function signIn(email,password){if(!isConfigured)return{access_token:"demo-token",user:{email:"demo@littlenest.my"},demo:true};return api("/auth/v1/token?grant_type=password",{method:"POST",body:JSON.stringify({email,password})});}
export async function listProducts({includeHidden=false}={}){if(!isConfigured)return demoRead().filter(x=>includeHidden||x.active).sort((a,b)=>a.position-b.position);const active=includeHidden?"":"&active=eq.true";return api(`/rest/v1/littlenest_products?select=*&order=position.asc,created_at.desc${active}`);}
export function makeCode(category,items=[]){const prefix=CATEGORY_PREFIX[category]||"IT";const max=items.filter(x=>x.code?.includes(`-${prefix}-`)).reduce((n,x)=>Math.max(n,Number(x.code?.split("-").pop())||0),0);return`LN-${prefix}-${String(max+1).padStart(3,"0")}`;}
export function detectPlatform(value){
  try{const host=new URL(value).hostname.toLowerCase();if(host==="shopee.com.my"||host.endsWith(".shopee.com.my")||host==="shope.ee")return"shopee";if(host==="tiktok.com"||host.endsWith(".tiktok.com")||host==="vt.tiktok.com")return"tiktok";}catch{}
  return"";
}
export async function resolveAffiliateMetadata(url,token){
  const platform=detectPlatform(url);if(!platform)throw new Error("Link mesti daripada Shopee atau TikTok");
  if(!isConfigured)return{name:`Produk ${platform==="shopee"?"Shopee":"TikTok"} — sila semak nama`,image_url:"",price:null,platform,status:"manual_required",resolved_url:url};
  return api("/functions/v1/product-metadata",{method:"POST",token,body:JSON.stringify({url})});
}
export async function saveProduct(product,token){
  if(!isConfigured){const items=demoRead();const index=items.findIndex(x=>x.id===product.id);const value={...product,id:product.id||crypto.randomUUID(),position:product.position||items.length+1,updated_at:new Date().toISOString()};if(index>=0)items[index]=value;else items.push(value);demoWrite(items);return value;}
  const source=product.source_type||"own";
  if(source!=="own"&&detectPlatform(product.external_url)!==source)throw new Error("Link affiliate tidak sepadan dengan platform");
  const value={code:product.code,name:product.name,category:product.category,price:product.price==null?null:Number(product.price),stock:source==="own"?Number(product.stock):null,image_url:product.image_url||null,active:Boolean(product.active),position:product.position||999,source_type:source,external_url:source==="own"?null:product.external_url,metadata_status:product.metadata_status||"manual",last_checked_at:product.last_checked_at||null};
  if(product.id){const rows=await api(`/rest/v1/littlenest_products?id=eq.${encodeURIComponent(product.id)}`,{method:"PATCH",token,headers:{Prefer:"return=representation"},body:JSON.stringify(value)});return rows[0];}
  const rows=await api("/rest/v1/littlenest_products",{method:"POST",token,headers:{Prefer:"return=representation"},body:JSON.stringify(value)});return rows[0];
}
export async function updateProduct(id,changes,token){if(!isConfigured){const items=demoRead();const i=items.findIndex(x=>x.id===id);if(i>=0)items[i]={...items[i],...changes};demoWrite(items);return items[i];}const rows=await api(`/rest/v1/littlenest_products?id=eq.${encodeURIComponent(id)}`,{method:"PATCH",token,headers:{Prefer:"return=representation"},body:JSON.stringify(changes)});return rows[0];}
export async function deleteProduct(id,token){if(!isConfigured){demoWrite(demoRead().filter(x=>x.id!==id));return;}await api(`/rest/v1/littlenest_products?id=eq.${encodeURIComponent(id)}`,{method:"DELETE",token,headers:{Prefer:"return=minimal"}});}

async function optimizeImage(file){const bitmap=await createImageBitmap(file);const scale=Math.min(1,1400/Math.max(bitmap.width,bitmap.height));const canvas=document.createElement("canvas");canvas.width=Math.round(bitmap.width*scale);canvas.height=Math.round(bitmap.height*scale);canvas.getContext("2d",{alpha:false}).drawImage(bitmap,0,0,canvas.width,canvas.height);bitmap.close?.();return new Promise((resolve,reject)=>canvas.toBlob(x=>x?resolve(x):reject(new Error("Gambar gagal diproses")),"image/webp",.84));}
export async function uploadProductImage(file,token){if(!file)return"";if(file.size>5*1024*1024)throw new Error("Gambar mesti kurang daripada 5MB");const blob=await optimizeImage(file);if(!isConfigured)return new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result);reader.onerror=reject;reader.readAsDataURL(blob);});const name=`${Date.now()}-${crypto.randomUUID()}.webp`;const r=await fetch(`${config.supabaseUrl}/storage/v1/object/littlenest-images/${name}`,{method:"POST",headers:{apikey:config.supabaseAnonKey,Authorization:`Bearer ${token}`,"Content-Type":"image/webp","x-upsert":"false"},body:blob});if(!r.ok){const data=await r.json().catch(()=>({}));throw new Error(data.message||"Gambar gagal dimuat naik");}return`${config.supabaseUrl}/storage/v1/object/public/littlenest-images/${name}`;}
