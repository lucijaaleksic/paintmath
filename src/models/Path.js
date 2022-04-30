export default class Path {
  /**
   * Constructor for a Path object
   * @constructor
   * @param {String} id Path id
   * @param {Path2D} path Paths' path object
   * @param {Number} minX Paths' minimum x value
   * @param {Number} maxX Paths' maximum x value
   * @param {Number} minY Paths' minimum y value
   * @param {Number} maxY Paths' maximum x value
   */
  constructor(id, path, minX, maxX, minY, maxY) {
    this.id = id;
    this.path = path;
    this.minX = minX;
    this.maxX = maxX;
    this.minY = minY;
    this.maxY = maxY;
    this.normalizeBox();
  }

  /**
   * Standardizes paths bounding box to a square
   */
  normalizeBox() {
    const deltaX = this.maxX - this.minX,
      deltaY = this.maxY - this.minY;
    if (deltaX > deltaY) {
      this.minY -= (deltaX - deltaY) / 2;
      this.maxY += (deltaX - deltaY) / 2;
    } else {
      this.minX -= (deltaY - deltaX) / 2;
      this.maxX += (deltaY - deltaX) / 2;
    }
  }

  /**
   * Checks intersection with another path
   * @param other
   * @returns {boolean}
   */
  intersectsWith(other) {
    const intersectionX =
      Math.min(this.maxX, other.maxX) - Math.max(this.minX, other.minX);
    const intersectionY =
      Math.min(this.maxY, other.maxY) - Math.max(this.minY, other.minY);
    const areaThis = (this.maxX - this.minX) * (this.maxY - this.minY);
    const areaOther = (other.maxX - other.minX) * (other.maxY - other.minY);
    return (
      Math.min(areaThis, areaOther) / (intersectionX * intersectionY) > 0.5 // if overlap between bounding boxe > 60%
    );
  }

  /**
   * Adds other path
   * @param {Path} other
   */
  addOther(other) {
    this.path.addPath(other.path);
    this.minX = Math.min(this.minX, other.minX);
    this.maxX = Math.max(this.maxX, other.maxX);
    this.minY = Math.min(this.minY, other.minY);
    this.maxY = Math.max(this.maxY, other.maxY);
  }

  /**
   * Checks path insignificance
   * @returns {boolean} If the path is insignificant
   */
  insignificant() {
    return this.maxX - this.minX < 15 && this.maxY - this.minY < 15;
  }
}
