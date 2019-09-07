# Benchmark test of @fav/text.diff

Comparing with following modules:

* [diff](https://www.npmjs.com/package/diff)
* [fast-diff](https://www.npmjs.com/package/fast-diff)

## v0.1.0

|            | @fav/text.diff(0.1.0) | diff(4.0.1)     | fast-diff(1.2.0)  |
|:-----------|----------------------:|----------------:|------------------:|
| diff chars |       802,340 ops/sec |  67,712 ops/sec | 1,060,611 ops/sec |
| diff words |       994,419 ops/sec | 101,827 ops/sec |         0 ops/sec |
| diff lines |       835,799 ops/sec | 119,585 ops/sec |         0 ops/sec |

- Platform: Node.js 12.6.0 on Darwin 64-bit
- Machine: Intel(R) Core(TM) i7-2620M CPU @ 2.70GHz, 16GB
- 


