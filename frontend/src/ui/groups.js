import { apiGet, apiPost } from '../api.js'
export async function renderGroups(root=document.getElementById('page-root')){
  root.innerHTML = `<div class="flex justify-between items-center mb-4"><h2 class="text-xl font-semibold">Groups</h2><button id="newGroup" class="px-4 py-2 bg-gradient-to-r from-teal-400 to-blue-500 text-white rounded">New group</button></div><div id="groups-area"></div>`
  document.getElementById('newGroup').addEventListener('click', openNewGroup)
  await loadGroups()
}
async function loadGroups(){
  const area = document.getElementById('groups-area')
  try{
    const groups = await apiGet('/groups/')
    let html = `<div class="grid md:grid-cols-3 gap-4">`
    for(const g of groups){ html += `<div class="bg-white/90 p-4 rounded-lg shadow hover:scale-105 transform transition"><div class="font-semibold">${g.name}</div><div class="text-sm text-gray-500">${g.schedule || ''}</div><div class="mt-2 text-sm">Tuition: ${g.tuition || 'default'}</div></div>` }
    html += `</div>`
    area.innerHTML = html
  }catch(e){ area.innerHTML = '<div class="text-red-500">Failed to load groups: '+e.message+'</div>' }
}
function openNewGroup(){
  const modal = document.createElement('div')
  modal.className='fixed inset-0 flex items-center justify-center bg-black/40'
  modal.innerHTML = `<div class="bg-white p-6 rounded-lg w-full max-w-lg"><h3 class="font-semibold mb-3">New group</h3><div class="grid grid-cols-1 gap-2"><input id="g_name" placeholder="Group name" class="p-2 border rounded"/><input id="g_schedule" placeholder="Schedule" class="p-2 border rounded"/><input id="g_tuition" placeholder="Tuition (optional)" class="p-2 border rounded"/></div><div class="mt-3 flex justify-end gap-2"><button id="g_cancel" class="px-3 py-1 border rounded">Cancel</button><button id="g_save" class="px-3 py-1 bg-gradient-to-r from-teal-400 to-blue-500 text-white rounded">Save</button></div></div>`
  document.body.appendChild(modal)
  document.getElementById('g_cancel').addEventListener('click', ()=>modal.remove())
  document.getElementById('g_save').addEventListener('click', async ()=>{
    try{
      const body = { name: document.getElementById('g_name').value, schedule: document.getElementById('g_schedule').value, tuition: Number(document.getElementById('g_tuition').value || 0) }
      await apiPost('/groups/', body)
      modal.remove(); loadGroups();
      alert('Group created')
    }catch(e){ alert('Save failed: '+e.message) }
  })
}
