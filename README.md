# eip-rabbit

Enterprise Integration Patterns for javascript rabbitmq adapter.

Create a Timer for the eip aggregator that uses rabbitmq to implement the timeout.

## Installation

```
npm install --save eip-rabbit
```

## Usage

```javascript
const eip = require('eip');
const { Rabbit } = require('rabbit-queue');
const rabbit = new Rabbit('amqp://localhost', { scheduledPublish: true }); // scheduledPublish must be enabled
const { Timer } = require('eip-rabbit');
const timer = new Timer([1000, 5000], rabbit, 'timer') // delays in ms
const aggregator = new eip.Route().aggregate({ timer });
```

## License

MIT
