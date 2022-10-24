export default onmessage = (taskDate)=>{

    let reminderDate = (new Date(taskDate) - new Date()) / 24*60*60*1000
    let timeChunk = reminderDate / 10

    setInterval(()=>{
        if (new Date() > new Date(taskDate)) {
            postMessage(true)
        }
    },timeChunk)
}

// onmessage = (taskDate)=>{
//     console.log(taskDate);
// }