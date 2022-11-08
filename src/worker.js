self.onmessage = (taskDate)=>{
    let reminderDate = (new Date(taskDate.data).getTime() - new Date().getTime())
    let timeChunk = reminderDate / 10

    let myInterval = setInterval(()=>{
        if (new Date() >= new Date(taskDate.data)) {
            postMessage(true)
            console.log('work');
            clearInterval(myInterval)
        }
    },timeChunk)
}