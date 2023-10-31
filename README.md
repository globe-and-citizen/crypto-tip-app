# Crypto Tip (crypto-tip-app)

Crypto Tips is an innovative application designed to simplify cryptocurrency tipping within teams. It ensures that everyone in a team receives an equal share of cryptocurrency as a tip, promoting fairness and unity. With a user-friendly interface and smart contract integration, Crypto Tips streamlines the tipping process, making it easy to show appreciation while keeping things transparent and hassle-free.

# Folder structure

```
.
├── app
├── backend
└── contract
```

## ./app

This folder contains the frontend application. It is built using [Quasar](https://quasar.dev/). The application is a single page application (SPA) that uses Vue.js and Typescript. The frontend app interact with the backend and the smart contract

## ./backend

This folder contains the backend application. It is built using [Express](https://expressjs.com/). The backend application is a REST API that is used by the frontend application.

## ./contract

This folder contains the smart contract. It is built using [Solidity](https://docs.soliditylang.org/en/v0.8.6/). The smart contract is deployed on the Polygon blockchain.

# Getting started

## Prerequisites

Before getting started with Crypto Tip, make sure you have the following prerequisites installed:

- [Node.js](https://nodejs.org/en/) (v14.17.0)
- [Metamask](https://metamask.io/) (v10.0.5)
- [Docker](https://www.docker.com/) (v20.10.7)
- [Docker Compose](https://docs.docker.com/compose/) (v1.29.2)

## Setup
Follow these steps to set up Crypto Tip:

### Clone repository

```bash
git clone https://github.com/globe-and-citizen/crypto-tip-app.git
```

### 1- Run in docker containers

#### Start the containers

```bash
cd crypto-tip-app
docker-compose up -d
```

Then access the app at [http://localhost:9200](http://localhost:9200)

### 2- Run locally

#### Install dependencies

Run inside these folders : `./app`, `./backend` and `./contract`

```bash
npm install
```

### Start the app in development mode

In `./app` folder

```bash
npm run dev
```

In `./backend` folder

```bash
npm run start
```
Then access the app at [http://localhost:9200](http://localhost:9200)
