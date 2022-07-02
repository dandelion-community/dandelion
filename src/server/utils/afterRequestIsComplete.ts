import setTimeoutSafe from './setTimeoutSafe';

type Args = {
  req: Express.Request;
  callback: () => void;
  loggingTag: string;
};

export default function afterRequestIsComplete({
  req,
  callback,
  loggingTag,
}: Args): void {
  try {
    // Typescript doesn't know that 'req.res.on' is a function, but it is
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    req.res.on('close', () => {
      setTimeoutSafe(loggingTag, callback);
    });
  } catch (e) {
    console.error(e);
  }
}
