class Vector {
  constructor({ x = 0, y = 0, z = 0 }) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  static getDistanceBetweenVectors(vector1, vector2) {
    const dx = (vector2.x - vector1.x);
    const dy = (vector2.y - vector1.y);
    const dz = (vector2.z - vector1.z);

    const distance = Math.sqrt(dx ** 2 + dy ** 2, dz ** 2);

    return distance;
  }

  toString() {
    const parseString = (s) => {
      let string = (s / 1000).toString().slice(0, 6);

      if (string[string.length - 1] === '.') {
        string = string.replace('.', '');
      }

      return string;
    };
    return `&nbsp; &nbsp; x: ${parseString(this.x)} units <br>&nbsp; &nbsp;  y: ${parseString(this.y)} units`;
  }
}

export default Vector;
