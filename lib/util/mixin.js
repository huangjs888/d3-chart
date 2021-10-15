/*
 * @Author: Huangjs
 * @Date: 2021-10-11 11:38:34
 * @LastEditors: Huangjs
 * @LastEditTime: 2021-10-15 11:02:30
 * @Description: ******
 */

/* class A {
  constructor() {
    this.aa = '2aa';
    this.kk = 'akk';
  }

  static a = 1;

  static af() {
    console.log(A.a);
  }

  aff() {
    console.log(this.aa, this.kk);
  }
}

class B {
  constructor() {
    this.bb = '2bb';
    this.kk = 'bkk';
  }
  static b = 1;

  static bf() {
    console.log(B.b);
  }

  bff() {
    console.log(this.bb, this.kk);
  }
}
class C {
  constructor() {
    this.cc = '2cc';
    this.kk = 'ckk';
  }
  static c = 1;

  static cf() {
    console.log(C.c);
  }

  cff() {
    console.log(this.cc, this.kk);
  }
}
const I = inherit(A, B, C);
const M = mixin(A, B, C);
console.dir(I);
console.dir(M);
const i = new I();
const m = new M();
console.dir(i);
console.dir(m); */

function defineProperties(target, source, exclude = []) {
  Object.getOwnPropertyNames(source).forEach((key) => {
    if (!exclude.find((exc) => key === exc)) {
      Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
    }
  });
}
function setPropertyOf(origClass, copyClass) {
  // 拷贝函数本身（静态）的属性
  defineProperties(origClass, copyClass, Object.getOwnPropertyNames(origClass));
  // 拷贝函数prototype（原型）的属性
  defineProperties(
    origClass.prototype,
    copyClass.prototype,
    Object.getOwnPropertyNames(origClass.prototype),
  );
}
function setPrototypeOf(subClass, superClass) {
  if (typeof superClass !== 'function' && superClass !== null) {
    throw new TypeError(
      `Super expression must either be a function or null, not ${typeof superClass}`,
    );
  }
  // 设置函数自身（静态）的__proto__
  if (superClass) Object.setPrototypeOf(subClass, superClass);
  else Object.setPrototypeOf(subClass, Function.prototype);
  // 设置函数prototype（原型）的__proto__
  Object.setPrototypeOf(subClass.prototype, superClass.prototype);
}
// 对已定义的类进行按序混合
// mixins数组后面的属性方法会覆盖前面的同名属性方法
// mixins数组内应该全是基类，并且不应是null
function mixin(...mixins) {
  function Mixin(...args) {
    mixins.forEach((M) => defineProperties(this, new M(...args))); // 拷贝实例属性
  }
  mixins.forEach((M) => setPropertyOf(Mixin, M));
  return Mixin;
}
// 对已定义的类进行按序继承
// inherits数组前面是祖父类后面是子孙类
// inherits数组内应该全是基类，如果有派生类，则新继承的祖先类需要定义该类使用super的方法
function inherit(...inherits) {
  function Inherit(...args) {
    inherits.forEach((I) => defineProperties(this, new I(...args)));
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
  const oldSuperClass = Object.getPrototypeOf(subClass);
  setPrototypeOf(subClass, newSuperClass);
  return function revoke() {
    setPrototypeOf(subClass, oldSuperClass);
  };
}
export default { mixin, inherit, replace };
