import Timer from '../lib/timer';
import { Rabbit } from 'rabbit-queue';

import * as sinon from 'sinon';
const sandbox = sinon.sandbox.create();

describe('Timer', function () {
  let rabbit: Rabbit;

  before(function (done) {
    rabbit = new Rabbit('amqp://localhost', { scheduledPublish: true });
    rabbit.on('connected', done);
  });

  after(async function () {
    await rabbit.destroyQueue('eip_0');
    await rabbit.destroyQueue('delay');
    await rabbit.destroyQueue('delay_reply');
  });

  afterEach(function () {
    sandbox.restore();
  });

  it('should set 2 timeouts', async function () {

    const timer = new Timer([100, 200], rabbit);
    await new Promise(r => setTimeout(r, 100));

    const injectStub = sandbox.stub(timer, 'inject');
    timer.start('1');

    await new Promise(r => setTimeout(r, 150));
    injectStub.args.should.eql([
      ['1', 1, 100]
    ]);

    await new Promise(r => setTimeout(r, 100));

    injectStub.args.should.eql([
      ['1', 1, 100],
      ['1', 2, 200]
    ]);
  });
});
