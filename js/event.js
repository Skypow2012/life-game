function bumpCheck(x, y, r) {
  for (id in objDic) {
    img = objDic[id];
    console.log(img)
    switch (img.config.type) {
      case 'hero':
      case 'enemy':
        let uX = utils.getNum(img.style.left);
        let uY = utils.getNum(img.style.top);
        if ((uX - x) ** 2 + (uY - y) ** 2 <= r**2) {
          img.hurted()
        }
        break;
    }
  }
}
