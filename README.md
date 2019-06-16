# fancy-todo
fancy-todo

### backend routes - USER
POST `/users/register` => register as a new user
POST `/users/login` => log in as a registered user
POST `/users/logingoogle` => log in using google
GET `/users/allname` => get all name & email of registered users

### backend routes - TODO
GET `/todos` => get todo that belongs to a user
GET `/todos/:todoIid` => get todo by id
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