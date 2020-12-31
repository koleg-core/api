# Koleg API

REST API for koleg project

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

#### Node
run this:
```bash
npm run coverage
```

And open coverage report in your browser `./coverage/lcov-report/index.html` file.

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

---

### Difficulties

#### Goodby scaleway s3 object storage
In fault of [this](https://www.scaleway.com/fr/faq/comment-puis-je-creer-un-objet-public/)

**And the non acl implementation of minio.**

**AND THE NON POLICY IMPLEMENTATION OF SCALEWAY**

🤬

We can't use scaleway s3 as solution.

**The fix:**

Then we fallback on [the on premise kuberetes s3 compatible minio storage](https://min.io/).

Minio is:
- A rest API
- S3 rest API
- installable with [helm](https://helm.sh/)
- open source
- on premise.

In a nutshell only fun.
