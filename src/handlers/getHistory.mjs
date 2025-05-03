// Create clients and set shared const values outside of the handler.

// Create a DocumentClient that represents the query to add an item
import { DynamoDBClient, } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';
const client = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(client);

// Get the DynamoDB table name from environment variables
const tableName = process.env.TABLE_NAME;

/**
 * A simple example includes a HTTP get method to get one item by id from a DynamoDB table.
 */
export const getHistoryHandler = async (event) => {
  try {
    // Extract the 'email' query parameter if provided
    const email = event.queryStringParameters?.email;

    let result;

    if (email) {
      // If email is provided, apply a filter on the Scan operation
      const params = {
        TableName: tableName,
        FilterExpression: 'email = :email',
        ExpressionAttributeValues: {
          ':email': email
        }
      };

      const data = await ddbDocClient.send(new ScanCommand(params));
      result = data.Items;
    }
    else {
      // If no email provided, get all items
      const params = {
        TableName: tableName,
      };

      const data = await ddbDocClient.send(new ScanCommand(params));
      result = data.Items;
    }

    // Return the items in a successful HTTP response
    const response = {
      statusCode: 200,
      body: JSON.stringify(result)
    };

    return response;
  }
  catch (err) {
    // Log and return any errors that occurred during execution
    console.log(err)
    return {
      statusCode: 500,
      body: JSON.stringify(err),
    };
  }


}
