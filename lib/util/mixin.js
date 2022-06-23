"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _construct2 = _interopRequireDefault(require("@babel/runtime/helpers/construct"));

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

/*
 * @Author: Huangjs
 * @Date: 2021-10-11 11:38:34
 * @LastEditors: Huangjs
 * @LastEditTime: 2021-12-08 09:25:05
 * @Description: ******
 */
function defineProperties(target, source) {
  var exclude = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
  Object.getOwnPropertyNames(source).forEach(function (key) {
    if (!exclude.find(function (exc) {
      return key === exc;
    })) {
      // @ts-ignore
      Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
    }
  });
}

function setPropertyOf(origClass, copyClass) {
  // 拷贝函数本身（静态）的属性
  defineProperties(origClass, copyClass, Object.getOwnPropertyNames(origClass)); // 拷贝函数prototype（原型）的属性

  defineProperties(origClass.prototype, copyClass.prototype, Object.getOwnPropertyNames(origClass.prototype));
}

function setPrototypeOf(subClass, superClass) {
  if (typeof superClass !== 'function' && superClass !== null) {
    throw new TypeError("Super expression must either be a function or null, not ".concat((0, _typeof2.default)(superClass)));
  } // 设置函数自身（静态）的__proto__


  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;else Object.setPrototypeOf ? Object.setPrototypeOf(subClass, Function.prototype) : subClass.__proto__ = Function.prototype; // 设置函数prototype（原型）的__proto__

  Object.setPrototypeOf ? Object.setPrototypeOf(subClass.prototype, superClass.prototype) : subClass.prototype.__proto__ = superClass.prototype;
} // 对已定义的类进行按序混合
// mixins数组后面的属性方法会覆盖前面的同名属性方法
// mixins数组内应该全是基类，并且不应是null


function mixin() {
  for (var _len = arguments.length, mixins = new Array(_len), _key = 0; _key < _len; _key++) {
    mixins[_key] = arguments[_key];
  }

  function Mixin() {
    var _this = this;

    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    mixins.forEach(function (M) {
      return defineProperties(_this, (0, _construct2.default)(M, args));
    }); // 拷贝实例属性
  }

  mixins.forEach(function (M) {
    return setPropertyOf(Mixin, M);
  });
  return Mixin;
} // 对已定义的类进行按序继承
// inherits数组前面是祖父类后面是子孙类
// inherits数组内应该全是基类，如果有派生类，则新继承的祖先类需要定义该类使用super的方法


function inherit() {
  for (var _len3 = arguments.length, inherits = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
    inherits[_key3] = arguments[_key3];
  }

  function Inherit() {
    var _this2 = this;

    for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
      args[_key4] = arguments[_key4];
    }

    inherits.forEach(function (I) {
      return defineProperties(_this2, (0, _construct2.default)(I, args));
    });
  }

  inherits.concat([Inherit]).reduceRight(function (A, B) {
    setPrototypeOf(A, B);
    return B;
  });
  return Inherit;
} // 将原来的subClass父类替换成newSuperClass
// 注意：subClass必须是派生类（保证构造函数使用super方法）
// 并且如果subClass的方法里有使用super.xxx()，则替换的newSuperClass或newSuperClass的祖先原型里必须定义xxx方法


function replace(subClass, newSuperClass) {
  var oldSuperClass = Object.getPrototypeOf ? Object.getPrototypeOf(subClass) : subClass.__proto__;
  setPrototypeOf(subClass, newSuperClass);
  return function revoke() {
    setPrototypeOf(subClass, oldSuperClass);
  };
}

var _default = {
  mixin: mixin,
  inherit: inherit,
  replace: replace
};
exports.default = _default;
//# sourceMappingURL=mixin.js.map