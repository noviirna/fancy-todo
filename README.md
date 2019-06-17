# fancy-todo
fancy-todo

## installation

1. clone this repository
2. npm install on the server folder
3. set up .env files as below
```
MONGODB_URL=mongodb+srv:/novi:novi@phase2-porto-novi-l3m3t.gcp.mongodb.net/fancy-todoretryWrites=true
SECRET_JWT=rahasia-negara
SALT_ROUNDS=2
PASSWORD=gaada
PORT=3000
CLIENT_ID=463470913075-vb7r35en1t4mtv9bg0ejv166a7m36jf2.apps.googleusercontent.com
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
GET `/todos/project/:projectId` => get todo of a project
POST `/todos` => create new todo
PATCH `/todos/:todoId` => update todo
DELETE `/todos/:todoId` => delete todo

### backend routes - PROJECT
GET `/projects` => get project that belongs to a user
GET `/projects/:id` => get project by id
POST `/projects` => create new project
PATCH `/projects/:id?adminOnly=false` => update project
DELETE `/projects/:id?adminOnly=true` => delete project