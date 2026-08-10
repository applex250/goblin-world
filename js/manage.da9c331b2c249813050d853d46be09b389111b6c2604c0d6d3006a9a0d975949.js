(()=>{(()=>{let r="https://goblin-admin.goblin-world.workers.dev",a=null,d=!1,p=`
    #gm-toolbar { position: fixed; top: 10px; right: 10px; z-index: 9999; display: flex; gap: 8px; align-items: center; }
    #gm-toolbar button { padding: 6px 14px; border: none; border-radius: 6px; font-size: 13px; cursor: pointer; font-family: inherit; }
    #gm-guest-btn { background: rgba(255,255,255,.9); color: #1a1a1a; }
    #gm-admin-btn { background: #2E8B7E; color: #fff; }
    #gm-modal { position: fixed; inset: 0; background: rgba(0,0,0,.5); display: none; align-items: center; justify-content: center; z-index: 10000; }
    #gm-modal.gm-show { display: flex; }
    #gm-modal-box { background: #fff; padding: 28px; border-radius: 10px; width: 320px; box-shadow: 0 8px 30px rgba(0,0,0,.25); }
    #gm-modal-box h3 { margin: 0 0 16px; font-size: 17px; color: #1a1a1a; }
    #gm-modal-box input { width: 100%; padding: 10px 12px; border: 1px solid #ccc; border-radius: 6px; font-size: 14px; margin-bottom: 12px; box-sizing: border-box; }
    #gm-modal-box .row { display: flex; gap: 8px; }
    #gm-modal-box .row button { flex: 1; padding: 9px 0; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; }
    #gm-ok { background: #2E8B7E; color: #fff; }
    #gm-cancel { background: #eee; color: #333; }
    #gm-msg { font-size: 13px; color: #C0504D; min-height: 18px; margin-top: 8px; }
    .gm-del { position: absolute; top: 6px; right: 6px; display: none; padding: 4px 10px; border: none; border-radius: 5px;
             background: #C0504D; color: #fff; font-size: 12px; cursor: pointer; z-index: 5; }
    body.gm-admin .gm-del { display: block; }
    body.gm-admin .gallery-item { outline: 1px dashed rgba(192,80,77,.5); }
  `,u=()=>{let e=document.createElement("style");e.textContent=p,document.head.appendChild(e);let o=document.createElement("div");o.id="gm-toolbar",o.innerHTML=`
      <button id="gm-guest-btn">\u{1F441} \u8BBF\u5BA2\u6D4F\u89C8</button>
      <button id="gm-admin-btn">\u{1F511} \u7BA1\u7406\u5458</button>`,document.body.appendChild(o);let t=document.createElement("div");t.id="gm-modal",t.innerHTML=`
      <div id="gm-modal-box">
        <h3>\u{1F510} \u7BA1\u7406\u5458\u767B\u5F55</h3>
        <input type="password" id="gm-password" placeholder="\u7BA1\u7406\u5BC6\u7801" autocomplete="current-password" />
        <div class="row">
          <button id="gm-ok">\u767B\u5F55</button>
          <button id="gm-cancel">\u53D6\u6D88</button>
        </div>
        <div id="gm-msg"></div>
      </div>`,document.body.appendChild(t),document.getElementById("gm-guest-btn").onclick=()=>{document.body.classList.remove("gm-admin"),d=!1},document.getElementById("gm-admin-btn").onclick=()=>{t.classList.add("gm-show")},document.getElementById("gm-cancel").onclick=()=>{t.classList.remove("gm-show")},document.getElementById("gm-ok").onclick=i,document.getElementById("gm-password").addEventListener("keydown",n=>{n.key==="Enter"&&i()})},i=async()=>{let e=document.getElementById("gm-password").value,o=document.getElementById("gm-msg");if(!e){o.textContent="\u8BF7\u8F93\u5165\u5BC6\u7801";return}o.textContent="\u767B\u5F55\u4E2D...";try{let n=await(await fetch(`${r}/api/auth`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({password:e})})).json();n.ok?(a=n.token,d=!0,document.body.classList.add("gm-admin"),document.getElementById("gm-modal").classList.remove("gm-show"),o.textContent="",s()):o.textContent=n.error||"\u767B\u5F55\u5931\u8D25"}catch(t){o.textContent="\u7F51\u7EDC\u9519\u8BEF: "+t.message}},s=()=>{document.querySelectorAll(".gallery-item").forEach(e=>{if(e.querySelector(".gm-del"))return;let o=e.getAttribute("href")||"",t=decodeURIComponent(o.split("/").pop());if(!t||!t.endsWith(".webp"))return;let n=document.createElement("button");n.className="gm-del",n.textContent="\u2715 \u5220\u9664",n.onclick=async m=>{if(m.preventDefault(),m.stopPropagation(),!!confirm(`\u786E\u8BA4\u5220\u9664 ${t}?`))try{let g=await(await fetch(`${r}/api/delete`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({token:a,file:t})})).json();g.ok?(e.style.opacity=".3",e.style.pointerEvents="none",e.querySelector(".gm-del").textContent="\u5DF2\u5220\u9664"):alert(g.error||"\u5220\u9664\u5931\u8D25")}catch(c){alert("\u7F51\u7EDC\u9519\u8BEF: "+c.message)}},e.style.position="relative",e.appendChild(n)})},l=()=>{u();let e=setInterval(()=>{document.querySelectorAll(".gallery-item").length>0&&(d&&s(),clearInterval(e))},500);setTimeout(()=>clearInterval(e),3e4)};document.readyState==="loading"?document.addEventListener("DOMContentLoaded",l):l()})();})();
