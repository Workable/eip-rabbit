import { Timer as TimerInterface } from 'eip';
import { Rabbit } from 'rabbit-queue';
let timerCounter = 0;

export default class Timer extends TimerInterface {
  constructor(public delays, public rabbit: Rabbit, public name = `eip_${timerCounter++}`) {
    super(delays);
    this.rabbit.on('connected', () => this.createQueue());
    this.createQueue();
  }

  createQueue() {
    this.rabbit.createQueue(this.name, {}, (msg, ack) => {
      const { id, delay, attempt } = JSON.parse(msg.content.toString());
      this.inject(id, attempt, delay);
      ack();
    });
  }

  start(id: string) {
    this.delays.forEach((delay, i) => {
      this.rabbit.publishWithDelay(this.name, { id, delay, attempt: i + 1 }, { expiration: delay });
    });
  }
}

