---
layout: post
read_time: true
show_date: true
title: "this, apply, call, bind"
date: 2024-06-14
img: posts/20240614/title.jpeg
tags: [js]
category: js
author: Jalymg
description: "this, apply, call, bind"
---

## return fn.apply(this, args) 和 return fn(args)
### 参数传递
fn.apply(this, args)

- apply 方法接收两个参数：一个是 this 值，另一个是参数数组。
- 使用 apply 方法可以将参数数组展开并传递给函数 fn。

fn(args)

- 这种写法将整个 args 数组作为单个参数传递给函数 fn。
- 函数 fn 会将 args 数组视为第一个参数，其余参数为 undefined。

```jsx
function fn(a, b, c) {
  console.log(a, b, c);
}

const args = [1, 2, 3];
fn.apply(this, args); // 相当于调用 fn(1, 2, 3)
```

```jsx
function fn(a) {
  console.log(a);
}

const args = [1, 2, 3];
fn(args); // 相当于调用 fn([1, 2, 3])
```
### this 绑定
fn.apply(this, args)

- apply 方法允许指定 this 的值，这在一些上下文中很重要，特别是当函数内部使用 this 时。

fn(args)

- 直接调用函数时，this 绑定取决于函数调用的方式。通常情况下，如果不是作为对象的方法调用，this 会是 undefined（在严格模式下）或全局对象（在非严格模式下）。

```jsx
const obj = {
  value: 42,
  getValue: function() {
    console.log(this.value);
  }
};

const otherObj = {
  value: 100
};

obj.getValue.apply(otherObj); // 输出: 100
```

```jsx
function getValue() {
  console.log(this.value);
}

const obj = {
  value: 42,
  getValue: getValue
};

const otherObj = {
  value: 100
};

getValue(); // 在非严格模式下，输出: undefined 或者全局对象的 value
```

```jsx
function example(a, b, c) {
  console.log(a, b, c);
}

const args = [1, 2, 3];

example.apply(this, args); // 输出: 1 2 3
example(args);             // 输出: [1, 2, 3] undefined undefined
```

### 总结

- 参数传递：apply 可以将参数数组展开并传递，而直接调用 fn(args) 会将整个数组作为单个参数传递。
- this 绑定：apply 可以显式设置 this 的值，而直接调用时，this 绑定依赖于调用上下文。

因此，使用哪种方式取决于具体的需求。如果需要传递多个参数并且可能涉及 this 的绑定问题，apply 更合适；如果只是简单地传递一个数组作为参数，直接调用也可以。
## apply，bind，call之间的区别
apply、bind 和 call 是 JavaScript 中的三种函数方法，用于控制函数调用时的 this 绑定和参数传递。它们之间的主要区别如下：
### call

- 用途: 调用函数，并允许指定 this 和单个参数序列。
- 语法: func.call(thisArg, arg1, arg2, ...)
- 特点:

thisArg 是函数运行时的 this 值。之后的参数是直接传递给函数的。

```jsx
function greet(greeting, punctuation) {
  console.log(greeting + ', ' + this.name + punctuation);
}

const person = { name: 'Alice' };

greet.call(person, 'Hello', '!'); // 输出: Hello, Alice!
```

### apply

- 用途: 调用函数，并允许指定 this 和参数数组。
- 语法: func.apply(thisArg, [argsArray])
- 特点:

thisArg 是函数运行时的 this 值。第二个参数是一个数组（或类数组对象），其元素作为函数的参数。

```jsx
function greet(greeting, punctuation) {
  console.log(greeting + ', ' + this.name + punctuation);
}

const person = { name: 'Alice' };

greet.apply(person, ['Hello', '!']); // 输出: Hello, Alice!
```

### bind

- 用途: 创建一个新的函数，并允许指定 this 和预设参数。
- 语法: func.bind(thisArg, arg1, arg2, ...)
- 特点:

thisArg 是新函数运行时的 this 值。后面的参数在调用新函数时预设。返回一个新函数，原函数不会立即执行。

```jsx
function greet(greeting, punctuation) {
  console.log(greeting + ', ' + this.name + punctuation);
}

const person = { name: 'Alice' };

const greetAlice = greet.bind(person, 'Hello');
greetAlice('!'); // 输出: Hello, Alice!
```

**在事件处理器或延迟执行**的情况下，bind 非常有用：

```jsx
const person = {
  name: 'Alice',
  greet: function() {
    console.log('Hello, ' + this.name);
  }
};

const button = document.getElementById('myButton');
button.addEventListener('click', person.greet.bind(person));
```

### 比较总结

- 参数传递方式:

call 逐个传递参数。
apply 传递一个参数数组。
bind 可以预设部分参数，其余参数在调用时传递。

- 函数调用时机:

call 和 apply 会立即调用函数。
bind 会返回一个新函数，不会立即调用。

- this 绑定:

三者都可以显式设置函数的 this 值。
bind 返回的新函数可以在将来任何时候调用，且 this 值被永久绑定。
### 示例对比

```jsx
const obj = { name: 'Alice' };

function showDetails(greeting, punctuation) {
  console.log(greeting + ', ' + this.name + punctuation);
}

// call: 立即调用函数，参数逐个传递
showDetails.call(obj, 'Hello', '!'); // 输出: Hello, Alice!

// apply: 立即调用函数，参数以数组形式传递
showDetails.apply(obj, ['Hi', '!!!']); // 输出: Hi, Alice!!!

// bind: 返回一个新函数，参数可以预设或在调用时传递
const boundFunc = showDetails.bind(obj, 'Hey');
boundFunc('?'); // 输出: Hey, Alice?
```

通过这些例子，可以看出 call 和 apply 的主要区别在于参数的传递方式，而 bind 返回一个新函数，可以延迟调用，并且 this 值和预设参数在创建时已经绑定。
## apply，call的不同之处
### call 和 apply 的区别

- call 接受的是参数列表。
- apply 接受的是参数数组。

```jsx
function greet(greeting, punctuation) {
  console.log(greeting + ', ' + this.name + punctuation);
}

const person = { name: 'Alice' };

greet.call(person, 'Hello', '!'); // Hello, Alice!
greet.apply(person, ['Hello', '!']); // Hello, Alice!
```

### 为什么需要 apply 和 call？
#### 灵活性和便利性

1. 使用参数数组： 当已经有一个参数数组时，使用 apply 会更加简便。例如，如果有一个函数需要将一组参数传递给另一个函数：

```jsx
function sum(a, b, c) {
  return a + b + c;
}

const numbers = [1, 2, 3];
console.log(sum.apply(null, numbers)); // 6
```

如果没有 apply，需要使用 call 并展开数组，这样会显得更加繁琐：

```jsx
console.log(sum.call(null, ...numbers)); // 6
```

2. 处理未知数量的参数： 在处理参数数量不确定的情况下，apply 提供了更好的处理方式，**通过 apply 将 1, 2, 3, 4, 5 这些参数传入 Math.max() 中，因为 Math.max() 不能直接接收 一个Array 作为函数参数**。例如，当需要将函数的所有参数传递给另一个函数时：

```jsx
function max() {
  return Math.max.apply(null, arguments);
}

console.log(max(1, 2, 3, 4, 5)); // 5
```

对上述代码 Math.max.apply(null, arguments) 的解析：
Math.max 函数：该函数接受任意数量的数值参数，返回其中的最大值。例如：

```jsx
console.log(Math.max(1, 2, 3, 4, 5)); // 输出 5
```

arguments 对象：这是一个类数组对象，包含了函数调用时传入的所有参数。例如：

```jsx
function example() {
  console.log(arguments);
}
example(1, 2, 3); // 输出 [1, 2, 3]
```

Function.prototype.apply 方法：它可以调用一个函数，并以数组的形式传递参数。语法是 func.apply(thisArg, [argsArray])。例如：

```jsx
function sum(a, b) {
  return a + b;
}
console.log(sum.apply(null, [1, 2])); // 输出 3
```

#### 历史原因和一致性

- 历史原因：JavaScript 早期版本就已经引入了 call 和 apply。为了向后兼容，不能随意移除其中一个。
- 一致性：JavaScript 保持这两种方法的存在，以便开发者在不同情况下选择最方便的方式。
### 总结
虽然 apply 和 call 的功能类似，但它们在处理不同类型的参数传递时提供了额外的灵活性和便利性。两个方法的存在使得 JavaScript 在处理函数调用时更加灵活，能够更好地应对不同的编程需求和场景。
## this
this 是 JavaScript 中一个非常重要且复杂的概念，它的指向在不同的执行上下文（context）中会有所不同。下面将详细解释 this 在不同情况下的指向：
### 1. 全局上下文
在全局执行上下文中（即在任何函数之外），this 指向全局对象。 在浏览器中，这个全局对象是 window 对象；在 Node.js 中，它是 global 对象。

```jsx
console.log(this); // 在浏览器中，输出 window
```

### 2. 函数上下文
在普通函数调用中，this 的值取决于函数的调用方式。没有任何特殊操作的话，this 默认指向全局对象（严格模式下，this 是 undefined）。

```jsx
function foo() {
  console.log(this);
}

foo(); // 非严格模式下，输出 window（全局对象）
```

### 3. 对象的方法
当函数作为对象的方法被调用时，this 指向调用该方法的对象。

```jsx
const obj = {
  name: 'Alice',
  greet: function() {
    console.log(this.name);
  }
};

obj.greet(); // 输出 'Alice'
```

### 4. 构造函数
当通过 new 关键字调用函数时，this 指向新创建的对象。

```jsx
function Person(name) {
  this.name = name;
}

const alice = new Person('Alice');
console.log(alice.name); // 输出 'Alice'
```

### 5. call 和 apply
这两个方法可以用来显式地指定函数调用时的 this 指向。

```jsx
function greet() {
  console.log(this.name);
}

const person = {
  name: 'Alice'
};

greet.call(person); // 输出 'Alice'
greet.apply(person); // 输出 'Alice'
```

### 6. bind
bind 方法会创建一个新函数，这个新函数的 this 永远会被指定为 bind 的第一个参数。

```jsx
function greet() {
  console.log(this.name);
}

const person = {
  name: 'Alice'
};

const greetPerson = greet.bind(person);
greetPerson(); // 输出 'Alice'
```

### 7. 箭头函数
箭头函数的 this 是词法作用域，由外层（函数或全局）上下文决定。它不会创建自己的 this。

```jsx
const obj = {
  name: 'Alice',
  greet: function() {
    const innerGreet = () => {
      console.log(this.name);
    };
    innerGreet();
  }
};

obj.greet(); // 输出 'Alice'
```

### 8. 事件处理器
在事件处理器中，this 通常指向触发事件的元素。

```jsx
document.getElementById('myButton').addEventListener('click', function() {
  console.log(this); // 输出被点击的按钮
});
```

### 9. DOM元素的方法
当调用 DOM 元素的方法时，this 通常指向该元素。

```jsx
const button = document.getElementById('myButton');
button.addEventListener('click', function() {
  console.log(this); // this 指向 button 元素
});
```

### 10. 模块和类
在模块和类中，this 通常指向模块或类的实例。

```jsx
class Person {
  constructor(name) {
    this.name = name;
  }

  greet() {
    console.log(this.name);
  }
}

const alice = new Person('Alice');
alice.greet(); // 输出 'Alice'
```

### 总结

- 在全局上下文中，非严格模式下 this 指向全局对象。
- 在函数中，this 的指向取决于函数的调用方式。
- 箭头函数的 this 由外层作用域决定。
- 使用 call、apply、bind 可以显式设置 this 的指向。
- 在对象的方法中，this 指向调用该方法的对象。
- 构造函数调用时，this 指向新创建的对象。
