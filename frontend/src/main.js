import 'tailwindcss/tailwind.css'
import './styles.css'
import Alpine from 'alpinejs'
import { login, logout, getAccess } from './api.js'
import { renderDashboard } from './ui/dashboard.js'
import { renderPayments } from './ui/payments.js'
import { renderStudents } from './ui/students.js'
import { renderGroups } from './ui/groups.js'
import { renderTeachers } from './ui/teachers.js'

window.Alpine = Alpine
Alpine.start()

const app = document.getElementById('app')

function nav(){
  return `
  <nav class="flex items-center justify-between mb-6">
    <div class="text-white text-lg font-semibold">Shon's HUB</div>
    <div class="flex items-center gap-3">
      <a href="#/dashboard" class="text-white/90 hover:underline">Dashboard</a>
      <a href="#/payments" class="text-white/90 hover:underline">Payments</a>
      <a href="#/students" class="text-white/90 hover:underline">Students</a>
      <a href="#/groups" class="text-white/90 hover:underline">Groups</a>
      <a href="#/teachers" class="text-white/90 hover:underline">Teachers</a>
      <button id="logoutBtn" class="ml-4 px-3 py-1 bg-white/20 text-white rounded">Logout</button>
    </div>
  </nav>
  `
}

async function renderApp(){
  const token = getAccess()
  if(!token){ renderLogin(); return }
  const root = `
  <div class="max-w-6xl mx-auto p-6">
    ${nav()}
    <div id="page-root"></div>
  </div>`
  app.innerHTML = root
  document.getElementById('logoutBtn').addEventListener('click', ()=>{ logout(); renderLogin(); })
  route()
}

function renderLogin(){
  app.innerHTML = `
  <div class="min-h-screen flex items-center justify-center">
    <div class="bg-white rounded-2xl p-8 shadow-xl w-full max-w-md">
      <h2 class="text-2xl font-bold mb-4 text-center">Sign in to Shon's HUB</h2>
      <input id="loginUser" class="w-full p-3 border rounded mb-3" placeholder="Username" />
      <input id="loginPass" type="password" class="w-full p-3 border rounded mb-3" placeholder="Password" />
      <button id="loginBtn" class="w-full py-3 bg-gradient-to-r from-teal-400 to-blue-500 text-white rounded-lg">Sign in</button>
      <div id="loginError" class="text-red-500 text-sm mt-3 hidden"></div>
    </div>
  </div>`
  document.getElementById('loginBtn').addEventListener('click', async ()=>{
    const u = document.getElementById('loginUser').value
    const p = document.getElementById('loginPass').value
    try{
      await login(u,p)
      renderApp()
    }catch(e){ const el = document.getElementById('loginError'); el.textContent = e.message; el.classList.remove('hidden') }
  })
}

function route(){
  const hash = location.hash.replace('#','') || '/dashboard'
  const pageRoot = document.getElementById('page-root')
  if(!pageRoot) return
  if(hash.startsWith('/payments')){ renderPayments(pageRoot); return }
  if(hash.startsWith('/students')){ renderStudents(pageRoot); return }
  if(hash.startsWith('/groups')){ renderGroups(pageRoot); return }
  if(hash.startsWith('/teachers')){ renderTeachers(pageRoot); return }
  renderDashboard(pageRoot)
}

window.addEventListener('hashchange', route)
renderApp()
