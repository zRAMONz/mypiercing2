document.addEventListener('DOMContentLoaded', () => {
  const colors = document.querySelectorAll('.silver, .gold, .black');
  const addToCartButtons = document.querySelectorAll('.add-to-cart');
  const copyButton = document.querySelector('.copy');

  colors.forEach(color => {
      color.addEventListener('click', handleColorSelection);
  });

  addToCartButtons.forEach(button => {
      button.addEventListener('click', handleAddToCart);
  });

  copyButton.addEventListener('click', handleCopy);

  function handleColorSelection(e) {
      const color = e.target;
      const column = color.parentElement;
      const row = column.parentElement;
      const unitPrice = row.querySelector('.unit-price');
      const colorPriceList = row.querySelector('.color-price');
      const inputs = row.querySelectorAll('input[type="number"]');

      // Remover o atributo 'selected' dos outros botões de cor
      column.querySelectorAll('.silver, .gold, .black').forEach(btn => {
          btn.removeAttribute('selected');
      });

      // Adicionar o atributo 'selected' ao botão de cor clicado
      color.setAttribute('selected', '');

      // Atualizar o preço unitário de acordo com a cor selecionada
      unitPrice.textContent = color.getAttribute('data-price');

      // Ocultar a lista de preços
      colorPriceList.style.display = 'none';

      // Atualizar o total de quantidade e preço
      updateTotal(row);

      inputs.forEach(input => {
          input.addEventListener('input', () => handleQuantityChange(row));
      });
  }

  function handleQuantityChange(row) {
      updateTotal(row);
  }

  function updateTotal(row) {
      const unitPrice = row.querySelector('.unit-price');
      const inputs = row.querySelectorAll('input[type="number"]');
      const totalQuantity = row.querySelector('.total-quantity');
      const totalPrice = row.querySelector('.total-price');
      const unitPriceValue = parseFloat(unitPrice.textContent.replace('R$ ', ''));

      let sumQuantity = 0;
      let sumPrice = 0;

      inputs.forEach(input => {
          const quantity = parseInt(input.value);
          sumQuantity += quantity;
          sumPrice += quantity * unitPriceValue;
      });

      totalQuantity.textContent = `Quantidade: ${sumQuantity}`;
      totalPrice.textContent = `Total: R$ ${(unitPriceValue * sumQuantity).toFixed(2)}`;
  }

  function handleCopy() {
      const summaryContent = document.querySelector('.summary-content');
      const totalValue = document.querySelector('.total-value');
      const textToCopy = `${summaryContent.textContent}\nTotal da compra: ${totalValue.textContent}`;

      const textarea = document.createElement('textarea');
      textarea.value = textToCopy;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
  }

  function removeItem(e) {
      const item = e.target.parentElement;
      const itemTotalPrice = parseFloat(item.querySelector('.item-total-price').textContent.replace('R$ ', ''));
      const totalValue = document.querySelector('.total-value');
      const currentTotalValue = parseFloat(totalValue.textContent || '0');
      const newTotalValue = currentTotalValue - itemTotalPrice;

      totalValue.textContent = newTotalValue.toFixed(2);
      item.remove();
  }

  function handleAddToCart(e) {
    const button = e.target;
    const column = button.parentElement;
    const row = column.parentElement;
    const modelName = row.querySelector('p').textContent;
    const unitPrice = row.querySelector('.unit-price').textContent;
    const sizes = row.querySelectorAll('.size');
    const summaryContent = document.querySelector('.summary-content');
    const totalValue = document.querySelector('.total-value');

    sizes.forEach(size => {
        const sizeText = size.querySelector('p').textContent;
        const input = size.querySelector('input[type="number"]');
        const quantity = parseInt(input.value);

        if (quantity > 0) {
            const color = row.querySelector('.silver[selected], .gold[selected], .black[selected]');
            const colorText = color ? color.getAttribute('aria-label') : '';
            const price = parseFloat(unitPrice.replace('R$ ', ''));
            const totalPrice = price * quantity;

            let item = summaryContent.querySelector(`[data-id="${modelName}-${colorText}-${sizeText}"]`);

            if (item) {
                const itemQuantity = item.querySelector('.item-quantity');
                const itemTotalPrice = item.querySelector('.item-total-price');
                const currentQuantity = parseInt(itemQuantity.textContent);
                const newQuantity = currentQuantity + quantity;
                const newTotalPrice = price * newQuantity;

                itemQuantity.textContent = newQuantity;
                itemTotalPrice.textContent = `R$ ${newTotalPrice.toFixed(2)}`;
            } else {
                item = document.createElement('div');
                item.setAttribute('data-id', `${modelName}-${colorText}-${sizeText}`);

                // Adicionar a miniatura da foto do produto
                const thumbnail = row.querySelector('img').cloneNode();
                item.appendChild(thumbnail);

                // Adicionar o nome do modelo, cor e tamanho no resumo da compra
                item.innerHTML += `
                    ${modelName} - ${colorText} - ${sizeText} ${unitPrice} x <span class="item-quantity">${quantity}</span> <span class="item-total-price">R$ ${totalPrice.toFixed(2)}</span>
                `;
                const removeButton = document.createElement('button');
                removeButton.textContent = 'x';
                removeButton.addEventListener('click', removeItem);
                item.appendChild(removeButton);
                summaryContent.appendChild(item);
            }

            // Atualizar o total da compra
            const currentTotalValue = parseFloat(totalValue.textContent || '0');
            const newTotalValue = currentTotalValue + totalPrice;
            totalValue.textContent = newTotalValue.toFixed(2);
        }

        // Resetar a quantidade do input
        input.value = 0;
    });

// Resetar a cor selecionada
const selectedColor = row.querySelector('.silver[selected], .gold[selected], .black[selected]');
if (selectedColor) {
    selectedColor.classList.remove('selected');
}
// Resetar o texto de informações
row.classList.add('reset-text');
row.addEventListener('animationend', () => {
    const totalQuantity = row.querySelector('.total-quantity');
    const totalPrice = row.querySelector('.total-price');
    totalQuantity.textContent = '';
    totalPrice.textContent = '';
    row.classList.remove('reset-text');
}, { once: true });

    // Exibir a mensagem "Adicionado" no canto superior esquerdo da linha
    let addedMessage = row.querySelector('.added-message');
    if (addedMessage) {
        clearTimeout(addedMessage.timeout);
        addedMessage.style.opacity = 1;
    } else {
        addedMessage = document.createElement('span');
        addedMessage.textContent = 'Adicionado';
        addedMessage.classList.add('added-message');
        row.appendChild(addedMessage);
    }

    // Ocultar a mensagem "Adicionado" após 3 segundos
    addedMessage.timeout = setTimeout(() => {
        addedMessage.style.opacity = 0;
    }, 3000);
}})