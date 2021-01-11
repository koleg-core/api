# Koleg API

REST API for koleg project

---

## Index
  * [Koleg API](#koleg-api)
      * [Dev](#dev)
         * [Dependencies](#dependencies)
         * [Start dev <g-emoji class="g-emoji" alias="rocket" fallback-src="https://github.githubassets.com/images/icons/emoji/unicode/1f680.png">🚀</g-emoji>](#start-dev-)
         * [With okteto](#with-okteto)
         * [Tests](#tests)
            * [Docker](#docker)
            * [Benchmarks <g-emoji class="g-emoji" alias="chart_with_upwards_trend" fallback-src="https://github.githubassets.com/images/icons/emoji/unicode/1f4c8.png">📈</g-emoji>](#benchmarks-)
               * [Code coverage <g-emoji class="g-emoji" alias="bed" fallback-src="https://github.githubassets.com/images/icons/emoji/unicode/1f6cf.png">🛏️</g-emoji>](#code-coverage-\xEF\xB8\x8F)
               * [API latency <g-emoji class="g-emoji" alias="snail" fallback-src="https://github.githubassets.com/images/icons/emoji/unicode/1f40c.png">🐌</g-emoji>](#api-latency-)
                  * [Results](#results)
            * [API](#api)
      * [Init production <g-emoji class="g-emoji" alias="wheel_of_dharma" fallback-src="https://github.githubassets.com/images/icons/emoji/unicode/2638.png">☸️</g-emoji>](#init-production-\xEF\xB8\x8F)
         * [Requirements](#requirements)
      * [Documentation](#documentation)
         * [Endpoints](#endpoints)
      * [Configuration](#configuration)
      * [Presentation fac](#presentation-fac)

---

## Dev
### Dependencies
This is dependencies required for local dev.


- WSL (if you dev on windows)
- gnumake: `sudo apt install make`
- okteto: `curl https://get.okteto.com/ -sSfL | sh` [okteto documentation](https://okteto.com/docs/getting-started/index.html)
- kubernetes: `curl -LO "https://storage.googleapis.com/kubernetes-release/release/$(curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt)/bin/linux/amd64/kubectl"`
    Run: `code ~/.kube/config` After copy-paste content of .yaml file you can download in Scaleway : Kapsule > web > download kubeconfig
    ( you can also move this downloaded file at `~/.kube/config` )

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

Start nodemon automatic rebuild/restart
```bash
make dev
```

Enjoy !


### Tests
You can simply run all tests with:
```bash
make test
```

#### Docker
To lint container run:
```bash
docker run --rm -i hadolint/hadolint < Dockerfile
```

To build container run:
```bash
make docker-build
```

#### Benchmarks 📈
##### Code coverage 🛏️
You can find code coverage at gitlab pages:
[**`coverage.koleg.tk`**](https://coverage.koleg.tk/)

you can also run this:
```bash
npm run coverage
```

And open coverage report in your browser `./coverage/lcov-report/index.html` file.

##### API latency 🐌
To benchmark api, you can install `autocannon`:
```bash
npm i -g autocannon
```

And run:
```bash
autocannon http://api.dev.koleg.tk/users
```

###### Results
On `/users` endpoint:
```bash
autocannon http://api.dev.koleg.tk/users

Running 10s test @ http://api.dev.koleg.tk/users
10 connections

┌─────────┬───────┬───────┬───────┬───────┬──────────┬─────────┬────────┐
│ Stat    │ 2.5%  │ 50%   │ 97.5% │ 99%   │ Avg      │ Stdev   │ Max    │
├─────────┼───────┼───────┼───────┼───────┼──────────┼─────────┼────────┤
│ Latency │ 20 ms │ 24 ms │ 39 ms │ 71 ms │ 26.29 ms │ 9.76 ms │ 186 ms │
└─────────┴───────┴───────┴───────┴───────┴──────────┴─────────┴────────┘
┌───────────┬────────┬────────┬────────┬─────────┬────────┬─────────┬────────┐
│ Stat      │ 1%     │ 2.5%   │ 50%    │ 97.5%   │ Avg    │ Stdev   │ Min    │
├───────────┼────────┼────────┼────────┼─────────┼────────┼─────────┼────────┤
│ Req/Sec   │ 340    │ 340    │ 355    │ 407     │ 372    │ 25.63   │ 340    │
├───────────┼────────┼────────┼────────┼─────────┼────────┼─────────┼────────┤
│ Bytes/Sec │ 867 kB │ 867 kB │ 905 kB │ 1.04 MB │ 949 kB │ 65.4 kB │ 867 kB │
└───────────┴────────┴────────┴────────┴─────────┴────────┴─────────┴────────┘

Req/Bytes counts sampled once per second.

4k requests in 10.02s, 9.49 MB read
```

On `/users` endpoint with fuzzy finding filter:
```bash
autocannon 'http://api.dev.koleg.tk/users?filer=lo'

Running 10s test @ http://api.dev.koleg.tk/users?filer=lo
10 connections

┌─────────┬───────┬───────┬───────┬───────┬──────────┬──────────┬────────┐
│ Stat    │ 2.5%  │ 50%   │ 97.5% │ 99%   │ Avg      │ Stdev    │ Max    │
├─────────┼───────┼───────┼───────┼───────┼──────────┼──────────┼────────┤
│ Latency │ 21 ms │ 27 ms │ 56 ms │ 78 ms │ 29.86 ms │ 11.42 ms │ 188 ms │
└─────────┴───────┴───────┴───────┴───────┴──────────┴──────────┴────────┘
┌───────────┬────────┬────────┬────────┬────────┬────────┬─────────┬────────┐
│ Stat      │ 1%     │ 2.5%   │ 50%    │ 97.5%  │ Avg    │ Stdev   │ Min    │
├───────────┼────────┼────────┼────────┼────────┼────────┼─────────┼────────┤
│ Req/Sec   │ 298    │ 298    │ 322    │ 374    │ 328.5  │ 21.77   │ 298    │
├───────────┼────────┼────────┼────────┼────────┼────────┼─────────┼────────┤
│ Bytes/Sec │ 760 kB │ 760 kB │ 821 kB │ 954 kB │ 838 kB │ 55.5 kB │ 760 kB │
└───────────┴────────┴────────┴────────┴────────┴────────┴─────────┴────────┘

Req/Bytes counts sampled once per second.

3k requests in 10.03s, 8.38 MB read
```

#### API
Before all run `npm start`, then:

You can use [`/docs`](http://localhost:8080/docs) endpoint with `localhost:8080` url to test api.

You can also use postman config and try API.

---

## Init production ☸️

### Requirements
On namespace: `master|develop`:
- A dockerconfig secret named `registry-koleg` that own scaleway registry credentials
- a run of `make deploy`

---

## Documentation
### Endpoints
- `/`: show self generated `openapi.yml`
- `/docs`: display swagger UI
- `/**/**` Api endpoints

## Configuration
You can create configs file at these path with `yml` or `yaml` extension:
- `/etc/default/koleg/config`
- `/etc/default/koleg/config-${env}`
- `/etc/koleg/config`
- `/etc/koleg/config-${env}`
- `./configs/${env}`
- `./configs/${env}`
- `./config`
- `./config-${env}`

**Note:**

`${env}` is defined with export of `NODE_ENV` variable:
```bash
export NODE_ENV=development
```

Your config file must looks like this.
```yaml
api:
  jwt_secret:
  port: 8081
database:
  enable: true
  host: You database host
  port: 5432
  user: user
  password: P@ssw0rd
  schema: kolegdb
s3:
  bucket: koleg-bucket
  port: 443
  endpoint: s3.api.net
  access_key: XXXXXXXXXXX
  secret_key: XXXXXXXXXXX
  use_ssl: true
  region: fr-par
  path_style: false
```

---

## Presentation fac
- Fuzzy search
- Tests
- Okteto
- S3
- Gravatar

