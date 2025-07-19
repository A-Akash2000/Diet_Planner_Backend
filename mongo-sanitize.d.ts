// types/mongo-sanitize.d.ts
declare module 'mongo-sanitize' {
    function sanitize<T>(input: T): T;
    export = sanitize;
  }
  