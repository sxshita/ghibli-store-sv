function getInfo() {
    const info = {
        OS: process.platform, 
        nodeVersion: process.version, 
        rss: process.memoryUsage.rss(), 
        pid: process.ppid, 
        execPath: process.execPath, 
        dir: process.argv[1],
        currentProcessors: os.cpus().length
    }

    console.log(info);
    return info;
}

process.on('message', (msg) => {
    if (msg.start === true) {
        const response = getInfo()
        process.send(response);
    }
});