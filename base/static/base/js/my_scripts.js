// Página de vendas
if (document.getElementById('saleForm')) {
    let itemCount = 0;

    addItem();

    function addItem() {
        const template = document.getElementById('item-template');
        const clone = template.content.cloneNode(true);
        document.getElementById('items-container').appendChild(clone);
        itemCount++;
    }

    function removeItem(button) {
        if (itemCount > 1) {
            button.closest('.item-row').remove();
            itemCount--;
            calculateTotal();
        } else {
            alert('É necessário pelo menos um produto!');
        }
    }

    function updatePrice(select) {
        const row = select.closest('.item-row');
        const option = select.options[select.selectedIndex];
        const price = option.dataset.price;
        const stock = option.dataset.stock;

        row.querySelector('.item-price').value = 'R$ ' + parseFloat(price).toFixed(2);
        row.querySelector('input[name="quantity"]').max = stock;

        calculateTotal();
    }

    function calculateTotal() {
        let subtotal = 0;

        document.querySelectorAll('.item-row').forEach(row => {
            const select = row.querySelector('select[name="product_id"]');
            const quantity = parseFloat(row.querySelector('input[name="quantity"]').value) || 0;

            if (select.value) {
                const option = select.options[select.selectedIndex];
                const price = parseFloat(option.dataset.price) || 0;
                subtotal += price * quantity;
            }
        });

        const discountInput = parseFloat(document.getElementById('discount').value) || 0;
        const discountType = document.getElementById('discount_type').value;

        let discountValue = 0;
        if (discountType === 'percent') {
            discountValue = subtotal * (discountInput / 100);
            document.getElementById('discount_hint').textContent =
                discountInput > 0 ? 'Equivalente a R$ ' + discountValue.toFixed(2) : '';
        } else {
            discountValue = discountInput;
            document.getElementById('discount_hint').textContent = '';
        }

        const total = subtotal - discountValue;

        document.getElementById('subtotal').textContent = 'R$ ' + subtotal.toFixed(2);
        document.getElementById('discount-display').textContent = 'R$ ' + discountValue.toFixed(2);
        document.getElementById('total').textContent = 'R$ ' + Math.max(0, total).toFixed(2);
    }

    document.getElementById('saleForm').onsubmit = function(e) {
        const rows = document.querySelectorAll('.item-row');
        let hasItems = false;

        rows.forEach(row => {
            const select = row.querySelector('select[name="product_id"]');
            if (select.value) {
                hasItems = true;
            }
        });

        if (!hasItems) {
            e.preventDefault();
            alert('Adicione pelo menos um produto!');
            return false;
        }

        return true;
    };
}
