# api

REST API for koleg project

## Dev
### Dependencies
This is dependencies required for local dev.


- WSL (if you dev on windows)
- gnumake: `sudo apt install make`
- okteto: `curl https://get.okteto.com/ -sSfL | sh` [okteto documentation]()

### Start dev 🚀
You can see helper documentaion with bash command:
```bash
make
```

This will return something like that:
```bash
help                           💡This help.
init                           Clone all git submodules
build                          Local build with npm/typescript
start                          Cloud start with okteto/npm
shell                          Cloud shell with okteto
docker-build                   Build container docker
```

### With okteto
```bash
make up
```

After that your shell will be into okteo remote container.

If you are not or if you want to have okteto into an other terminal run:
```bash
make shell
```

After you can transpile with `typescript` into `js`:
```bash
make build
```

Transpile into typescript and start with:
```bash
make start
```

Enjoy !

