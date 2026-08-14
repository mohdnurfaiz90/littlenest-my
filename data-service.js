const config=window.LITTLENEST_CONFIG||{};
const isLocal=["localhost","127.0.0.1"].includes(location.hostname);
const isConfigured=Boolean(config.supabaseUrl&&config.supabaseAnonKey)&&!isLocal;
const demoKey="littlenest-products-demo-v1";

export const CATEGORIES=["Semua","Baju","Mainan","Bahan Pelajaran","Makanan","Keperluan"];
export const CATEGORY_PREFIX={Baju:"BJ",Mainan:"MN","Bahan Pelajaran":"BP",Makanan:"MK",Keperluan:"KP"};
export const storageMode=isConfigured?"online":"demo";

const seed=[
  {id:"demo-1",code:"LN-BJ-001",name:"Baju Baby Romper Bunga",category:"Baju",price:29.9,stock:18,image_url:"https://images.unsplash.com/photo-1522771930-78848d9293e8?auto=format&fit=crop&w=900&q=85",active:true,position:1},
  {id:"demo-2",code:"LN-MN-002",name:"Teddy Bear Lembut 30cm",category:"Mainan",price:49.9,stock:12,image_url:"https://images.unsplash.com/photo-1559454403-b8fb88521f11?auto=format&fit=crop&w=900&q=85",active:true,position:2},
  {id:"demo-3",code:"LN-BP-003",name:"Set Alat Tulis Comel 8 dalam 1",category:"Bahan Pelajaran",price:19.9,stock:25,image_url:"https://images.unsplash.com/photo-1452860606245-08befc0ff44b?auto=format&fit=crop&w=900&q=85",active:true,position:3},
  {id:"demo-4",code:"LN-MK-004",name:"Biskut Bayi Pisang",category:"Makanan",price:12.5,stock:30,image_url:"https://images.unsplash.com/photo-1606312619070-d48b4c652a52?auto=format&fit=crop&w=900&q=85",active:true,position:4},
  {id:"demo-5",code:"LN-KP-005",name:"Beg Sandang Kanak-kanak",category:"Keperluan",price:39.9,stock:15,image_url:"https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=85",active:true,position:5},
  {id:"demo-6",code:"LN-BJ-006",name:"Dress Princess Pink",category:"Baju",price:39.9,stock:0,image_url:"https://images.unsplash.com/photo-1519457431-44ccd64a579b?auto=format&fit=crop&w=900&q=85",active:true,position:6}
];

function demoRead(){try{return JSON.parse(localStorage.getItem(demoKey))||seed;}catch{return seed;}}
function demoWrite(items){localStorage.setItem(demoKey,JSON.stringify(items));}
function headers(token){return{apikey:config.supabaseAnonKey,Authorization:`Bearer ${token||config.supabaseAnonKey}`,"Content-Type":"application/json"};}
async function api(path,options={}){const r=await fetch(`${config.supabaseUrl}${path}`,{...options,headers:{...headers(options.token),...(options.headers||{})}});const data=await r.json().catch(()=>null);if(!r.ok)throw new Error(data?.message||data?.error_description||data?.hint||"Permintaan tidak berjaya");return data;}

export async function signIn(email,password){if(!isConfigured)return{access_token:"demo-token",user:{email:"demo@littlenest.my"},demo:true};return api("/auth/v1/token?grant_type=password",{method:"POST",body:JSON.stringify({email,password})});}
export async function listProducts({includeHidden=false}={}){if(!isConfigured)return demoRead().filter(x=>includeHidden||x.active).sort((a,b)=>a.position-b.position);const active=includeHidden?"":"&active=eq.true";return api(`/rest/v1/littlenest_products?select=*&order=position.asc,created_at.desc${active}`);}
export function makeCode(category,items=[]){const prefix=CATEGORY_PREFIX[category]||"IT";const max=items.filter(x=>x.code?.includes(`-${prefix}-`)).reduce((n,x)=>Math.max(n,Number(x.code?.split("-").pop())||0),0);return`LN-${prefix}-${String(max+1).padStart(3,"0")}`;}
export async function saveProduct(product,token){
  if(!isConfigured){const items=demoRead();const index=items.findIndex(x=>x.id===product.id);const value={...product,id:product.id||crypto.randomUUID(),position:product.position||items.length+1,updated_at:new Date().toISOString()};if(index>=0)items[index]=value;else items.push(value);demoWrite(items);return value;}
  const value={code:product.code,name:product.name,category:product.category,price:Number(product.price),stock:Number(product.stock),image_url:product.image_url||null,active:Boolean(product.active),position:product.position||999};
  if(product.id){const rows=await api(`/rest/v1/littlenest_products?id=eq.${encodeURIComponent(product.id)}`,{method:"PATCH",token,headers:{Prefer:"return=representation"},body:JSON.stringify(value)});return rows[0];}
  const rows=await api("/rest/v1/littlenest_products",{method:"POST",token,headers:{Prefer:"return=representation"},body:JSON.stringify(value)});return rows[0];
}
export async function updateProduct(id,changes,token){if(!isConfigured){const items=demoRead();const i=items.findIndex(x=>x.id===id);if(i>=0)items[i]={...items[i],...changes};demoWrite(items);return items[i];}const rows=await api(`/rest/v1/littlenest_products?id=eq.${encodeURIComponent(id)}`,{method:"PATCH",token,headers:{Prefer:"return=representation"},body:JSON.stringify(changes)});return rows[0];}
export async function deleteProduct(id,token){if(!isConfigured){demoWrite(demoRead().filter(x=>x.id!==id));return;}await api(`/rest/v1/littlenest_products?id=eq.${encodeURIComponent(id)}`,{method:"DELETE",token,headers:{Prefer:"return=minimal"}});}

async function optimizeImage(file){const bitmap=await createImageBitmap(file);const scale=Math.min(1,1400/Math.max(bitmap.width,bitmap.height));const canvas=document.createElement("canvas");canvas.width=Math.round(bitmap.width*scale);canvas.height=Math.round(bitmap.height*scale);canvas.getContext("2d",{alpha:false}).drawImage(bitmap,0,0,canvas.width,canvas.height);bitmap.close?.();return new Promise((resolve,reject)=>canvas.toBlob(x=>x?resolve(x):reject(new Error("Gambar gagal diproses")),"image/webp",.84));}
export async function uploadProductImage(file,token){if(!file)return"";if(file.size>5*1024*1024)throw new Error("Gambar mesti kurang daripada 5MB");const blob=await optimizeImage(file);if(!isConfigured)return new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result);reader.onerror=reject;reader.readAsDataURL(blob);});const name=`${Date.now()}-${crypto.randomUUID()}.webp`;const r=await fetch(`${config.supabaseUrl}/storage/v1/object/littlenest-images/${name}`,{method:"POST",headers:{apikey:config.supabaseAnonKey,Authorization:`Bearer ${token}`,"Content-Type":"image/webp","x-upsert":"false"},body:blob});if(!r.ok){const data=await r.json().catch(()=>({}));throw new Error(data.message||"Gambar gagal dimuat naik");}return`${config.supabaseUrl}/storage/v1/object/public/littlenest-images/${name}`;}
