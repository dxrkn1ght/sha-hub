import { apiGet } from '../api.js'
export async function renderDashboard(root=document.getElementById('page-root')){
  root.innerHTML = `<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
    <div class="p-6 bg-white/90 rounded-2xl shadow-lg transform transition hover:scale-105">
      <div class="text-sm text-gray-500">Total students</div>
      <div id="stat-students" class="text-2xl font-bold mt-2">—</div>
    </div>
    <div class="p-6 bg-white/90 rounded-2xl shadow-lg transform transition hover:scale-105">
      <div class="text-sm text-gray-500">Unpaid students</div>
      <div id="stat-unpaid" class="text-2xl font-bold mt-2">—</div>
    </div>
    <div class="p-6 bg-white/90 rounded-2xl shadow-lg transform transition hover:scale-105">
      <div class="text-sm text-gray-500">Active groups</div>
      <div id="stat-groups" class="text-2xl font-bold mt-2">—</div>
    </div>
  </div><div id="dashboard-extra" class="mt-6"></div>`
  try{
    const students = await apiGet('/students/')
    const groups = await apiGet('/groups/')
    const unpaid = students.filter(s=> s.balance && s.balance.remaining>0)
    document.getElementById('stat-students').textContent = students.length
    document.getElementById('stat-unpaid').textContent = unpaid.length
    document.getElementById('stat-groups').textContent = groups.length
    document.getElementById('dashboard-extra').innerHTML = `<div class="mt-4 p-4 bg-white/80 rounded-lg">Welcome to Shon's HUB — ${new Date().toLocaleDateString()}</div>`
  }catch(e){ document.getElementById('dashboard-extra').innerHTML = '<div class="text-red-500">Failed to load dashboard: '+e.message+'</div>' }
}
