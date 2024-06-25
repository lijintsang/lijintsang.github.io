// 获取canvas元素
const cvs = document.getElementById('bg');
// 获取窗口尺寸
const width = window.innerWidth * devicePixelRatio,
  height = window.innerHeight * devicePixelRatio;
// 设置canvas尺寸为窗口尺寸
cvs.width = width;
cvs.height = height;
// 获取绘制上下文
const ctx = cvs.getContext('2d');
// 字体大小
const fontSize = 20 * devicePixelRatio;
// 列宽
const columnWidth = fontSize;
// 列的数量
const columnCount = Math.floor(width / columnWidth);
// 每一列下一个文字是第几个文字
const nextChar = new Array(columnCount).fill(0);

// 绘制
function draw() {
  // 每调用一次 draw 方法 就会使用一个半透明的矩形填充背景 使之前的文字变淡 越早绘制的越淡
  ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
  ctx.fillRect(0, 0, width, height);
  // 绘制文字
  for (let i = 0; i < columnCount; i++) {
    const char = getRandomCharacter(); // 文字
    ctx.fillStyle = getRandomColor(); // 颜色
    ctx.font = `${fontSize}px "Roboto Mono"`; // 字体 字体大小
    // 位置
    const x = i * columnWidth;
    const index = nextChar[i];
    const y = (index + 1) * fontSize;
    ctx.fillText(char, x, y);
    if (y > height && Math.random() > 0.99) {
      // 如果文字已经超出了画布且随机数大于 0.99，就重置起始位置为 0，目的是让文字产生错落效果
      nextChar[i] = 0;
    } else {
      // 更新坐标 绘制下一行文字
      nextChar[i]++;
    }
  }
}

// 随机颜色
function getRandomColor() {
  // 生成一个 0 到 16777215 之间的随机数 (0xFFFFFF 是 16777215 的十六进制表示)
  const randomColor = Math.floor(Math.random() * 16777215).toString(16);

  // 如果生成的颜色代码长度不足 6 位，前面补 0
  return `#${randomColor.padStart(6, '0')}`;
}

// 随机字符
function getRandomCharacter() {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:\'",.<>?/`~';
  const randomIndex = Math.floor(Math.random() * characters.length);
  return characters.charAt(randomIndex);
}

draw();
setInterval(draw, 40);
