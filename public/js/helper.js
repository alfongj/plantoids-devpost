function drawGradient($p, x, y, w, h, c1, c2, axis) {
  $p.noFill();

  if (axis === 'y') {
    // Top to bottom gradient
    for (let i = y; i <= y + h; i++) {
      let inter = $p.map(i, y, y + h, 0, 1);
      let c = $p.lerpColor(c1, c2, inter);
      $p.strokeWeight(1);
      $p.stroke(c);
      $p.line(x, i, x + w, i);
    }
  } else if (axis === 'x') {
    // Left to right gradient
    for (let i = x; i <= x + w; i++) {
      let inter = $p.map(i, x, x + w, 0, 1);
      let c = $p.lerpColor(c1, c2, inter);
      $p.strokeWeight(1);
      $p.stroke(c);
      $p.line(i, y, i, y + h);
    }
  }
}