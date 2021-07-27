export default function log() {
  const id = '__log__id__';
  let ele = document.getElementById(id);
  const text = 'hello,HMR';
  if (ele) return (ele.innerHTML = text);
  ele = document.createElement('h4');
  ele.id = id;
  ele.innerHTML = text;
  document.body.appendChild(ele);
}
