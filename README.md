# 🔗 Serverless URL Shortener (AWS)

A cost-efficient, serverless URL shortener built with AWS services. This project demonstrates how to build and deploy a scalable solution for shortening URLs with custom hashing, moderate latency, and traffic control—without managing any servers.

## 🚀 Features

- **Serverless architecture** using AWS Lambda, API Gateway, S3, and CloudFront
- **MD5 + Base64 encoding** to generate unique, compact short URLs
- **Traffic control** via API Gateway request throttling
- **Caching** with CloudFront to improve response time
- **Persistent storage** of URL mappings in S3
- **Low cost** and scalable infrastructure

## 🛠️ Tech Stack

- **AWS Lambda** – Backend logic (create and resolve short URLs)
- **Amazon API Gateway** – RESTful endpoints with rate limiting
- **Amazon S3** – Key-value store for URL mappings
- **Amazon CloudFront** – CDN for faster access and caching
- **Node.js** – Lambda runtime (use whichever you prefer)

## 📐 Architecture

1. **Create Short URL**  
   - A long URL is sent via a POST request to API Gateway.  
   - Lambda function hashes the long URL using MD5 + Base64.  
   - The mapping (`short -> long`) is saved to an S3 bucket.

2. **Redirect via Short URL**  
   - GET request with the short path hits CloudFront → API Gateway.  
   - Lambda retrieves the long URL from S3 and issues a redirect.

3. **Traffic Control**  
   - API Gateway throttling protects against abuse and spikes.

## 🧪 Setup Instructions

> Prerequisites: AWS CLI configured, Node.js/Python installed, and AWS account ready.

1. **Clone the repository**
   ```bash
   git clone https://github.com/sunnybhadana/url-shortner.git
   cd url-shortener
   cd frontend
   npm i
   npm start
