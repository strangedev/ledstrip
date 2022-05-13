## Building

Make sure you have clone the submodules:

```
git submodule update --init --recursive
```

Building on a non-rpi system requires [crosstool-ng](https://github.com/crosstool-ng/crosstool-ng). Build the toolchain:

```
make toolchain
```

