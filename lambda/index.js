import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';  // Import S3 client v3
import crypto from 'crypto';  // Import crypto library for MD5 hashing


// Create S3 client
const s3Client = new S3Client({ region: 'ap-south-1' });  // Choose your region
// PUT YOUR ENVIRONMENT VARIABLES IN AWS LAMBDA ENVIRONMENT VARIABLES
const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME; // your S3 bucket name
const DOMAIN_URL = process.env.DOMAIN_URL; // your website domain URL
const RECAPTCHA_SECRETS = process.env.RECAPTCHA_SECRETS; // your reCAPTCHA secret key if using reCAPTCHA
const USE_GOOGLE_RECAPTCHA = process.env.USE_GOOGLE_RECAPTCHA === 'true'; // whether to use Google reCAPTCHA or not

// Define CORS headers
const CORS_HEADERS = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "*",
    "Access-Control-Allow-Methods": "*"
};

// Handle pre-flight (OPTIONS) requests for CORS
const handleOptionsRequest = () => {
    return {
        statusCode: 200,
        body: JSON.stringify({}),
        headers: CORS_HEADERS,  // Include the CORS headers for pre-flight requests
    };
};

// function to create a short URL
async function createShortUrl(longUrl, attempt = 0) {
    const maxAttempts = 5;
    let md5Hash = crypto.createHash('md5').update(longUrl).digest('hex');
    if (attempt > 0) {
        // If this is a retry, append the attempt number to the URL
        md5Hash = crypto.createHash('md5').update(longUrl + attempt).digest('hex');
    }
    let base64Hash = Buffer.from(md5Hash, 'hex').toString('base64');
    let shortUrl = base64Hash.slice(0, 8);  // Take first 8 characters for brevity
    // Check if the short URL already exists in S3
    let s3Key = `urls/${shortUrl}.json`;  // Store each URL mapping as a JSON file
    let params = {
        Bucket: S3_BUCKET_NAME,
        Key: s3Key,
    };
    let command = new GetObjectCommand(params);
    try {
        const data = await s3Client.send(command);
        // If the short URL already exists, increment the attempt and try again
        if (data) {
            console.log(`Short URL ${shortUrl} already exists, checking longUrl...`);
            // check if the long URL is the same
            let body = '';
            for await (const chunk of data.Body) {
                body += chunk;
            }
            const existingData = JSON.parse(body);
            if (existingData.longUrl === longUrl) {
                // If the long URL is the same, return the existing short URL
                return { shortUrl, exists: true };
            } else {
                // If the long URL is different, increment the attempt and try again
                attempt++;
                console.log(`Long URL is different, trying again with attempt ${attempt}`);
            }
            if (attempt < maxAttempts) {
                return createShortUrl(longUrl, attempt);
            } else {
                throw new Error('Max attempts reached for generating a unique short URL');
            }
        }
    } catch (error) {
        if (error.name === 'NoSuchKey') {
            // The short URL does not exist, so we can use it
            return { shortUrl, exists: false };
        } else {
            throw error;  // Rethrow other errors
        }
    }
}

// Lambda function handler
export const handler = async (event) => {
    // Handle OPTIONS request for CORS pre-flight
    if (event.requestContext.http.method === 'OPTIONS') {
        return handleOptionsRequest();
    }

    try {
        // Log the entire event to inspect its structure
        console.log("Full event received:", JSON.stringify(event));
        // get google captcha token from request
        // 1. Check if event.body is valid and not empty
        const body = JSON.parse(event.body);
        // check size of body, if more than 1000 characters, return error
        if (body.url.length > 2000) {
            console.error('Error: Request body is too large');
            return {
                statusCode: 400,
                body: JSON.stringify({
                    message: 'Bad Request: Request body is too large'
                }),
                headers: CORS_HEADERS,  // Use the global CORS headers
            };
        }
        if(USE_GOOGLE_RECAPTCHA) {
            const captchaToken = body.recaptchaToken; // Extract the captcha token from the request body
        if (!captchaToken) {
            console.error('Error: Missing reCAPTCHA token in request body');
            return {
                statusCode: 400,
                body: JSON.stringify({
                    message: 'Bad Request: reCAPTCHA token is required in the body'
                }),
                headers: CORS_HEADERS,  // Use the global CORS headers
            };
        }
        // Verify the reCAPTCHA token with Google
        const recaptchaSecret = RECAPTCHA_SECRETS; // Get the reCAPTCHA secret from environment variables
        const recaptchaResponse = await fetch('https://www.google.com/recaptcha/api/siteverify', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `secret=${recaptchaSecret}&response=${captchaToken}`,
        });
        const recaptchaData = await recaptchaResponse.json();
        if (!recaptchaData.success) {
            console.error('Error: reCAPTCHA verification failed');
            return {
                statusCode: 400,
                body: JSON.stringify({
                    message: 'Bad Request: Invalid reCAPTCHA token'
                }),
                headers: CORS_HEADERS,  // Use the global CORS headers
            };
        }
        }
        // 2. Check if the request body is valid JSON

        if (!body) {
            console.error('Error: No body in request or invalid JSON');
            return {
                statusCode: 400,
                body: JSON.stringify({
                    message: 'Bad Request: Missing or invalid request body'
                }),
                headers: CORS_HEADERS,  // Use the global CORS headers
            };
        }

        // 2. Check for the URL field
        const longUrl = body.url;
        if (!longUrl) {
            console.error('Error: Missing URL in request body');
            return {
                statusCode: 400,
                body: JSON.stringify({
                    message: 'Bad Request: URL is required in the body'
                }),
                headers: CORS_HEADERS,  // Use the global CORS headers
            };
        }

        // 3. Generate the unique short URL using MD5 and Base64 encoding
        const { shortUrl, exists } = await createShortUrl(longUrl);
        if (!exists) {
            // 4. Prepare the data to store in S3 (Long URL -> Short URL mapping)
            const s3Key = `urls/${shortUrl}.json`;  // Store each URL mapping as a JSON file
            const s3Object = {
                longUrl: longUrl,
                shortUrl: shortUrl
            };

            // 5. Save the mapping in S3 using the PutObjectCommand
            const params = {
                Bucket: S3_BUCKET_NAME,
                Key: s3Key,
                Body: JSON.stringify(s3Object),
                ContentType: 'application/json',
                CacheControl: 'max-age=31536000' // Cache for 1 year
            };

            const command = new PutObjectCommand(params);
            await s3Client.send(command);
        }

        // 6. Return the short URL response
        const response = {
            statusCode: 200,
            body: JSON.stringify({
                shortUrl: `${DOMAIN_URL}/${shortUrl}` // Returning the full short URL with CloudFront URL
            }),
            headers: CORS_HEADERS,  // Use the global CORS headers
        };

        return response;
    } catch (error) {
        console.error("Error:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'Internal Server Error',
                error: error.message,
            }),
            headers: CORS_HEADERS,  // Use the global CORS headers
        };
    }
};
