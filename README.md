
# struct.js

Wouldn't it be nice to create simple memory-efficient data structures
like in C? And know that referencing them are simple reads/writes from a
pointer + offset?

What if you could even optionally stack-allocate them, and never touch
the garbage collector?

This is all possible today in JavaScript with a few sweet.js macros.

This is still being researched so I'm not going to go into details
just yet.

```js
defineRecord Point {
    x : double,
    y : double
}

Point foo;

foo.x;
foo.y;
```