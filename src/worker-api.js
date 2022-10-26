const worker = new Worker(new URL('./worker.js', import.meta.url));

// worker.onmessage = ({ data: { answer } }) => {
//   console.log(answer);
// };

export default function sendMessage(msg){
    console.log(msg);
    worker.postMessage(msg);
}