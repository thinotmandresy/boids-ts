export default class QuadTree {
  private boundary: Rectangle;
  private capacity: number;
  private points: Point[] = [];
  private divided: boolean = false;
  private ne: QuadTree | null = null;
  private nw: QuadTree | null = null;
  private se: QuadTree | null = null;
  private sw: QuadTree | null = null;

  constructor(boundary: Rectangle, capacity: number) {
    this.boundary = boundary;
    this.capacity = capacity;
  }

  insert(point: Point): boolean {
    if (!this.has(point)) return false;

    if (this.points.length < this.capacity && !this.divided) {
      this.points.push(point);
      return true;
    }

    if (!this.divided) this.subdivide();

    return (
      this.ne!.insert(point) ||
      this.nw!.insert(point) ||
      this.se!.insert(point) ||
      this.sw!.insert(point)
    );
  }

  query(range: Rectangle, found: Point[] = []): Point[] {
    if (!this.intersects(range)) return found;

    for (const point of this.points) {
      if (
        point.x >= range.x &&
        point.x < range.x + range.width &&
        point.y >= range.y &&
        point.y < range.y + range.height
      ) {
        found.push(point);
      }
    }

    if (this.divided) {
      this.ne!.query(range, found);
      this.nw!.query(range, found);
      this.se!.query(range, found);
      this.sw!.query(range, found);
    }

    return found;
  }

  private subdivide() {
    const { x, y, width, height } = this.boundary;
    const halfWidth = width / 2;
    const halfHeight = height / 2;

    this.ne = new QuadTree(
      { x: x + halfWidth, y, width: halfWidth, height: halfHeight },
      this.capacity
    );
    this.nw = new QuadTree(
      { x, y, width: halfWidth, height: halfHeight },
      this.capacity
    );
    this.se = new QuadTree(
      { x: x + halfWidth, y: y + halfHeight, width: halfWidth, height: halfHeight },
      this.capacity
    );
    this.sw = new QuadTree(
      { x, y: y + halfHeight, width: halfWidth, height: halfHeight },
      this.capacity
    );
    this.divided = true;
  }

  private has(point: Point): boolean {
    return (
      point.x >= this.boundary.x &&
      point.x < this.boundary.x + this.boundary.width &&
      point.y >= this.boundary.y &&
      point.y < this.boundary.y + this.boundary.height
    );
  }

  private intersects(range: Rectangle): boolean {
    return !(
      range.x > this.boundary.x + this.boundary.width ||
      range.x + range.width < this.boundary.x ||
      range.y > this.boundary.y + this.boundary.height ||
      range.y + range.height < this.boundary.y
    );
  }
}
