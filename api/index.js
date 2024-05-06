    import express from "express";
    import mongoose from "mongoose";
    import userRouter from './routes/user.route.js';
    import authRouter from './routes/auth.route.js';
    import listingRouter from './routes/listing.route.js';
    import wishlistRouter from './routes/wishlist.route.js';
    import commentRouter from './routes/comment.route.js';
    import ratingRouter from './routes/rating.routes.js';
    import saveSearchRouter from './routes/saveSearch.route.js';
    import cookieParser from "cookie-parser";
    import nodemailer from 'nodemailer';
    import cors from 'cors';
    import Wishlist from "./models/wishlist.model.js";
    import dotenv from 'dotenv';
    dotenv.config();
    
    
    mongoose.connect(process.env.MONGO).then(() => {
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
            user: 'myestate64@gmail.com',
            pass: 'ullkyzpkyegtilzb'
        },
        debug: true,
        logger: true,
        tls: {
          rejectUnauthorized: false // do not fail on invalid certs
        }
    });
    
    // Send email route
    app.post('/send-email', async (req, res) => {
        const { date, time, name, landlordEmail, user } = req.body;
    
        // Display the fetched landlord's email in the console
        console.log('Landlord Email:', landlordEmail);
    
        const mailOptions = {
            from: 'myestate64@gmail.com',
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
    
    app.post('/send-listings-email', async (req, res) => {
        const { listings, useremail } = req.body;
      
        try {
          
      
          let emailContent = 'Here are the Listing Details based on your new savedsearch:\n\n';
      
          for (const listing of listings) {
            emailContent += `Name: ${listing.name}\n`;
            emailContent += `Address: ${listing.address}\n`;
            emailContent += `Regular Price: ${listing.regularPrice}\n`;
            emailContent += `Discount Price: ${listing.discountPrice}\n`;
            emailContent += `Baths: ${listing.bathrooms}\t`;
            emailContent += `Beds: ${listing.bedrooms}\n`;
            emailContent += `${listing.furnished ? '✔' : '✘'} Furnished\t`;
            emailContent += `${listing.parking ? '✔' : '✘'} Parking\n`;
            emailContent += `Type: ${listing.type.toUpperCase()}\n\n`;
          }
      
          const mailOptions = {
            from: 'myestate64@gmail.com',
            to: useremail,
            subject: 'Listing Details',
            text: emailContent
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
        } catch (error) {
          console.error(error);
          res.status(500).send('Internal server error');
        }
      });
    
      app.post('/send-savedsearches-email', async (req, res) => {
        const { listings, useremail, searchNames } = req.body;
      
        try {
          
      
          let emailContent = `The new Listings based on your savedseach - ${searchNames} is:\n\n`;
      
          for (const listing of listings) {
            emailContent += `Name: ${listing.name}\n`;
            emailContent += `Address: ${listing.address}\n`;
            emailContent += `Regular Price: ${listing.regularPrice}\n`;
            emailContent += `Discount Price: ${listing.discountPrice}\n`;
            emailContent += `Baths: ${listing.bathrooms}\t`;
            emailContent += `Beds: ${listing.bedrooms}\n`;
            emailContent += `${listing.furnished ? '✔' : '✘'} Furnished\t`;
            emailContent += `${listing.parking ? '✔' : '✘'} Parking\n`;
            emailContent += `Type: ${listing.type.toUpperCase()}\n\n`;
          }
      
          const mailOptions = {
            from: 'myestate64@gmail.com',
            to: useremail,
            subject: 'Listing Details',
            text: emailContent
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
        } catch (error) {
          console.error(error);
          res.status(500).send('Internal server error');
        }
      });
    
    app.listen(3000, () => {
        console.log('Server is running on port 3000!');
    });
    
    app.post('/api/send-email', async (req, res) => {
        const { message, userEmail, landlordEmail, listingName } = req.body;
    
        const mailOptions = {
            from: 'myestate64@gmail.com', 
            to: landlordEmail,
            subject: `Inquiry about your listing ${listingName} `,
            text: `From: ${userEmail}\n\n${message}`
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
    
    app.use('/api/user', userRouter);
    app.use('/api/auth', authRouter);
    app.use('/api/listing', listingRouter);
    app.use('/api/wishlist', wishlistRouter);
    app.use('/api/ratings', ratingRouter); 
    app.use('/api/comment', commentRouter);
    app.use('/api/save', saveSearchRouter);
    
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
