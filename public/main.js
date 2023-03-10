const socket = io("https://ghibli-store-sv-production.up.railway.app/", {
    transports: [ "websocket" ]
});

const logout = () => {
    window.location.replace("/logout");
}

const enviarProducto = (e) => {
    const title = document.getElementById("title").value;
    const price = document.getElementById("price").value;
    const thumbnail = document.getElementById("thumbnail").value;
    const product = { title: title, price: price, thumbnail: thumbnail };
    socket.emit('new_product', product);
    return false;
};

const crearEtiquetasProducto = (product) => {
    const { title, price, thumbnail } = product;
    return `
        <tr>
            <td>${title}</td>
            <td>${price}</td>
            <td><img style="width: 50px; height:50px" src=${thumbnail} alt=${title}></td>
        </tr> `
};

const agregarProductos = (products) => {
    const finalProducts = products.map(p => crearEtiquetasProducto(p)).join(" ");
    document.getElementById("productsTable").innerHTML = finalProducts; 
};

socket.on('products', (products) => agregarProductos(products));

//-------------------------------------------------------------------

const authorSchema = new normalizr.schema.Entity("authors",{},{idAttribute:"email"})
const messageSchema = new normalizr.schema.Entity("messages",{
    author:authorSchema
})
const arrayMessagesSchema = new normalizr.schema.Entity("arrayMessages",{
    messages: [messageSchema]
})

const enviarMensaje = (user) => {
    const id = user;
    const text = document.getElementById('text').value;
    const date = String(new Date().toDateString() + ' ' + new Date().toLocaleTimeString())
    
    const author = { id };
    const message = { author, text, date}
    socket.emit('new_message', (message));
    return false;
}

const crearEtiquetasMensaje = (message) => {
    const { id } = message.author;
    const { text, date } = message;
    
    return `
    <div class="mb-4">
        <strong style="color: #EBBAB9">${id}</strong>
        <p class="text-success">${date}</p>
        <i>${text}</i>
    </div>
    `;
}

const agregarMensajes = (messages) => {
    if (messages !== null) {
        const finalMessages = messages.map(m => crearEtiquetasMensaje(m)).join(' ');
        document.getElementById('messages').innerHTML = finalMessages;
    }
}

socket.on('messages', (messages) => agregarMensajes(messages));

const agregarProducto = async (prodId, cartId) => {
    try {     
        if(!cartId){
            cartId = -1;
        }
        const response = await fetch(`/api/cart/${cartId}/products`, {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({prod_id: prodId})
        });
        console.log('Completed!', response);
    } catch(err) {
        console.error(`Error: ${err}`);
    }
  
}

const eliminarProducto = async (prodId, cartId) => {
    try {     
        const response = await fetch(`/api/cart/${cartId}/products/${prodId}`, {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
        console.log('Completed!', response);
    } catch(err) {
        console.error(`Error: ${err}`);
    }
  
}

const hacerPedido = async (cartId) => {
    try {     
        const response = await fetch(`/api/cart/${cartId}/checkout`, {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
        console.log('Completed!', response);
    } catch(err) {
        console.error(`Error: ${err}`);
    }
  
}