// 哥布林世界: 访客/管理员 双模式 (登录后每图带删除按钮)
(() => {
  const API = 'https://goblin-admin.goblin-world.workers.dev';
  let token = null;
  let adminMode = false;

  const css = `
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
  `;

  const injectUI = () => {
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);

    const toolbar = document.createElement('div');
    toolbar.id = 'gm-toolbar';
    toolbar.innerHTML = `
      <button id="gm-guest-btn">👁 访客浏览</button>
      <button id="gm-admin-btn">🔑 管理员</button>`;
    document.body.appendChild(toolbar);

    const modal = document.createElement('div');
    modal.id = 'gm-modal';
    modal.innerHTML = `
      <div id="gm-modal-box">
        <h3>🔐 管理员登录</h3>
        <input type="password" id="gm-password" placeholder="管理密码" autocomplete="current-password" />
        <div class="row">
          <button id="gm-ok">登录</button>
          <button id="gm-cancel">取消</button>
        </div>
        <div id="gm-msg"></div>
      </div>`;
    document.body.appendChild(modal);

    document.getElementById('gm-guest-btn').onclick = () => {
      document.body.classList.remove('gm-admin');
      adminMode = false;
    };
    document.getElementById('gm-admin-btn').onclick = () => { modal.classList.add('gm-show'); };
    document.getElementById('gm-cancel').onclick = () => { modal.classList.remove('gm-show'); };
    document.getElementById('gm-ok').onclick = doLogin;
    document.getElementById('gm-password').addEventListener('keydown', (e) => { if (e.key === 'Enter') doLogin(); });
  };

  const doLogin = async () => {
    const pw = document.getElementById('gm-password').value;
    const msg = document.getElementById('gm-msg');
    if (!pw) { msg.textContent = '请输入密码'; return; }
    msg.textContent = '登录中...';
    try {
      const res = await fetch(`${API}/api/auth`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: pw }),
      });
      const r = await res.json();
      if (r.ok) {
        token = r.token;
        adminMode = true;
        document.body.classList.add('gm-admin');
        document.getElementById('gm-modal').classList.remove('gm-show');
        msg.textContent = '';
        injectDeleteButtons();
      } else {
        msg.textContent = r.error || '登录失败';
      }
    } catch (e) {
      msg.textContent = '网络错误: ' + e.message;
    }
  };

  const injectDeleteButtons = () => {
    document.querySelectorAll('.gallery-item').forEach((item) => {
      if (item.querySelector('.gm-del')) return;
      const href = item.getAttribute('href') || '';
      const file = decodeURIComponent(href.split('/').pop());
      if (!file || !file.endsWith('.webp')) return;
      const btn = document.createElement('button');
      btn.className = 'gm-del';
      btn.textContent = '✕ 删除';
      btn.onclick = async (e) => {
        e.preventDefault(); e.stopPropagation();
        if (!confirm(`确认删除 ${file}?`)) return;
        try {
          const res = await fetch(`${API}/api/delete`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token, file }),
          });
          const r = await res.json();
          if (r.ok) { item.style.opacity = '.3'; item.style.pointerEvents = 'none'; item.querySelector('.gm-del').textContent = '已删除'; }
          else { alert(r.error || '删除失败'); }
        } catch (err) { alert('网络错误: ' + err.message); }
      };
      item.style.position = 'relative';
      item.appendChild(btn);
    });
  };

  const start = () => {
    injectUI();
    const timer = setInterval(() => {
      const items = document.querySelectorAll('.gallery-item');
      if (items.length > 0) {
        if (adminMode) injectDeleteButtons();
        clearInterval(timer);
      }
    }, 500);
    setTimeout(() => clearInterval(timer), 30000);
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
