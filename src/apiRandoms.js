function generateRandomNum(max) {
    return Math.floor(Math.random() * max) + 1;
}

function getRandoms(cant) {
    var object = {};
    for(let i = 0; i < cant; i++){
        const num = generateRandomNum(cant);
        if(object.hasOwnProperty(`${num}`)){
            object[`${num}`]++;
        } else {
            object[`${num}`] = 1;
        }  
    }
    return object;
}

process.on('message', (msg) => {
    if (msg.start === true) {
        const response = getRandoms(msg.cant)
        process.send(response);
    }
});

export default getRandoms;