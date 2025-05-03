// Create clients and set shared const values outside of the handler.

// Create a DocumentClient that represents the query to add an item
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
const client = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(client);
import sgMail from '@sendgrid/mail'
import { v4 as uuidv4 } from 'uuid'
import axios from 'axios';

// Get the DynamoDB table name from environment variables
const tableName = process.env.TABLE_NAME;
const SGApi = process.env.SENDGRID_API_KEY;

/**
 * A simple example includes a HTTP get method to get all items from a DynamoDB table.
 */
export const getCryptoHandler = async (event) => {

  // Parse incoming request body for email and crypto 
  const { email, crypto } = JSON.parse(event.body);
  // Set SendGrid API key for email sending
  sgMail.setApiKey(SGApi)


  let price;

  try {
    // Get crypto detail from Coingecko API to get price in USD
    const res = await axios.get(`https://api.coingecko.com/api/v3/simple/price`, {
      params: { ids: crypto, vs_currencies: 'usd' }
    });

    console.log(res)

    price = res.data[crypto]?.usd;

    // If price (crypto) is not found, throw an error
    if (!price) throw new Error('Crypto not found');

  }
  catch (err) {
    console.error('Error fetching price:', err);
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Invalid crypto symbol or API error' }),
    };
  }

  try {
    // Compose and send an email with the crypto price
    const msg = {
      to: email,
      from: 'vantruongno99@gmail.com',
      subject: `Crypto Price: ${crypto.toUpperCase()}`,
      text: `The current price of ${crypto.toUpperCase()} is $${price}`,
    }

    await sgMail.send(msg)


  }
  catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify(err),
    };
  }

  try {
    // Save email, crypto, price, and timestamp to DynamoDB table
    await ddbDocClient.send(new PutCommand({
      TableName: tableName,
      Item: {
        id: uuidv4(), // Unique ID for the record
        email,
        crypto,
        price,
        timestamp: new Date().toISOString()
      }
    }));

  }
  catch (err) {

    console.log(err)

    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to save search to database' }),
    };
  }


  // Return success response with price
  const response = {
    statusCode: 200,
    body: JSON.stringify(`The current price of ${crypto.toUpperCase()} is $${price}`)
  };

  return response;
}
