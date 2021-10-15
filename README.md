<!--
 * @Author: Huangjs
 * @Date: 2021-05-10 15:55:29
 * @LastEditors: Huangjs
 * @LastEditTime: 2021-05-10 16:44:47
 * @Description: ******
-->
## d3-chart
基于d3库实现一些图表
目前只有热力图和曲线图
### 使用方法
```javascript
import encrypt from '@huangjs888/rsa-encrypt';
import api from './api';


// modulus和publicExponent是16进制的(N,E)值，需要解密方给予对应的值
const modulus ='00db5ae7937c3b485dfdab80e6db019d2de26ca7e00b044611b15dff9390ca6a279f75b8e5d99ecc531d551f23604a3bcc42a0c7da9f9f8ed661732815ff8cff5382d789d8d623ebfdd2bb72027d606b1c5e7691ff1114e6df31e1f3909a6133b030238c32d3e8bac1678cfe3eb01bc297d7ccbcacb948d385b3495228600c8cbb';
const publicExponent = '10001';
encrypt.set(modulus,publicExponent);

const submit = ()=>{
  const useName = 'Huangjs';
  const password = 'test@123';
  api.login(useName,encrypt(password));
}
// 登录事件里调用submit方法

