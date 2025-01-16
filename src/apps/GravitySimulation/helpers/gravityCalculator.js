import rungeKutta from 'runge-kutta';

function calculateBodyGravity({
  physicsBodies,
  timeScale,
  gravitationConstant,
  variableCount = 4,
}) {
  const getInitialConditions = (bodies) => {
    const dataArray = [];
    bodies.forEach((body, index) => {
      dataArray[index * variableCount] = body.position.x;
      dataArray[index * variableCount + 1] = body.position.y;
      dataArray[index * variableCount + 2] = body.velocity.x;
      dataArray[index * variableCount + 3] = body.velocity.y;
    });
    return dataArray;
  };

  const updateBodies = (y) => {
    let bodyIndex = 0;
    y.forEach((_value, index) => {
      if (index % variableCount !== 0) { return; }

      const bodyDataIndex = bodyIndex * variableCount;
      const body = physicsBodies[bodyIndex];
      if (typeof body !== 'object') {
        console.warn('THIS BODY WAS NOT DEFINED'); // eslint-disable-line
      }
      body.position.x = y[bodyDataIndex];
      body.position.y = y[bodyDataIndex + 1];
      body.velocity.x = y[bodyDataIndex + 2];
      body.velocity.y = y[bodyDataIndex + 3];
      bodyIndex += 1;
    });
  };

  const differentialEquation = (_t, y) => {
    updateBodies(y);

    const data = [];
    physicsBodies.forEach((b, index) => {
      const body = b;
      const a = body.getAcceleration(physicsBodies, gravitationConstant);

      const v = body.getVelocityWithDelta(1, a);
      body.velocity = v;

      body.position.x += v.x;
      body.position.y += v.y;

      body.acceleration = a;
      data[(index * variableCount)] = v.x;
      data[(index * variableCount) + 1] = v.y;
      data[(index * variableCount) + 2] = a.x;
      data[(index * variableCount) + 3] = a.y;
    });

    return data;
  };

  const initialConditions = getInitialConditions(physicsBodies);
  const range = [0, Math.max(1000 * parseInt(timeScale, 10), 1000)];

  const steps = Math.max(100 * parseInt(timeScale, 10), 20);
  return rungeKutta(differentialEquation, initialConditions, range, steps);
}

export default { calculateBodyGravity };
