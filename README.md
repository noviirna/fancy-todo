# fancy-todo
fancy-todo

## installation

1. clone this repository
2. npm install on the server folder
3. set up .env files as below
```
MONGODB_URL=[mongodb atlas url]
SECRET_JWT=[secret jwt]
SALT_ROUNDS=[salt round]
PASSWORD=[auto generated password]
PORT=[port]
CLIENT_ID=[google oauth client id]
```
4. run `npm run start` on server folder terminal
5. run `live-server --host=localhost` on client folder terminal


## server documentation 
### backend routes - USER
POST `/users/register` => register as a new user
POST `/users/login` => log in as a registered user
POST `/users/logingoogle` => log in using google
GET `/users/allname` => get all name & email of registered users

### backend routes - TODO
GET `/todos` => get todo that belongs to a user
GET `/todos/:todoId` => get todo by id
GET `/todos/project/:projectId` => get todos of a project
POST `/todos` => create new todo
PATCH `/todos/:todoId` => update todo
DELETE `/todos/:todoId` => delete todo

### backend routes - PROJECT
GET `/projects` => get projects that are assigned to user
GET `/projects/:id` => get project by id
POST `/projects` => create new project
PATCH `/projects/:id?adminOnly=false` => update project
DELETE `/projects/:id?adminOnly=true` => delete project

## server details
| description | route | method | req.headers | req.body | req.query | response on `success` | response on `error` | middlewares |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| register as a new user | `/users/register` | POST | - | name, email, password | - | { user object } | { message } | --- |
| log in as a registered user | `/users/login` | POST | - | name, email, password | - | { token } | { message } | --- |
| log in using google | `/users/logingoogle` | POST | - | ticket | - | { token } | { message } | --- |
| get all name & email of registered users | `/users/allname` | GET | { token } | - | - | [ { user object }] | { message } | authentication |
| get todo that belongs to a user | `/todos` | GET | { token } | - | - | [ { todos object } ] | { message } | authentication |
| get todo by id | `/todos/:todoId` | GET | { token } | - | - | { todos object } | { message } | authentication, authorization |
| get todos of a project | `/todos/project/:projectId` | GET | { token } | - | - | [ { todos object } ] | { message } | authentication, authorization |
| create new todo | `/todos` | POST | { token } | { todos object } | - | [ { todos object } ] | { message } | authentication |
| update todo | `/todos/:todoId` | PATCH | { token } | { todos object } | - | { todos object } | { message } | authentication, authorization |
| delete todo | `/todos/:todoId` | DELETE | { token } | todos._id | - | { todos object } | { message } | authentication, authorization |
| get projects that are assigned to user | `/projects` | GET | { token } | - | - | [ { project object } ] | { message } | authentication, authorization |
| get project by id | `/project/:projectId` | GET | { token } | - | - | { project object } | { message } | authentication, authorization |
| create new project | `/project` | POST | { token } | { project object } | - | { project object } | { message } | authentication |
| update project | `/todos/:todoId` | PATCH | { token } | { project object } | - | { project object } | { message } | authentication, authorization |
| delete project | `/todos/:todoId` | DELETE | { token } | project._id | - | { project object } | { message } | authentication, authorization |


## next update
1. make the server & client live on `http://noviirna-fancytodo.site`
2. fix some minor cosmetic bugs