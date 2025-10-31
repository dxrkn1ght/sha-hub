import { apiGet, apiPost } from '../api.js'
export async function renderPayments(root=document.getElementById('page-root')){
  root.innerHTML = `<div class="flex justify-between items-center mb-4">
    <h2 class="text-xl font-semibold">Payments</h2>
    <button id="openPay" class="button-primary">Add New Payment</button>
  </div><div id="payments-area"></div>`
  document.getElementById('openPay').addEventListener('click', openPaymentModal)
  await loadPayments()
}

async function loadPayments(){
  const area = document.getElementById('payments-area')
  try{
    const payments = await apiGet('/payments/')
    const students = await apiGet('/students/')
    let html = `<div class="grid md:grid-cols-2 gap-4">`
    // recent
    html += `<div class="bg-white/90 p-4 rounded-lg shadow"><h3 class="font-semibold">Recent payments</h3><ul class="mt-3">`
    for(const p of payments.slice(0,10)){
      const stu = students.find(s=>s.id===p.student)
      html += `<li class="flex justify-between py-2 border-b"><div>${stu? stu.user.first_name + ' ' + stu.user.last_name : 'Unknown'} — ${p.payment_type.toUpperCase()}</div><div class="font-semibold">${p.amount} UZS</div></li>`
    }
    html += `</ul></div>`
    // debtors
    html += `<div class="bg-white/90 p-4 rounded-lg shadow"><h3 class="font-semibold">Debtors</h3><ul class="mt-3">`
    const debtors = students.filter(s=> s.balance && s.balance.remaining>0)
    for(const s of debtors){ html += `<li class="flex justify-between py-2 border-b"><div>${s.user.first_name} ${s.user.last_name}</div><div class="text-red-600 font-semibold">${s.balance.remaining} UZS</div></li>` }
    html += `</ul></div>`
    html += `</div>`
    area.innerHTML = html
  }catch(e){ area.innerHTML = '<div class="text-red-500">Failed to load payments: '+e.message+'</div>' }
}

export function openPaymentModal(){
  if(document.getElementById('payModal')) return
  const modal = document.createElement('div')
  modal.id = 'payModal'
  modal.className = 'fixed inset-0 flex items-center justify-center bg-black/40 z-50'
  modal.innerHTML = `
  <div class="bg-white rounded-lg p-6 w-full max-w-2xl shadow-lg">
    <h3 class="text-xl font-semibold mb-4">Add New Payment</h3>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
      <select id="pm_student" class="p-3 border rounded"></select>
      <select id="pm_type" class="p-3 border rounded"><option value="ielts">IELTS — 600000</option><option value="lower">Lower — 520000</option></select>
      <input id="pm_amount" placeholder="Amount" class="p-3 border rounded" />
      <select id="pm_method" class="p-3 border rounded"><option value="cash">Cash</option><option value="card">Card</option></select>
      <input id="pm_date" type="date" class="p-3 border rounded" />
      <input id="pm_note" placeholder="Note (optional)" class="p-3 border rounded" />
    </div>
    <div class="mt-4 flex justify-between items-center">
      <div id="remainingInfo" class="text-sm text-gray-600">Remaining: —</div>
      <div class="flex gap-2"><button id="pm_cancel" class="px-4 py-2 border rounded">Cancel</button><button id="pm_save" class="button-primary">Save Payment</button></div>
    </div>
  </div>`
  document.body.appendChild(modal)
  apiGet('/students/').then(students=>{
    const sel = document.getElementById('pm_student')
    sel.innerHTML = '<option value="">— Select student —</option>'
    for(const s of students){ sel.insertAdjacentHTML('beforeend', `<option value="${s.id}">${s.user.first_name} ${s.user.last_name}</option>`) }
  })
  document.getElementById('pm_cancel').addEventListener('click', ()=>{ modal.remove(); })
  document.getElementById('pm_type').addEventListener('change', updateRemaining)
  document.getElementById('pm_student').addEventListener('change', updateRemaining)
  document.getElementById('pm_amount').addEventListener('input', updateRemaining)
  document.getElementById('pm_save').addEventListener('click', async ()=>{
    try{
      const body = {
        student: document.getElementById('pm_student').value,
        payment_type: document.getElementById('pm_type').value,
        method: document.getElementById('pm_method').value,
        amount: Number(document.getElementById('pm_amount').value),
        date: document.getElementById('pm_date').value || new Date().toISOString().slice(0,10),
        note: document.getElementById('pm_note').value || ''
      }
      await apiPost('/payments/', body)
      modal.remove();
      // refresh payments area
      const parent = document.getElementById('payments-area')
      parent.innerHTML = ''
      await renderPayments(parent)
      alert('Payment saved')
    }catch(e){ alert('Save failed: '+e.message) }
  })
}

async function updateRemaining(){
  const studentId = document.getElementById('pm_student').value
  const type = document.getElementById('pm_type').value
  const amount = Number(document.getElementById('pm_amount').value || 0)
  if(!studentId) return
  try{
    const stu = (await apiGet('/students/')).find(s=>s.id===studentId)
    const defaultTuition = type==='ielts'?600000:520000
    const paid = stu.balance ? stu.balance.total_paid : 0
    const remaining = defaultTuition - paid - amount
    document.getElementById('remainingInfo').textContent = 'Remaining after this payment: ' + (remaining>0? remaining + ' UZS' : 'Paid in full')
  }catch(e){ console.error(e) }
}
