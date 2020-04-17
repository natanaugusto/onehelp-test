
# OneHelp Test

This is the OneHelp application test. The test has 3 API services which I'll shortly describe above.

### The Gateway service

This service does the bridge to the other two services.
The service has the following endpoints.

GET/POST/PUT/DELETE requests
GET/POST/PUT/DELETE discounts
GET price

### The Cleaning service

This service deal with cleaning requests.
The service has the following endpoint.

GET/POST/PUT/DELETE requests

### The discounts service

This service deal with discounts.
The service has the following endpoints.

GET/POST/PUT/DELETE discounts

# How to run this project

To run this project you’ll need the docker installed on your system.

##### Clone the project

```
git clone https://github.com/natanaugusto/onehelp-test
cd onehelp-test
```

##### Run the Docker Compose

```
cp .env-example .env
docker-compose up -d
```

Waiting until this stops running.

##### Start the proxy service

```
# Create the onehelp database
mysql -u root -proot -h 127.0.0.1 -e “CREATE DATABASE `onehelp` CHARACTER SET ‘utf8’;“

# Enter in the workspace container
docker-compose exec -u onehelp workspace bash

# Inside the workspace container
cd proxy
php artisan migrate
```
##### The host file

Added this follow lines to your */etc/hosts* 

```
 127.0.0.1  api.onehelp.natanaugusto.com
 127.0.0.1  discounts.onehelp.natanaugusto.com
 127.0.0.1  cleaning.onehelp.natanaugusto.com
```

If everything went right, now, you can use the project!


# Testing

##### Test the proxy
```
docker-compose exec -u onehelp workspace bash
# Inside the container
cd proxy
phpunit
```

##### Test the cleaning
```
cd cleaning
npm run test
``` 

##### Test the discounts
```
cd discounts
npm run test
```

##### Testing with Insomnia

Import to your Insomnia the *insomnia.json* file.

---
So long and thanks for all the fishes 