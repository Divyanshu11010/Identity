# **I-dentity : Solution for digital dentistry**
## 1. Installation :  
1. Clone this repository.
```properties
git clone "repo url"
```  
2. Install required packages by using command in projects' terminal
```properties
npm install
```
3. Create .env file with following fields  
   1. DATABASE_URL = "connection string of your db"
   2. JWT_SECRET = "secret for access token"
   3. JWT_REFRESH_SECRET = "secret for refresh token"
   4. ACCESS_EXPR_MIN = expiry period in minutes
   5. REFRESH_EXPR_DAYS = expiry period in days
   6. ACCESS_COOKIE_EXPR_MIN = access cookie expiry period
   7. REFRESH_COOKIE_EXPR_DAYS = refresh cookie expiry period  
   
4. Run following command in project's terminal to set schema in your db
```properties
npx prisma migrate dev
```
5. Start server
```properties
npm start
```
6. Now you can use **.http** files to send requests.



