const repeated = (item, n) => [...Array(n)].map(_ => item);
const rmap = (n, fn) => Array.from({ length: n }, (_, i) => fn(i));

export {
  repeated,
  rmap
};
