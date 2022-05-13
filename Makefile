BINARY_NAME=ledstrip
CC=${PWD}/.build/armv7-rpi2-linux-gnueabihf/buildtools/bin/armv7-rpi2-linux-gnueabihf-gcc
AR=${PWD}/.build/armv7-rpi2-linux-gnueabihf/buildtools/bin/armv7-rpi2-linux-gnueabihf-ar

build:
	CGO_ENABLED=1 GOARCH=arm GOARM=7 GOOS=linux CC=${CC} go build -mod=mod -o ${BINARY_NAME} main.go

clean-deps:
	cd extern/rpi_ws281x; rm *.o *.a

deps:
	cd extern/rpi_ws281x; for file in *.c; do $(CC) -fPIC -c -o $$file.o $$file; done && $(AR) rcs libws2811.a *.c.o

clean:
	go clean

toolchain:
	ct-ng armv7-rpi2-linux-gnueabihf
	ct-ng build
