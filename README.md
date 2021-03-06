# Koleg API

REST API for koleg project
mirror of [koleg/api](https://gitlab.com/koleg1/api)

---

## Index
  * [Koleg API](#koleg-api)
      * [Dev](#dev)
         * [Dependencies](#dependencies)
         * [Start dev <g-emoji class="g-emoji" alias="rocket" fallback-src="https://github.githubassets.com/images/icons/emoji/unicode/1f680.png">π</g-emoji>](#start-dev-)
         * [With okteto](#with-okteto)
         * [Tests](#tests)
            * [Docker](#docker)
            * [Benchmarks <g-emoji class="g-emoji" alias="chart_with_upwards_trend" fallback-src="https://github.githubassets.com/images/icons/emoji/unicode/1f4c8.png">π</g-emoji>](#benchmarks-)
               * [Code coverage <g-emoji class="g-emoji" alias="bed" fallback-src="https://github.githubassets.com/images/icons/emoji/unicode/1f6cf.png">ποΈ</g-emoji>](#code-coverage-\xEF\xB8\x8F)
               * [API latency <g-emoji class="g-emoji" alias="snail" fallback-src="https://github.githubassets.com/images/icons/emoji/unicode/1f40c.png">π</g-emoji>](#api-latency-)
                  * [Results](#results)
            * [API](#api)
      * [Init production <g-emoji class="g-emoji" alias="wheel_of_dharma" fallback-src="https://github.githubassets.com/images/icons/emoji/unicode/2638.png">βΈοΈ</g-emoji>](#init-production-\xEF\xB8\x8F)
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

### Start dev π
You can see helper documentaion with bash command:
```bash
make
```

This will return something like that:
```bash
help                           π‘This help.
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

#### Benchmarks π
##### Code coverage ποΈ
You can find code coverage at gitlab pages:
[**`coverage.koleg.tk`**](https://coverage.koleg.tk/)

you can also run this:
```bash
npm run coverage
```

And open coverage report in your browser `./coverage/lcov-report/index.html` file.

##### API latency π
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

βββββββββββ¬ββββββββ¬ββββββββ¬ββββββββ¬ββββββββ¬βββββββββββ¬ββββββββββ¬βββββββββ
β Stat    β 2.5%  β 50%   β 97.5% β 99%   β Avg      β Stdev   β Max    β
βββββββββββΌββββββββΌββββββββΌββββββββΌββββββββΌβββββββββββΌββββββββββΌβββββββββ€
β Latency β 20 ms β 24 ms β 39 ms β 71 ms β 26.29 ms β 9.76 ms β 186 ms β
βββββββββββ΄ββββββββ΄ββββββββ΄ββββββββ΄ββββββββ΄βββββββββββ΄ββββββββββ΄βββββββββ
βββββββββββββ¬βββββββββ¬βββββββββ¬βββββββββ¬ββββββββββ¬βββββββββ¬ββββββββββ¬βββββββββ
β Stat      β 1%     β 2.5%   β 50%    β 97.5%   β Avg    β Stdev   β Min    β
βββββββββββββΌβββββββββΌβββββββββΌβββββββββΌββββββββββΌβββββββββΌββββββββββΌβββββββββ€
β Req/Sec   β 340    β 340    β 355    β 407     β 372    β 25.63   β 340    β
βββββββββββββΌβββββββββΌβββββββββΌβββββββββΌββββββββββΌβββββββββΌββββββββββΌβββββββββ€
β Bytes/Sec β 867 kB β 867 kB β 905 kB β 1.04 MB β 949 kB β 65.4 kB β 867 kB β
βββββββββββββ΄βββββββββ΄βββββββββ΄βββββββββ΄ββββββββββ΄βββββββββ΄ββββββββββ΄βββββββββ

Req/Bytes counts sampled once per second.

4k requests in 10.02s, 9.49 MB read
```

On `/users` endpoint with fuzzy finding filter:
```bash
autocannon 'http://api.dev.koleg.tk/users?filer=lo'

Running 10s test @ http://api.dev.koleg.tk/users?filer=lo
10 connections

βββββββββββ¬ββββββββ¬ββββββββ¬ββββββββ¬ββββββββ¬βββββββββββ¬βββββββββββ¬βββββββββ
β Stat    β 2.5%  β 50%   β 97.5% β 99%   β Avg      β Stdev    β Max    β
βββββββββββΌββββββββΌββββββββΌββββββββΌββββββββΌβββββββββββΌβββββββββββΌβββββββββ€
β Latency β 21 ms β 27 ms β 56 ms β 78 ms β 29.86 ms β 11.42 ms β 188 ms β
βββββββββββ΄ββββββββ΄ββββββββ΄ββββββββ΄ββββββββ΄βββββββββββ΄βββββββββββ΄βββββββββ
βββββββββββββ¬βββββββββ¬βββββββββ¬βββββββββ¬βββββββββ¬βββββββββ¬ββββββββββ¬βββββββββ
β Stat      β 1%     β 2.5%   β 50%    β 97.5%  β Avg    β Stdev   β Min    β
βββββββββββββΌβββββββββΌβββββββββΌβββββββββΌβββββββββΌβββββββββΌββββββββββΌβββββββββ€
β Req/Sec   β 298    β 298    β 322    β 374    β 328.5  β 21.77   β 298    β
βββββββββββββΌβββββββββΌβββββββββΌβββββββββΌβββββββββΌβββββββββΌββββββββββΌβββββββββ€
β Bytes/Sec β 760 kB β 760 kB β 821 kB β 954 kB β 838 kB β 55.5 kB β 760 kB β
βββββββββββββ΄βββββββββ΄βββββββββ΄βββββββββ΄βββββββββ΄βββββββββ΄ββββββββββ΄βββββββββ

Req/Bytes counts sampled once per second.

3k requests in 10.03s, 8.38 MB read
```

#### API
Before all run `npm start`, then:

You can use [`/docs`](http://localhost:8080/docs) endpoint with `localhost:8080` url to test api.

You can also use postman config and try API.

---

## Init production βΈοΈ

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

