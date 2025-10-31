import { apiGet, apiPost } from '../api.js'
export async function renderTeachers(root=document.getElementById('page-root')){
  root.innerHTML = `<div class="flex justify-between items-center mb-4"><h2 class="text-xl font-semibold">Teachers</h2><button id="newTeacher" class="px-4 py-2 bg-gradient-to-r from-teal-400 to-blue-500 text-white rounded">New teacher</button></div><div id="teachers-area"></div>`
  document.getElementById('newTeacher').addEventListener('click', openNewTeacher)
  await loadTeachers()
}
async function loadTeachers(){
  const area = document.getElementById('teachers-area')
  try{
    const teachers = await apiGet('/teachers/')
    let html = `<div class="grid md:grid-cols-3 gap-4">`
    for(const t of teachers){ html += `<div class="bg-white/90 p-4 rounded-lg shadow hover:scale-105 transform transition"><div class="font-semibold">${t.user ? (t.user.first_name + ' ' + t.user.last_name) : 'Teacher'}</div><div class="text-sm text-gray-500">${t.user ? t.user.email : ''}</div></div>` }
    html += `</div>`
    area.innerHTML = html
  }catch(e){ area.innerHTML = '<div class="text-red-500">Failed to load teachers: '+e.message+'</div>' }
}
function openNewTeacher(){
  const modal = document.createElement('div')
  modal.className='fixed inset-0 flex items-center justify-center bg-black/40'
  modal.innerHTML = `<div class="bg-white p-6 rounded-lg w-full max-w-lg"><h3 class="font-semibold mb-3">New teacher</h3><div class="grid grid-cols-1 gap-2"><input id="t_username" placeholder="Username" class="p-2 border rounded"/><input id="t_first" placeholder="First name" class="p-2 border rounded"/><input id="t_last" placeholder="Last name" class="p-2 border rounded"/><input id="t_email" placeholder="Email" class="p-2 border rounded"/><input id="t_pass" type="password" placeholder="Password" class="p-2 border rounded"/></div><div class="mt-3 flex justify-end gap-2"><button id="t_cancel" class="px-3 py-1 border rounded">Cancel</button><button id="t_save" class="px-3 py-1 bg-gradient-to-r from-teal-400 to-blue-500 text-white rounded">Save</button></div></div>`
  document.body.appendChild(modal)
  document.getElementById('t_cancel').addEventListener('click', ()=>modal.remove())
  document.getElementById('t_save').addEventListener('click', async ()=>{
    try{
      const body = { username: document.getElementById('t_username').value, first_name: document.getElementById('t_first').value, last_name: document.getElementById('t_last').value, email: document.getElementById('t_email').value, password: document.getElementById('t_pass').value }
      await apiPost('/users/', body)
      modal.remove(); loadTeachers();
      alert('Teacher created')
    }catch(e){ alert('Save failed: '+e.message) }
  })
}
