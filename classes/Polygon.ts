import { Vector2, Vector3 } from './Vector';

export class Triangle {
  private rotation: Vector3;

  constructor(private p1: Vector3, private p2: Vector3, private p3: Vector3) {
    this.rotation = new Vector3();
  }
  public setRotation(rotation: Vector3): void {
    this.rotation = rotation;
  }

  public getP1(): Vector3 {
    return this.p1.getRotatedWith(this.rotation);
  }
  public getP2(): Vector3 {
    return this.p2.getRotatedWith(this.rotation);
  }
  public getP3(): Vector3 {
    return this.p3.getRotatedWith(this.rotation);
  }

  public getNormal(): Vector3 {
    return Vector3.outProduct(
      Vector3.getMinus(this.getP1(), this.getP2()),
      Vector3.getMinus(this.getP1(), this.getP3())
    ).unit();
  }
}

export class Polygon {
  private location: Vector3;
  private rotation: Vector3;

  constructor(private triangles: Array<Triangle>) {
    this.location = new Vector3();
    this.rotation = new Vector3(0, 0, 0);
  }

  public getTriangles(): Array<Triangle> {
    return this.triangles;
  }
  public getRotation(): Vector3 {
    return this.rotation;
  }
  public setRotation(rotation: Vector3): void {
    this.rotation = rotation;
    for (let triangle of this.triangles) {
      triangle.setRotation(rotation);
    }
  }
}

export class SimplePolygonBuilder {
  static createPyramid(n: number, radius: number, height: number): Polygon {
    let triangles: Array<Triangle> = new Array<Triangle>();
    for (let i = 0; i < n; i++) {
      let inRotation: number = (i / n) * Math.PI * 2;
      let outRotation: number = ((i + 1) / n) * Math.PI * 2;

      let base = new Triangle(
        new Vector3(),
        new Vector3(
          radius * Math.cos(inRotation),
          radius * Math.sin(inRotation),
          0
        ),
        new Vector3(
          radius * Math.cos(outRotation),
          radius * Math.sin(outRotation),
          0
        )
      );
      let side = new Triangle(
        new Vector3(0, 0, height),
        new Vector3(
          radius * Math.cos(inRotation),
          radius * Math.sin(inRotation),
          0
        ),
        new Vector3(
          radius * Math.cos(outRotation),
          radius * Math.sin(outRotation),
          0
        )
      );
      triangles.push(base, side);
    }
    return new Polygon(triangles);
  }
}
