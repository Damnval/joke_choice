# Job Choice

A project for Job Searching and Referral.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.
Deployment is currently not covered.

### Prerequisites

Things you need to get started.

```
- GIT
- Docker / Docker Toolbox with a running Docker Machine
```

### Installing

Open your Terminal

```
Git Bash, Cmder, Docker Quickstart Terminal
```

For Git Bash users, you may need to go into your Docker Machine's shell

```
eval $(docker-machine env {Docker-Machine-Name})
```

Clone the repository

```
git clone https://bitbucket.org/sprobedev/jobchoice_be/src/master
```

Navigate to the cloned repository's root directory

```
cd {Project-Path}
```

Run Docker Compose

```
docker-compose up -d
```

Once everything is up. SSH into the php container 'jobchoice_php' (Docker Quickstart Terminal)

```
docker exec -it jobchoice_php bash
```

For Git Bash users, prepend your command with 'winpty'

```
winpty docker exec -it jobchoice_php bash
```

Once you're inside the jobchoice_php Container, execute a composer install

```
composer install
```

After the installation. Copy the Environment Variables file (.env.sample)

```
cp .env.example .env
```

And generate the Application Key

```
php artisan key:generate
```

You should be able to navigate to the Application's URL in your host machine

```
http://{Docker-Machine-Ip}:8080
```

Install pdo extension

```
docker-php-ext-install pdo pdo_mysql pdo_pgsql
```

Run migration

```
php artisan migrate --seed
```

Generate API Authentication.

```
php artisan passport:install
```
Copy Client secret with ID 2 and use it in Front End to communicate back End API.

## Running the tests

- Be logged in to the 'jobchoice_php' container
- Run PHPUnit

```
vendor/bin/phpunit
```

### Test Results

Check the coverage of your Test Suite

```
http://{Docker-Machine-Ip}:8080/report/index.html
```

### Coding Style

PSR-2