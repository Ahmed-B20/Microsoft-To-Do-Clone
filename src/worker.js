// export default onmessage = (taskDate)=>{

//     let reminderDate = (new Date(taskDate) - new Date()) / 24*60*60*1000
//     let timeChunk = reminderDate / 10

//     setInterval(()=>{
//         if (new Date() > new Date(taskDate)) {
//             postMessage(true)
//         }
//     },timeChunk)
// }

// // onmessage = (taskDate)=>{
// //     console.log(taskDate);
// // }


// if (window.Worker) {
//     const worker = new Worker('/script/worker.js')
//     worker.postMessage('')
  
//   }

// self.onmessage = ({ data: { question } }) => {
//     self.postMessage({
//       answer: 42,
//     });
//   };

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