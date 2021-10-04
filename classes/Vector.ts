export class Vector3 {
  constructor(
    public x: number = 0,
    public y: number = 0,
    public z: number = 0
  ) {}

  public add(vec: Vector3): void {
    this.x += vec.x;
    this.y += vec.y;
    this.z += vec.z;
  }
  public clone(): Vector3 {
    return new Vector3(this.x, this.y, this.z);
  }

  public getRotatedWith(
    rotation: Vector3,
    origin: Vector3 = new Vector3()
  ): Vector3 {
    let result: Vector3 = this.clone();
    let tmp: Vector3 = new Vector3();

    // x-axis
    tmp.y = Math.cos(rotation.x) * result.y - Math.sin(rotation.x) * result.z;
    tmp.z = Math.sin(rotation.x) * result.y + Math.cos(rotation.x) * result.z;
    result.y = tmp.y;
    result.z = tmp.z;

    // y-axis
    tmp.x = Math.cos(rotation.y) * result.x - Math.sin(rotation.y) * result.z;
    tmp.z = Math.sin(rotation.y) * result.x + Math.cos(rotation.y) * result.z;
    result.x = tmp.x;
    result.z = tmp.z;

    // z-axis
    tmp.x = Math.cos(rotation.z) * result.x - Math.sin(rotation.z) * result.y;
    tmp.y = Math.sin(rotation.z) * result.x + Math.cos(rotation.z) * result.y;
    result.x = tmp.x;
    result.y = tmp.y;

    return result;
  }

  public length(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
  }
  public unit(): Vector3 {
    if (this.length() < 0.001) return new Vector3();
    return new Vector3(
      this.x / this.length(),
      this.y / this.length(),
      this.z / this.length()
    );
  }

  static getMinus(a: Vector3, b: Vector3): Vector3 {
    return new Vector3(a.x - b.x, a.y - b.y, a.z - b.z);
  }

  static dotProduct(a: Vector3, b: Vector3): number {
    return a.x * b.x + a.y * b.y + a.z * b.z;
  }
  static outProduct(a: Vector3, b: Vector3): Vector3 {
    return new Vector3(
      a.y * b.z - a.z * b.y,
      a.z * b.x - a.x * b.z,
      a.x * b.y - a.y * b.x
    );
  }
}

export class Vector2 {
  constructor(public x: number = 0, public y: number = 0) {}

  public length(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }
}
