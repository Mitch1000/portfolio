export default function (p5) {
  return (functionName, params) => {
    const p5function = p5[functionName];
    p5function.apply(p5, params);
  };
}
