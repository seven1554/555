const basePrice = 25;
const menuItems = [
  { name: "ไส้กรอก", price: 5 },
  { name: "ข้าวโพด", price: 5 },
  { name: "หมึกกรุบ", price: 5 },
  { name: "ไก่สับ", price: 5 },
  { name: "ไก่หยอง", price: 5 },
  { name: "แฮมไก่", price: 5 },
  { name: "กุ้ง", price: 10 },
  { name: "ไข่กุ้ง", price: 10 },
  { name: "สาหร่าย", price: 10 },
  { name: "เบคอน", price: 10 },
  { name: "ชีส", price: 15 }
];

const menuList = document.getElementById('menuList');
const totalPriceEl = document.getElementById('totalPrice');

menuItems.forEach(item => {
  const wrapper = document.createElement('label');
  wrapper.className = 'menu-item';
  wrapper.innerHTML = `
    <input type="checkbox" class="menu" value="${item.price}" data-name="${item.name}" data-price="${item.price}">
    ${item.name} (${item.price}฿)
  `;
  menuList.appendChild(wrapper);
});

function updateTotal() {
  const selected = Array.from(document.querySelectorAll('.menu:checked')).map(cb => ({
    name: cb.dataset.name,
    price: parseInt(cb.dataset.price)
  }));

  const underFive = selected.filter(i => i.price <= 5);
  const freeItems = underFive.slice(0, 2);
  const paidUnderFive = underFive.slice(2);
  const overFive = selected.filter(i => i.price > 5);
  const paidItems = overFive.concat(paidUnderFive);
  const extra = paidItems.reduce((sum, i) => sum + i.price, 0);

  totalPriceEl.textContent = basePrice + extra;
}

document.getElementById('menuList').addEventListener('change', updateTotal);
document.querySelectorAll('.sauce').forEach(cb => cb.addEventListener('change', () => {}));

document.getElementById('submitOrder').addEventListener('click', () => {
  const selected = Array.from(document.querySelectorAll('.menu:checked')).map(cb => cb.dataset.name);
  const sauces = Array.from(document.querySelectorAll('.sauce:checked')).map(cb => cb.dataset.name);
  const total = totalPriceEl.textContent;

  alert(`สั่งซื้อสำเร็จ!\n\nหน้า: ${selected.join(', ')}\nซอส: ${sauces.join(', ') || 'ไม่มี'}\nรวม: ${total} บาท`);

  sendToGoogleSheet(selected, sauces, total);
  document.getElementById('menuForm').reset();
  updateTotal();
});

function sendToGoogleSheet(menu, sauces, total) {
  const scriptURL = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID_HERE/exec';
  const formData = new FormData();
  formData.append('เมนู', menu.join(', '));
  formData.append('ซอส', sauces.join(', '));
  formData.append('รวม', total);

  fetch(scriptURL, { method: 'POST', body: formData })
    .then(response => console.log('บันทึกแล้ว'))
    .catch(error => console.error('เกิดข้อผิดพลาด', error));
}

updateTotal();
