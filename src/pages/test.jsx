// import React from 'react';
// import { Button } from 'antd';
// const Test = () =>{
//     const debounce = (fn, delay) => {
//         let timer = null
//         return function(...args){
//             if(timer) clearTimeout(timer);
//             timer = setTimeout(() => {
//                 fn.apply(this, args);
//                 timer = null;
//             }, delay);
//         }
//     }
//     const onClickBtn = debounce(() => {
//         console.log('点击');
//     }, 1000);

//     return (
//         <div>
//             测试页面
//             <Button type="primary" onClick={onClickBtn}>点击</Button>
//         </div>
//     )
// }
// export default Test;

const a = () => {
  let i = 1;
  return () => {
    i++;
    console.log(i);
  };
};
const b = a();
b();
