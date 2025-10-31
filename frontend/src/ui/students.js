import { apiGet, apiPost } from '../api.js'
export async function renderStudents(root=document.getElementById('page-root')){
  root.innerHTML = `<div class="flex justify-between items-center mb-4"><h2 class="text-xl font-semibold">Students</h2><button id="newStu" class="px-4 py-2 bg-gradient-to-r from-teal-400 to-blue-500 text-white rounded">New student</button></div><div id="students-area"></div>`
  document.getElementById('newStu').addEventListener('click', openNewStudent)
  await loadStudents()
}
async function loadStudents(){
  const area = document.getElementById('students-area')
  try{
    const students = await apiGet('/students/')
    let html = `<div class="grid md:grid-cols-3 gap-4">`
    for(const s of students){
      html += `<div class="bg-white/90 p-4 rounded-lg shadow hover:scale-105 transform transition"><div class="font-semibold">${s.user.first_name} ${s.user.last_name}</div><div class="text-sm text-gray-500">${s.user.phone || ''}</div><div class="mt-2 text-sm">Remaining: <span class="font-bold">${s.balance? s.balance.remaining:0} UZS</span></div></div>`
    }
    html += `</div>`
    area.innerHTML = html
  }catch(e){ area.innerHTML = '<div class="text-red-500">Failed to load students: '+e.message+'</div>' }
}
function openNewStudent(){
  const modal = document.createElement('div')
  modal.className='fixed inset-0 flex items-center justify-center bg-black/40'
  modal.innerHTML = `<div class="bg-white p-6 rounded-lg w-full max-w-lg"><h3 class="font-semibold mb-3">New student</h3><div class="grid grid-cols-1 gap-2"><input id="ns_username" placeholder="Username" class="p-2 border rounded"/><input id="ns_first" placeholder="First name" class="p-2 border rounded"/><input id="ns_last" placeholder="Last name" class="p-2 border rounded"/><input id="ns_phone" placeholder="Phone" class="p-2 border rounded"/><input id="ns_pass" type="password" placeholder="Password" class="p-2 border rounded"/></div><div class="mt-3 flex justify-end gap-2"><button id="ns_cancel" class="px-3 py-1 border rounded">Cancel</button><button id="ns_save" class="px-3 py-1 bg-gradient-to-r from-teal-400 to-blue-500 text-white rounded">Save</button></div></div>`
  document.body.appendChild(modal)
  document.getElementById('ns_cancel').addEventListener('click', ()=>modal.remove())
  document.getElementById('ns_save').addEventListener('click', async ()=>{
    try{
      const body = { username: document.getElementById('ns_username').value, password: document.getElementById('ns_pass').value, first_name: document.getElementById('ns_first').value, last_name: document.getElementById('ns_last').value }
      await apiPost('/students/', body)
      modal.remove(); loadStudents();
      alert('Student created')
    }catch(e){ alert('Save failed: '+e.message) }
  })
}
