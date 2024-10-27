import { Socket } from 'socket.io';
import { assert } from '../common/assert';
import { CALL_TYPE } from '../common/constants';
import { event } from '../common/helpers';
import { PreAnswerFromCallee, PreOfferFromCaller } from '../common/types';

//@ts-ignore
export let socketClient: Socket = undefined;

export async function getSocketConnection(retries = 50, interval = 1000): Promise<Socket> {
  if (socketClient) {
    return socketClient;

  }

  async function loadSocketIOScript() {
    // <script src="http://localhost:3030/socket.io/socket.io.js"></script>
    const src = 'http://localhost:3030/socket.io/socket.io.js'
    try {
      const response = await fetch(src, { method: 'HEAD' });
      if (!response.ok) {
        throw new Error('Failed to fetch script ' + src);
      }
    } catch (e) {
      throw new Error('Failed to fetch script ' + src);
    }

    return new Promise<void>((resolve, reject) => {
      const existingScript = document.getElementById('socket-io-script');
      if (existingScript) {
        document.body.removeChild(existingScript);
      }
      const script = document.createElement('script');
      script.src = src;
      script.id = 'socket-io-script';
      script.onload = () => resolve();
      script.onerror = () => {
        if (document.body.contains(script)) {
          document.body.removeChild(script); // Remove script on error
        }
        reject(new Error('Failed to load socket.io script.'));
      };
      document.body.appendChild(script);
    });
  }

  // Helper function to wait for a given time
  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  // Retry logic in an async function
  for (let i = 0; i < retries; i++) {

    try {
      await loadSocketIOScript();
      //@ts-ignore
      const socket = io('http://localhost:3030', {
        transports: ['websocket', 'polling'],
        upgrade: true,
      });
      socketClient = socket

      return socket
    } catch (error) {
      console.log('Expected error creating socket');
    }

    await wait(interval); // Wait before retrying
  }

  throw new Error('Failed to connect after multiple attempts.');
}

export function subscribeToSocketEvent(socket: Socket, event: string, listener: any) {
  assert.isString(event, 'event should be a string');
  assert.isFunction(listener, 'listener should be a function');

  socket.on(event, (...args: any[]) => {
    console.log(`Event ${event} received with payload`, ...args);
    return listener(...args);
  });
}

export function sendPreOffer(socket: Socket, data: PreOfferFromCaller) {
  assert.oneOf(data.callType, Object.values(CALL_TYPE));
  assert.isString(data.calleePersonalCode, 'data.calleePersonalCode should be a string');
  assert.is(data.from, 'front', 'Always from front to back');
  assert.is(data.to, 'back', 'Always from front to back');

  const eventType = event('pre-offer').from('front').to('back');
  console.log(`Emitting ${eventType} with payload:`, data);

  socket.emit(eventType, data);
}

export function sendPreOfferAnswer(socket: Socket, data: PreAnswerFromCallee) {
  assert.isString(data.preOfferAnswer, 'data.preOfferAnswer should be a string');
  assert.isString(data.callerSocketId, 'data.callerSocketId should be a string');
  assert.is(data.from, 'front', 'Always from front to back');
  assert.is(data.to, 'back', 'Always from front to back');

  const eventType = event('pre-offer-answer').from('front').to('back')

  console.log(`Emitting ${eventType} with payload:`, data);

  socket.emit(eventType, data);
}
