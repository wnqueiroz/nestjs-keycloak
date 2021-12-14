# wnqueiroz/nestjs-keycloak

Project using [NestJS](https://nestjs.com/) version 8 to implement an authentication application with [Keycloak](https://www.keycloak.org/) integration! 🚀

## Table Of Contents

- [Overview](#overview)
- [Pre-requisites](#pre-requisites)
- [Up and Running!](#up-and-running)
  - [Keycloak](#keycloak)
    - [Creating the environment variables file](#creating-the-environment-variables-file)
    - [Finishing Keycloak settings](#finishing-keycloak-settings)
    - [Getting the Realm's Public RSA Key](#getting-the-realms-public-rsa-key)
    - [Getting the Client Secret](#getting-the-client-secret)
    - [Creating the test user](#creating-the-test-user)
  - [NestJS](#nestjs)

## Overview

The API implements 4 basic endpoints that can exist in an authentication mechanism, namely:

- `POST /auth/login`: To log in properly,
- `GET /auth/me`: To collect user information (requires login to be performed);
- `POST /auth/refresh`: To generate a new access token (without needing to enter the credentials again);
- `POST /auth/logout`: To invalidate the user's session on Keycloak (and also the tokens generated previously);

Our Keycloak has a simple configuration, with a client called `nestjs-keycloak` (of the confidential type, so we can have a **Client ID** and a **Client Secret**).

We will be using the [OpenID Connect 1.0 specification](https://openid.net/specs/openid-connect-core-1_0.html) to integrate with Keycloak.

## Pre-requisites

In this walkthrough it's assumed that you have the tools installed:

- [Docker](https://www.docker.com/get-started): 20.10.11 or higher.
- [docker-compose](https://docs.docker.com/compose/install/): 1.29.2 or higher.

## Up and Running!

There is already a `docker-compose.yaml` configured in this project. However, it is important to follow the tutorial below to obtain the correct environment variables and settings for the project to work.

### Keycloak

Let's finish configuring Keycloak. Thanks to the [nestjs-keycloak-realm.json](./nestjs-keycloak-realm.json) file we won't need to waste so much time in this configuration.

In the terminal, in the root of the project, execute the command to start the Keycloak:

```sh
docker-compose up -d keycloak
```

Let's check the logs if Keycloak has started:

```sh
docker-compose logs -f keycloak | grep -i "Admin console listening on"
```

Wait until a message appears on terminal output.

#### Creating the environment variables file

Copy the example environment variables file from this repository into a `.env` file at the root of the project:

```sh
cp .env.example .env
```

> This file is needed for us to run the API from the `docker-compose.yaml`.

**Let's replace what's in `<REPLACE_ME>` with the information we got from our Keycloak.**

#### Finishing Keycloak settings

Access the address: http://localhost:8080. You will see the Keycloak home screen.

Go to **Administration Console**, and log in with the credentials:

- Username or email: admin
- Password: admin

You will directly access the Realm that has been configured with the help of [nestjs-keycloak-realm.json](./nestjs-keycloak-realm.json).

We now need:

1. Obtain the Realm's public RSA key;
1. Reset client secret of `nestjs-keycloak` client;
1. Create a test user for our Realm.

#### Getting the Realm's Public RSA Key

Access the address: http://localhost:8080/auth/admin/master/console/#/realms/nestjs-keycloak/keys.

In the RSA key with the `rsa-generated` provider, click **Public Key**.

Copy the displayed content and paste it into the `.env` file we created earlier, replacing the value `<REPLACE_ME>` with the key obtained from the variable `KEYCLOAK_REALM_RSA_PUBLIC_KEY`. It will look like:

```diff
- KEYCLOAK_REALM_RSA_PUBLIC_KEY="-----BEGIN PUBLIC KEY-----\n<REPLACE_ME>\n-----END PUBLIC KEY-----"
+ KEYCLOAK_REALM_RSA_PUBLIC_KEY="-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAlOSbkRWDCFLl0dslyU1aYkACfos+wib22LHWTz9cgd+RBByS43wmxKNe90b5g6S0RMJvBUpcDnnUNMLXgP7EyfUluWriiUpyWXBLclhtWHz49QZYAOuR4T+4C2pmCfAkefDz5tbN+SQuRyZcJzZ/cLboKfKzwK7Nlud6NRvYMypOxmSNaDuQAKWH8BciT6ahpSFFgPWMBuGD5oz9DYqZKNNaXedmVLqL911EC0kH0J54AOjM4OKuo+sTUji6eJFCJDMynnJIJyTLFDRrhLM1aD+n77q0k59Bm/EwtP77tDT5uR0AWfhErdsZQV863TjBDcTEsxveEtOJmMF9L/6a8QIDAQAB\n-----END PUBLIC KEY-----"
```

#### Getting the Client Secret

From the left bar, go to `Clients / nestjs-keycloak / Credentials` and click on **Regenerate Secret**.

Copy the displayed content and paste it into the `.env` file we created earlier, replacing the `<REPLACE_ME>` value with the secret obtained from the `KEYCLOAK_CLIENT_SECRET` variable. It will look like:

```diff
- KEYCLOAK_CLIENT_SECRET="<REPLACE_ME>"
+ KEYCLOAK_CLIENT_SECRET="2387cbc8-7bef-4f09-bd05-7f97ca4ae813"
```

#### Creating the test user

Let's create a new user, click on the address: http://localhost:8080/auth/admin/master/console/#/create/user/nestjs-keycloak

1. Enter the information:

   - Username: test
   - Email: test@test.com

   > **Leave the other options as they are.**

2. Click `Save`.

3. Still on the newly created user screen, click on `Credentials` and enter the data:
   - Password: test
   - Password Confirmation: test
   - Temporary: OFF (switch to OFF)

Click **Set Password** and confirm the operation.

After that, we are able to launch our application! 🚀 🤘

### NestJS

Let's launch our application. Run the command in the terminal:

```sh
docker-compose up -d app
```

Wait for the application to build and run.

Look at the logs with:

```sh
docker-compose logs -f app
```

After identifying that the application has started, you can either "play" with the HTTP requests contained in the [client.http](./client.http) file or import the [Postman](https://www.postman.com/) Collection available in the [nestjs-keycloak.postman_collection.json](./nestjs-keycloak.postman_collection.json) file.
