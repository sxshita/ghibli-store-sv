const socket = io();

const logout = () => {
    window.location.replace("/logout");
}

const enviarProducto = (e) => {
    const title = document.getElementById("title").value;
    const price = document.getElementById("price").value;
    const thumbnail = document.getElementById("thumbnail").value;
    const product = { title: title, price: price, thumbnail: thumbnail };
    console.log(product)
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
    <div>
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