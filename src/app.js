document.addEventListener("alpine:init", () => {
  Alpine.data("products", () => ({
    items: [
      { id: 1, name: "Mie Sedaap", img: "1.jpeg", price: 2000 },
      { id: 2, name: "Rinso", img: "2.jpeg", price: 5000 },
      { id: 3, name: "Pantene", img: "3.jpeg", price: 8000 },
      { id: 4, name: "Mie Indomie", img: "4.jpeg", price: 3500 },
      { id: 5, name: "Popok Bayi", img: "5.jpeg", price: 20000 },
    ],
  }));

  Alpine.store("cart", {
    items: [],
    total: 0,
    quantity: 0,
    add(newItem) {
      // cek barang sama
      const cartItem = this.items.find((item) => item.id === newItem.id);

      // jika tidak ada
      if (!cartItem) {
        this.items.push({ ...newItem, quantity: 1, total: newItem.price });
        this.quantity++;
        this.total += newItem.price;
      } else {
        // jika ada apakah sama atau tidak
        this.items = this.items.map((item) => {
          // jika beda
          if (item.id !== newItem.id) {
            return item;
          } else {
            // jika ada tambah quantity dan totalnya
            item.quantity++;
            item.total = item.price * item.quantity;
            this.quantity++;
            this.total += item.price;
            return item;
          }
        });
      }
    },
    remove(id) {
      // item yang diremove berdasarkan id
      const cartItem = this.items.find((item) => item.id === id);
      // jika lebih dari 1
      if (cartItem.quantity > 1) {
        // telusuri 1 1
        this.items = this.items.map((item) => {
          //jika bukan barang yang di klik
          if (item.id !== id) {
            return item;
          } else {
            item.quantity--;
            item.total = item.price * item.quantity;
            this.quantity--;
            this.total -= item.price;
            return item;
          }
        });
      } else if (cartItem.quantity === 1) {
        //jika barang sisa 1
        this.items = this.items.filter((item) => item.id !== id);
        this.quantity--;
        this.total -= cartItem.price;
      }
    },
  });
});

// form validasi
const checkoutButton = document.querySelector(".checkout-button");
checkoutButton.disabled = true;

const form = document.querySelector("#checkoutForm");

form.addEventListener("keyup", function () {
  for (let i = 0; i < form.elements.length; i++) {
    if (form.elements[i].value.length !== 0) {
      checkoutButton.classList.remove("disabed");
      checkoutButton.classList.add("disabed");
    } else {
      return false;
    }
  }
  checkoutButton.disabled = false;
  checkoutButton.classList.remove("disabled");
});

// kirim data ketika checkout

checkoutButton.addEventListener("click", function (e) {
  e.preventDefault();
  const formData = new FormData(form);
  const data = new URLSearchParams(formData);
  const objData = Object.fromEntries(data);
  const message = formatMessage(objData);
  window.open("http://wa.me/6285724595430?text=" + encodeURIComponent(message));
});

// format pesan wa

const formatMessage = (obj) => {
  return `Data Pembeli
  Nama: ${obj.name}
  Email: ${obj.email}
  No Telpon: ${obj.phone}
  Alamat: ${obj.address}
  Data Pesanan
  ${JSON.parse(obj.items).map(
    (item) => `${item.name} (${item.quantity} x ${rupiah(item.total)}) \n`
  )}
  TOTAL: ${rupiah(obj.total)}
  Terima Kasih.`;
};

//  konversi ke RP

const rupiah = (number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(number);
};
