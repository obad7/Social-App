# Social Media Api (Node.js, Express, JavaScript, MongoDB)
This is a [Express.js](https://expressjs.com/) Social Media Application designed for creating, managing, and interacting with posts and comments. 
It includes features for user authentication, profile management, and administrative controls. 
The app uses various technologies and libraries to provide a seamless experience.

## Project Structure

```
src/
 ├── DB/
 │   ├── Models/
 │   │   ├── connection.js
 │   │   ├── dbService.js
 ├── Middlewares/
 │   ├── auth.middleware.js
 │   ├── validation.middleware.js
 ├── Modules/
 │   ├── Admin/
 │   ├── Auth/
 │   ├── Comment/
 │   ├── Post/
 │   ├── User/
 ├── utils/
 │   ├── emails/
 │   ├── encryption/
 │   ├── error handling/
 │   ├── file uploading/
 │   ├── hashing/
 │   ├── token/
 ├── app.server.js
```

## Technologies Used

- **Node.js**: JavaScript runtime for server-side applications.
- **Express**: Web framework for building APIs.
- **JavaScript**: Programming language used for building the application.
- **MongoDB**: NoSQL database for storing catalog data.
- **Mongoose**: ODM (Object Data Modeling) library for MongoDB.
- **Joi**: Schema-based validation library for validating incoming requests.

## Install Dependencies:

   ```bash
   npm install
   ```
## Environment Variables

Create a `.env` file in the root directory with the following environment variables:

```bash
# MongoDB connection string
MONGO_URI=mongodb://127.0.0.1:27017/SocialApp

# Server port
PORT=3000
```

---

## Available Scripts

In the project directory, you can run the following scripts:

### `npm run dev`

Runs the application in development mode using **nodemon**. The server will restart upon changes.

```bash
npm run dev
```
---

## API Endpoints

### Authentication

- **GET auth/loginWithGmail**: Login With Gmail.
- **POST auth/register**: Register With Email & Password.
- **PATCH auth/varyfyEmail**: Confirm Eamil.
- **PATCH auth/resendEmail**: Resend Confirm Code Email.
- **POST auth/login**: Login With Email & Password .
- **GET auth/refresh_token**: Refresh User Token.
- **GET auth/forget_password**: Forget Password.
- **GET auth/reset_password**: reset_password.

### User

- **POST user/profile**: Get User Profile.
- **GET user/profile/:id**: View & Share Profile.
- **PATCH user/profile/email**: Update User Email.
- **PATCH user/profile/resetEmail**: Reset User Email.
- **PATCH user/updateProfile**: Update User Profile.
- **PATCH user/updatePassword**: Update User Password.
#### upload files on local storage
- **POST user/profilePicture**: Upload Profile Picture Image.
- **POST user/multipleImages**: Upload Multiple Images.
- **DELETE User/deleteProfilePicture**: Delete Profile Picture.
#### upload files on cloud using cloudinary
- **POST user/uploadPictureOnCloud**: Upload Profile Picture On Cloudinary.
- **DELETE User/deleteImageOnCloud**: Delete Image From Cloudinary.















