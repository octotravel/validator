import { Environment } from '@octocloud/core';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

describe('ddTracer', () => {
  const tracer = { scope: vi.fn() };
  const init = vi.fn();

  const importTracerModule = async (environment: Environment): Promise<typeof import('../ddTracer')> => {
    vi.doMock('dd-trace', () => ({ default: { init } }));
    vi.doMock('../../config/config', async (importOriginal) => {
      const actual = await importOriginal<typeof import('../../config/config')>();

      return { default: { ...actual.default, getEnvironment: () => environment } };
    });

    return await import('../ddTracer');
  };

  beforeEach(() => {
    vi.resetModules();
    init.mockReset();
    init.mockReturnValue(tracer);
  });

  afterEach(() => {
    vi.doUnmock('dd-trace');
    vi.doUnmock('../../config/config');
  });

  it.each([Environment.LOCAL, Environment.TEST])('does not initialize the tracer in %s', async (env) => {
    const { ddTracer } = await importTracerModule(env);

    expect(ddTracer).toBeNull();
    expect(init).not.toHaveBeenCalled();
  });

  it('initializes the tracer with log injection in production', async () => {
    const { ddTracer } = await importTracerModule(Environment.PRODUCTION);

    expect(ddTracer).toBe(tracer);
    expect(init).toHaveBeenCalledWith({ logInjection: true });
  });
});
