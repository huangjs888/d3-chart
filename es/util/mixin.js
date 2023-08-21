// @ts-nocheck
/*
 * @Author: Huangjs
 * @Date: 2021-10-11 11:38:34
 * @LastEditors: Huangjs
 * @LastEditTime: 2022-07-01 14:36:55
 * @Description: ******
 */

function defineProperties(target, source, exclude = []) {
  Object.getOwnPropertyNames(source).forEach(key => {
    if (!exclude.find(exc => key === exc)) {
      Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
    }
  });
}
function setPropertyOf(origClass, copyClass) {
  // 拷贝函数本身（静态）的属性
  defineProperties(origClass, copyClass, Object.getOwnPropertyNames(origClass));
  // 拷贝函数prototype（原型）的属性
  defineProperties(origClass.prototype, copyClass.prototype, Object.getOwnPropertyNames(origClass.prototype));
}
function setPrototypeOf(subClass, superClass) {
  if (typeof superClass !== 'function' && superClass !== null) {
    throw new TypeError(`Super expression must either be a function or null, not ${typeof superClass}`);
  }
  // 设置函数自身（静态）的__proto__
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;else Object.setPrototypeOf ? Object.setPrototypeOf(subClass, Function.prototype) : subClass.__proto__ = Function.prototype;
  // 设置函数prototype（原型）的__proto__
  Object.setPrototypeOf ? Object.setPrototypeOf(subClass.prototype, superClass.prototype) : subClass.prototype.__proto__ = superClass.prototype;
}
// 对已定义的类进行按序混合
// mixins数组后面的属性方法会覆盖前面的同名属性方法
// mixins数组内应该全是基类，并且不应是null
function mixin(...mixins) {
  function Mixin(...args) {
    mixins.forEach(M => defineProperties(this, new M(...args))); // 拷贝实例属性
  }

  mixins.forEach(M => setPropertyOf(Mixin, M));
  return Mixin;
}
// 对已定义的类进行按序继承
// inherits数组前面是祖父类后面是子孙类
// inherits数组内应该全是基类，如果有派生类，则新继承的祖先类需要定义该类使用super的方法
function inherit(...inherits) {
  function Inherit(...args) {
    inherits.forEach(I => defineProperties(this, new I(...args)));
  }
  inherits.concat([Inherit]).reduceRight((A, B) => {
    setPrototypeOf(A, B);
    return B;
  });
  return Inherit;
}
// 将原来的subClass父类替换成newSuperClass
// 注意：subClass必须是派生类（保证构造函数使用super方法）
// 并且如果subClass的方法里有使用super.xxx()，则替换的newSuperClass或newSuperClass的祖先原型里必须定义xxx方法
function replace(subClass, newSuperClass) {
  const oldSuperClass = Object.getPrototypeOf ? Object.getPrototypeOf(subClass) : subClass.__proto__;
  setPrototypeOf(subClass, newSuperClass);
  return function revoke() {
    setPrototypeOf(subClass, oldSuperClass);
  };
}
export default {
  mixin,
  inherit,
  replace
};