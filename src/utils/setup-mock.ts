import debug from './env';

export default ({ mock, setup }: { mock?: boolean; setup: () => void }) => {
  if (mock !== false && debug) setup();
};

export const successResponseWrap = (metadata: unknown) => {
  return {
    metadata,
    status: 'ok',
    msg: '请求成功',
    code: 200,
  };
};

export const failResponseWrap = (
  metadata: unknown,
  msg: string,
  code = 500
) => {
  return {
    metadata,
    status: 'fail',
    msg,
    code,
  };
};
