function _geodesicArea(latLngs) {
  let pointsCount = latLngs.length,
    area = 0.0,
    d2r = Math.PI / 180,
    p1,
    p2;

  if (pointsCount > 2) {
    for (let i = 0; i < pointsCount; i++) {
      p1 = latLngs[i];
      p2 = latLngs[(i + 1) % pointsCount];
      area +=
        (p2[1] - p1[1]) *
        d2r *
        (2 + Math.sin(p1[0] * d2r) + Math.sin(p2[0] * d2r));
    }
    area = (area * 6378137.0 * 6378137.0) / 2.0;
  }

  return Math.abs(area);
}

function area(feature) {
  let area = 0;

  if (feature.geometry.type == "Polygon") {
    area = _geodesicArea(feature.geometry.coordinates[0]);
  } else if (feature.geometry.type == "MultiPolygon") {
    for (let i of feature.geometry.coordinates) {
      area += _geodesicArea(i[0]);
    }
  }
  return area / 1000 / 1000;
}
