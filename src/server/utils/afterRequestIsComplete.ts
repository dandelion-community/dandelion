export default function afterRequestIsComplete(
  req: Express.Request,
  callback: () => void,
): void {
  try {
    // Typescript doesn't know that 'req.res.on' is a function, but it is
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    req.res.on('close', () => {
      setTimeout(callback);
    });
  } catch (e) {
    console.error(e);
  }
}
