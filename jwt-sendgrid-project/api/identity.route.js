import { Router } from "express";
import Datastore from "nedb";
import sendgrid from "./services/sendgrid.js";
import jwt from "jsonwebtoken";
import { build_verification_link } from './utilities/utils.js'

const db = new Datastore({filename: "./data.db", autoload: true })

const IdentityRoute = Router();

// Create a service class to handle the sending of messages.

IdentityRoute.post("/register", (request, response) => {
    try {
        // Initialize Sendgrid 
        const { username, email, password } = request.body;
        db.insert({username, email, password, verified: false }, async (err, data) => {
            if( err ) throw new Error("Unable to insert data.")
            const token = jwt.sign(
                { id: data._id, email: data.email}, 
                "secret_key", 
                {expiresIn: "15m" }
            )
            const url = build_verification_link(request, token)
            await sendgrid.send_email(email, url )
            response.status(200).json({message: "Success"})
        });
    } catch(e) {
        console.error("An error occurred", e)
        response.status(400).json({message: "Unable to register user."})
    }
})

IdentityRoute.post('/login', (request, response) => {
    try {
        const { email, password } = request.body;
        
        db.findOne({email}, (error, data) => {
            if( error ) throw new Error("Invalid credentials")

            if( data.password != password ) {
                response
                    .status(400)
                    .json({message: "Invalid credentials"})
                    return;
            }

            if( !data.verified ) {
                response
                    .status(400)
                    .json({message: "Email not verified"})
                    return;
            }

            response
                .status(200)
                .json({message: "Success"})
        })

    } catch(e) {
        console.error(e)
        response.status(400).json({message: "Invalid Credentials"})
    }
})

IdentityRoute.get("/verify-email", (request, response) => {
    try {
        const user_to_verify = jwt.verify(request.query.token, "secret_key") 

        db.findOne({_id: user_to_verify.id }, (error, user_data ) => {
            // was user found
            if( user_data == null ) {
                response
                    .status(404)
                    .json({message: "User not found"})
                return
            }

            // was user verified
            if( user_data.verified ) {
                response
                    .status(200)
                    .json({message: "Email has already been verified."})
                return
            }

            // Verify User
            db.update(
                {_id: user_data._id},
                {$set: { verified: true }},
                function(err) {
                    if( err ) {
                        response
                            .status(400)
                            .json({  message: 'Unable to verify user.'  })
                    }
                    response
                        .status(200)
                        .json({  message: 'Email verified successfully.'  })
                }
            )
        } )
    }catch(e) {
        response.status(400).json({message: "Invalid Token"})
    }
})

IdentityRoute.post("/resend-verification", (request, response) => {
    try {
        const { email } = request.body;
        db.findOne({email}, async (error, user_data) => {
            if( error || user_data == null ) {
                response
                    .status(400)
                    .json({message: "Invalid Credentials"})
                return
            }

             // was user verified
             if( user_data.verified ) {
                response
                    .status(200)
                    .json({message: "Email has already been verified."})
                return
            }

            // Create token
            const token = jwt.sign(
                { id: user_data._id, email: user_data.email}, 
                "secret_key", 
                {expiresIn: "15m" }
            )

            const url = build_verification_link(request, token)
            await sendgrid.send_email(email, url )

            response
                .status(200)
                .json({message: "Verification sent."})

        })
    } catch(e) {
        response
        .status(400)
        .json({message: "Invalid Credentials"})
    }
})

export default IdentityRoute;