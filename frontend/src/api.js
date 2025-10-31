const API_BASE = import.meta.env.VITE_API_BASE || 'http://127.0.0.1:8000/api'

async function fetchJSON(url, opts={}){
  const res = await fetch(url, opts);
  const text = await res.text();
  try { return JSON.parse(text); } catch(e){ return text; }
}

export async function login(username, password){
  const res = await fetch(`${API_BASE.replace('/api','')}/api/auth/token/`, {
    method: 'POST', headers: {'Content-Type':'application/json'},
    body: JSON.stringify({username, password})
  });
  if(!res.ok) throw new Error('Login failed');
  const data = await res.json();
  localStorage.setItem('access', data.access);
  localStorage.setItem('refresh', data.refresh);
  return data;
}

export function logout(){
  localStorage.removeItem('access');
  localStorage.removeItem('refresh');
}

export function getAccess(){ return localStorage.getItem('access'); }

export async function refreshToken(){
  const refresh = localStorage.getItem('refresh');
  if(!refresh) throw new Error('No refresh token');
  const res = await fetch(`${API_BASE.replace('/api','')}/api/auth/refresh/`, {
    method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({refresh})
  });
  if(!res.ok) throw new Error('Refresh failed');
  const data = await res.json();
  localStorage.setItem('access', data.access);
  return data.access;
}

async function authFetch(path, opts={}){
  const url = `${API_BASE}${path}`;
  opts.headers = opts.headers || {};
  const token = getAccess();
  if(token) opts.headers['Authorization'] = `Bearer ${token}`;
  if(!opts.headers['Content-Type']) opts.headers['Content-Type'] = 'application/json';
  let res = await fetch(url, opts);
  if(res.status === 401){
    try{
      await refreshToken();
      opts.headers['Authorization'] = `Bearer ${getAccess()}`;
      res = await fetch(url, opts);
    }catch(e){ throw new Error('Unauthorized'); }
  }
  if(res.status>=400){ const t = await res.text(); throw new Error(t || 'API error'); }
  return res.json();
}

export async function apiGet(path){ return authFetch(path, {method:'GET'}); }
export async function apiPost(path, body){ return authFetch(path, {method:'POST', body: JSON.stringify(body)}); }
export async function apiPatch(path, body){ return authFetch(path, {method:'PATCH', body: JSON.stringify(body)}); }
export async function apiDelete(path){ return authFetch(path, {method:'DELETE'}); }

export async function getCurrentUser(){
  try{
    const users = await apiGet('/users/');
    // best-effort: find current user by username from token? fallback: return first
    return users.length? users[0] : null;
  }catch(e){ return null; }
}
