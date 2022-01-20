function updateTime(time) {
  window.time = time;
}
var isHolding;
window.onload = function () {
  var isCtrling = false;
  var outTop = 300;
  var outLeft = 200;
  var cTop = 38;
  var cLeft = 38;
  var maxR = 75;
  var maxUserX = document.body.clientWidth;
  var maxUserY = document.body.clientHeight;
  window.x = cLeft;
  window.y = cTop;
  
  if (!window.ctrl) {
    var ctrl = document.createElement('div');
    ctrl.className = 'ctrl';
    var circle = document.createElement('div')
    circle.className = 'circle';
    ctrl.appendChild(circle);
    document.body.appendChild(ctrl);
    window.ctrl = ctrl;
  }
  document.addEventListener('touchstart', addCtrl);
  document.addEventListener('mousedown', addCtrlMouse);
  document.addEventListener('touchend', stopCtrl);
  document.addEventListener('mouseup', stopCtrl);
  document.addEventListener('touchmove', touchMoveCtrl);
  document.addEventListener('mousemove', mouseMoveCtrl);

  function addCtrl(e) {
    let ctrl = document.querySelector('.ctrl');
    let clientX = e.touches[0].clientX;
    let clientY = e.touches[0].clientY;
    outLeft = clientX - cLeft;
    outTop = clientY - cTop;
    ctrl.style.left = outLeft + 'px';
    ctrl.style.top = outTop + 'px';
    ctrl.style.display = 'inline-block';
    startCtrl(e);
  }

  function addCtrlMouse(e) {
    let ctrl = document.querySelector('.ctrl');
    let clientX = e.x;
    let clientY = e.y;
    outLeft = clientX - cTop;
    outTop = clientY - cLeft;
    ctrl.style.left = outLeft + 'px';
    ctrl.style.top = outTop + 'px';
    ctrl.style.display = 'inline-block';
    startCtrl(e);
  }

  function startCtrl(e) {
    isCtrling = true;
    isHolding = setInterval(()=>{
      // 第一次蓄力
      let uX = getNum(user.style.left);
      let uY = getNum(user.style.top);
      addBump(uX, uY)
      stopHolding()
    }, 1000)
  }

  function stopHolding() {
    delete isHolding;
    clearInterval(isHolding)
  }

  function touchMoveCtrl(e) {
    try {
      if (isCtrling) {
        let clientX = e.touches[0].clientX;
        let clientY = e.touches[0].clientY;
        updateCircle(clientX, clientY);
      }
    } catch (e) {
      log(e);
    }
  }

  function mouseMoveCtrl(e) {
    try {
      if (isCtrling) {
        let clientX = e.x;
        let clientY = e.y;
        updateCircle(clientX, clientY);
      }
    } catch (e) {
      log(e);
    }
  }

  function stopCtrl(e) {
    isCtrling = false;
    circleBackStart();
    hideCtrl();
    stopHolding();
  }

  // 让控制器圆点回到原点
  function circleBackStart() {
    moveCircle(38, 38);
  }
  // 隐藏控制器
  function hideCtrl() {
    let ctrl = document.querySelector('.ctrl');
    ctrl.style.display = 'none';
  }

  // 自动控制器圆点
  function moveCircle(x, y) {
    let circle;
    if (window.circle) {
      circle = window.circle;
    } else {
      circle = document.querySelector('.ctrl .circle');
      window.circle = circle;
    }
    window.x = x;
    window.y = y;
    circle.style.left = x + 'px';
    circle.style.top = y + 'px';
  }

  // 更新控制圆点位置
  function updateCircle(x, y) {
    x = (x - cLeft - outLeft);
    y = (y - cTop - outTop);
    let r = Math.sqrt(x * x + y * y);
    if (r > maxR) {
      x = x * maxR / r;
      y = y * maxR / r;
    }
    moveCircle(x + cLeft, y + cTop)
    stopHolding();
  }

  function updateUser(x, y) {
    if (x > maxUserX) {
      x = maxUserX;
    }
    if (x < 0) {
      x = 0;
    }
    if (y > maxUserY) {
      y = maxUserY;
    }
    if (y < 0) {
      y = 0;
    }
    moveUser(x, y)
  }

  function addBump(x, y, r=25) {
    const bump = create({type: 'bump', x, y})
    bump.style.borderWidth = '10px';
    bump.style.borderColor = 'rgba(0,0,0,1)';
    // 爆炸事件
    setTimeout(()=>{
      bump.style.borderWidth = r+'px';
      bump.style.borderColor = 'rgba(255,0,0,.5)';
      setTimeout(()=>{
        bump.destroy();
        bumpCheck(x, y, r)
      }, 200)
    }, 1000)
  }

  function moveUser(x, y) {
    let user;
    if (window.user) {
      user = window.user;
    } else {
      user = document.querySelector('#user');
      window.user = user;
    }
    window.userX = x;
    window.userY = y;
    user.style.left = x + 'px';
    user.style.top = y + 'px';
    user.style.zIndex = parseInt(y);
    if (user.locCb) user.locCb(x, y);
  }

  function getNum(val) {
    if (typeof (val) == 'string') {
      return Number(val.replace('px', ''));
    } else if (typeof (val) == 'number') {
      return val;
    } else {
      return 0;
    }
  }
  window.utils = window.utils || {};
  window.utils.getNum = getNum;

  function log(msg) {
    console.log(msg);
    // document.body.innerHTML += '<p>' + msg + '</p>';
  }
  window.inter = setInterval(function () {
    if (!isCtrling) return;
    let _x = (window.x - cTop) / 10;
    let _y = (window.y - cLeft) / 10;
    let user = document.getElementById('user')
    // 判断角色朝向
    let oldOriginLeft = user.style.transform.indexOf(180) > -1;
    let newOriginLeft = _x < 0;
    if (oldOriginLeft !== newOriginLeft) {
      console.log('change')
      user.style.transform = `translateX(-24px) translateY(-24px) rotateY(${newOriginLeft?180:0}deg)`
    }
    let uX = getNum(user.style.left);
    let uY = getNum(user.style.top);
    let fX = uX + _x;
    let fY = uY + _y;
    updateUser(fX, fY);
  }, 20)
}
