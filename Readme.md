Hello.io - Simple Socket.io server for testing and debugging
=======================================

Use it
----------------

Start Redis

```bash
redis-server
```

```bash
npm intall
node .
```

open http://localhost:9000

Want to spin up another? Pass in a port number.

```bash
node . 9001
```

open http://localhost:9000


Switching branches
----------------

Each branch has slightly different package.json dependencies.
Run `make reset` when you switch branches to make sure you have the right dependencies.

```bash
make reset
```

If shit gets weird
----------------

As of Socket.io v0.7.7, there are a couple minor issues in the source tree that render RedisStore unusable.
Use [my patched version](https://github.com/dshaw/socket.io/tree/dev/redis).

If you see error from `event.js` or about `self.removeEvent`, you have the wrong version. Run `make reset`.

RedisClient will complain about the number of eventListeners being greater than 10. It's OK.