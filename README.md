<a id='readme-top'></a>
# ParKing Account Server

<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about">About</a>
      <ul>
        <li>
          <a href="#built-with">Built With</a>
        </li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li>
          <a href="#prerequisites">Prerequisites</a>
        </li>
        <li>
          <a href="#installation">Installation</a>
        </li>
      </ul>
    </li>
    <li>
      <a href="#endpoints">Endpoints</a>
    </li>
  </ol>
</details>

# About
<a id='about'></a>
RESTful API for our parKing application, which you can find <a href='https://github.com/pokemon-parKing/parKing-client' target='_blank'>here</a>.

### Built With
<a id='build-with'></a>

![node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
![Supabase](https://img.shields.io/badge/Supabase-181818?style=for-the-badge&logo=supabase&logoColor=white)

# Getting Started

<a id='getting-started'></a>
Instructions to setup the API on your local machine below.

### Prerequisites
<a id='prerequisites'></a>

![NPM](https://img.shields.io/badge/NPM-%23000000.svg?style=for-the-badge&logo=npm&logoColor=white)

```sh
npm install npm@latest -g
```
### Required Environment Variables
```sh
SUPABASE_URL=(db uri)
SUPABASE_KEY=(our db api key)
PORT=(host port)
GOOGLE_API=(our google api key)
```

### Installation
<a id='installation'></a>

1. Clone the repo
   ```sh
   git clone https://github.com/pokemon-parKing/parKing-account-server
   ```
1. Install NPM packages
   ```sh
   npm install
   ```
1. Enter your ENV varaibles into a `.env` file
   ```
   See above for required variables or
   copy example.env and fill in
   ```
1. Start the Accounts and Login Server
   ```sh
   npm run start
   ```



# Endpoints
<a id='endpoints'></a>
<details>
  <summary>/valet/:id [GET]</summary>
  <p></p>
  <div>Request:<div>

    query must contain a valid garage_id

  <p></p>
  <div>Response:</div>

    Garage information: { id, address, city, state, zip, country, name, operation_hours, spots, user_id, lat, lng }

</details>

<details>
  <summary>/valet/:id/operation-hours [PUT]</summary>
  <p></p>
  <div>Request:<div>

    query must contain a valid garage_id
    body: { operation_hours }

  <p></p>
  <div>Response:</div>

    status code of 200 with a message "Operation hours updated successfully"

</details>

<details>
  <summary>/valet/:id/spots [PUT]</summary>
  <p></p>
  <div>Request:<div>

    query must contain a valid garage_id
    body: { spots }

  <p></p>
  <div>Response:</div>

    { garageId, spotIds || removedSpotsIds } reponse contains confirmed changes to the garage spots

</details>

<details>
  <summary>/user/:id [GET]</summary>
  <p></p>
  <div>Request:<div>

    query must contain a valid user_id

  <p></p>
  <div>Response:</div>

    Account information: { id, google_account_id, first_name, last_name, email, phone_number, role, contact_preferences }

</details>

<details>
  <summary>/user/:id [PUT]</summary>
  <p></p>
  <div>Request:<div>

    body: { first_name, last_name, email, phone_number }

  <p></p>
  <div>Response:</div>

    { id, first_name, last_name, google_account_id, email, phone_number, role, contact_preferences } response contains confirmed information for user account data

</details>

<details>
  <summary>/user/:id/cars [GET]</summary>
  <p></p>
  <div>Request:<div>

    query must contain a valid user_id

  <p></p>
  <div>Response:</div>

    [{ car information }]  reponse will be an array of all car objects associated with the user

</details>

<details>
  <summary>/user/:id/add-vehicle [POST]</summary>
  <p></p>
  <div>Request:<div>

    query must contain a valid user_id
    body: { make, model, color, license_plate_number }

  <p></p>
  <div>Response:</div>

    status code of 201

</details>

<details>
  <summary>/user/:id/edit-vehicle [PUT]</summary>
  <p></p>
  <div>Request:<div>

    body: { id, make, model, color, license_plate_number }

  <p></p>
  <div>Response:</div>

    status code of 200

</details>



<details>
  <summary>/user/:id/delete-vehicle [DELETE]</summary>
  <p></p>
  <div>Request:<div>

    body: { vehicleId }

  <p></p>
  <div>Response:</div>

    status code of 200

</details>

<details>
  <summary>/login/:id/driver [POST]</summary>
  <p></p>
  <div>Params:<div>

    :id =  user_id

  <p></p>
  <div>Request:<div>

    body: {
    first_name,
    last_name,
    email,
    phone_number, (of the form "(XXX)-XXX-XXXX")
    role, (for driver needs to be "user")
    make,
    model,
    color,
    license_plate_number
    }

  <p></p>
  <div>Response:</div>

    status code of 201

</details>

<details>
  <summary>/login/:id/valet [POST]</summary>
  <p></p>
  <div>Params:<div>

    :id =  user_id

  <p></p>
  <div>Request:<div>

    body: {
    first_name,
    last_name,
    email,
    phone_number, (of the form "(XXX)-XXX-XXXX")
    role, (for valet needs to be "admin")
    address,
    city,
    state,
    zip,
    country,
    name,
    operation_hours, (of the form "XX-XX" where X is a numerical digit)
    spots (where spots is an integer)
    }

  <p></p>
  <div>Response:</div>

    status code of 201

</details>

<details>
  <summary>/login/:id [GET]</summary>
  <p></p>
  <div>Params:<div>

    :id =  user_id

  <p></p>

  <div>Response:</div>

    [object] if the account exists or
    [] if the account does not exist

</details>




<p align="right"><a href="#readme-top">back to top</a></p>
