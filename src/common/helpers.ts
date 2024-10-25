// To always see what is came from where or what was send to where
export const event = (name: string) => ({
  from: (source: string) => ({
    to: (target: string) => `event(${name}):from(${source}):to(${target})`,
  }),
});
