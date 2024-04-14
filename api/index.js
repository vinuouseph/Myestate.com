import express from "express";
import mongoose from "mongoose";
import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.route.js';
import listingRouter from './routes/listing.route.js';
import wishlistRouter from './routes/wishlist.route.js';
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import nodemailer from 'nodemailer';
import cors from 'cors';
import User from './models/user.model.js';
import Wishlist from "./models/wishlist.model.js";

mongoose.connect("mongodb+srv://naveenantonyp:mech1032@cluster0.palocap.mongodb.net/property-website?retryWrites=true&w=majority").then(() => {
    console.log('Connected to MongoDB!');
})
    .catch((err) => {
        console.log(err);
    });

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:5173'
}));

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: '58.rahulkr@gmail.com',
        pass: 'idajjyjoffzlgute'
    },
    debug: true,
    logger: true
});

// Send email route
app.post('/send-email', async (req, res) => {
    const { date, time, name, landlordEmail, user } = req.body;

    // Display the fetched landlord's email in the console
    console.log('Landlord Email:', landlordEmail);

    const mailOptions = {
        from: '58.rahulkr@gmail.com',
        to: landlordEmail || 'krajanmadhavan@gmail.com', // Use the landlord's email from the request body
        subject: 'Booking Request',
        text: `Your property ${name} has been successfully booked for a visit on ${date} at ${time} by ${user}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            res.status(500).send('Error sending email');
        } else {
            console.log('Email sent: ' + info.response);
            res.send('Email sent successfully');
        }
    });
});

app.listen(3000, () => {
    console.log('Server is running on port 3000!');
});

app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/listing', listingRouter);
app.use('/api/wishlist', wishlistRouter);

app.delete('/api/wishlist/:wishlistId', async (req, res, next) => {
    const wishlistId = req.params.wishlistId;

    try {
        // Find wishlist by ID and delete it
        const deletedWishlist = await Wishlist.findByIdAndDelete(wishlistId);

        if (!deletedWishlist) {
            throw new Error('Wishlist not found');
        }

        res.status(200).json({ success: true, message: 'Wishlist deleted successfully' });
    } catch (error) {
        next(error);
    }
});

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    return res.status(statusCode).json({
        success: false,
        statusCode,
        message
    });
});