// To always see what is came from where or what was send to where
export const event = (name: string) => ({
  from: (source: string) => ({
    to: (target: string) => `event(${name}):from(${source}):to(${target})`,
  }),
});

type InvertedPromise<T> = {
  promise: Promise<T>,
  resolve: (value: T | PromiseLike<T>) => void,
  reject: (reason?: any) => void,
}
export function getInvertedPromise<T>(): InvertedPromise<T> {
  let resolve: (value: T | PromiseLike<T>) => void;
  let reject: <T = never>(reason?: any) => void;

  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  })

  return {
    promise,
    resolve,
    reject,
  }
}
