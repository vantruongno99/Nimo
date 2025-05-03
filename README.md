# Nimo - Crypto Price Search API

**Crypto Price Tracker API**

-	Search for a cryptocurrency price and receive it via email.
-	View historical search data (optionally filtered by email).

# Base URL

The base URL for the deployed API is: https://lw6h5lc5ag.execute-api.ap-southeast-2.amazonaws.com/Prod


#  API Endpoints

### 🔹**POST /**  : *Send a crypto price to an email & log the request*

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
    "message": "Invalid crypto symbol or API error"
  }
  ```

---

## 🔹 GET /history : Retrieve the search history for a given email

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


