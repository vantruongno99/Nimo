# Nimo - Crypto Price Search API

-	Search for a cryptocurrency price and receive it via email.
-	View historical search data (optionally filtered by email).

##  Tech Stack

| Layer        | Technology                 |
|-------------|----------------------------|
| Language     | Node.js                   |
| Hosting  | AWS Lambda + API Gateway       |
| Database     | Amazon DynamoDB           |
| Email        | SendGrid                  |
| IaC          | AWS SAM                   |
| CI/CD        | GitHub Actions            |


## Deployment Guide

This guide explains how to deploy the Nimo crypto tracking API using AWS SAM and GitHub Actions.

### Prerequisites

- AWS Account
- AWS CLI configured (`aws configure`)
- AWS SAM CLI installed
- Node.js installed (v18+)
- GitHub repository with this project code
- AWS credentials with permissions for Lambda, DynamoDB, API Gateway, etc.
- SendGrid Account

---

### 1. Clone the Repository

```bash
git clone https://github.com/vantruongno99/Nimo.git
cd Nimo
```
### 2. Configure Environment Variables
In your GitHub repo:

- Go to Settings > Secrets and variables > Actions > Repository secrets

- Add the following secrets:

| Name                    | Description                              |
| ----------------------- | ---------------------------------------- |
| `AWS_ACCESS_KEY_ID`     | Your AWS access key                      |
| `AWS_SECRET_ACCESS_KEY` | Your AWS secret key                      |
| `AWS_REGION`            | Your AWS region (e.g., `ap-southeast-2`) |
| `SENDGRID_API_KEY`      | Your SendGrid API key                    |
| `S3_BUCKET`             | Your SAM deployment bucket name          |

### 3. Manual Deployment (optional)
If you'd like to deploy manually using SAM:
```bash
npm install
sam build --use-container
sam deploy \
  --stack-name nimo-app \
  --s3-bucket YOUR_S3_BUCKET_NAME \
  --capabilities CAPABILITY_IAM \
  --parameter-overrides SendGridApiKey=YOUR_SENDGRID_API_KEY
```

### 4. CI/CD via GitHub Actions
This project includes a GitHub Actions workflow (.github/workflows/deploy.yml) that:
- Triggers on every push to main
- Builds and deploys the application using SAM
- Injects secrets via GitHub’s Actions environment

### 5. Accessing the API
After deployment, your endpoint will look like this:
```bash
https://<api-id>.execute-api.<region>.amazonaws.com/Prod/
```
Check the Outputs section of your deployed stack in the AWS CloudFormation console for the exact URL.



# Base URL

The base URL for the deployed API is: https://lw6h5lc5ag.execute-api.ap-southeast-2.amazonaws.com/Prod



#  API Documentation

### 🔹**POST /**  - *Send a crypto price to an email & log the request*

### Request
- **URL**: `/`
- **Method**: `POST`

### Body Parameters

| Name     | Type   | Required | Description                        |
|----------|--------|----------|------------------------------------|
| email    | string | ✅       | The recipient email address        |
| crypto   | string | ✅       | Crypto ID (e.g., bitcoin, ethereum) |

### Example

```json
{
  "email": "user@example.com",
  "crypto": "bitcoin"
}
```

### Success Response:
- **Code**: `200 OK`
- **Body**:
  ```json
  {
    "message": "The current price of Bitcoin is $90000"
  }
  ```

### Error Response:
- **Code**: `400 Bad Request`
- **Body**:
  ```json
  {
    "error": "Invalid crypto or API error"
  }
  ```

---

## 🔹 GET /history - Retrieve the search history for a given email

### Request
- **URL**: `/history`
- **Method**: `GET`

### Query Parameters

| Name  | Type   | Required | Description                          |
|-------|--------|----------|--------------------------------------|
| email | string | ❌       | (Optional) Filter history by email  |

### Example

```bash
 /history?email=user@example.com
```

### Success Response:
- **Code**: `200 OK`
- **Body**:
  ```json
  [
    {
        "id": "765f184e-26c6-4516-bfbb-5c057c6018f2",
        "email": "vantruongno99@gmail.com",
        "price": 1835.1,
        "crypto": "ethereum",
        "timestamp": "2025-05-03T02:37:14.893Z"
    },
    {
        "id": "a2b15980-4c2a-428e-b0b9-b98d83e9ec65",
        "email": "notfureshi@gmail.com",
        "price": 1835.15,
        "crypto": "ethereum",
        "timestamp": "2025-05-03T02:35:31.945Z"
    }
  ]
  ```

### Error Response:
- **Code**: `500 Internal Server Error`
- **Body**:
  ```json
  {
    "error": "Error retrieving search history."
  }
  ```


