import AWS from 'aws-sdk';
import middy from '@middy/core';
import httpJsonBodyParse from '@middy/http-json-body-parser';
import httpEventNormalizer from '@middy/http-event-normalizer';
import httpErrorHandler from '@middy/http-error-handler';
import createError from 'http-errors';

/**
 * @param {object} event: Object that contains all information (params, query) about the event (http)
 * @param {object} context: Object that contains additonal information about the event (http)
 */

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function getAuction(event, context) {
  let auction;
  const { id } = event.pathParameters;

  try {
    const result = await dynamodb
      .get({
        TableName: process.env.AUCTIONS_TABLE_NAME,
        Key: { id },
      })
      .promise();

    auction = result.Item;
  } catch (error) {
    throw new createError.InternalServerError(error);
  }

  if (!auction) {
    throw new createError.NotFound(`Auction with ID ${id} not found!`);
  }

  return {
    statusCode: 200,
    body: JSON.stringify(auctions),
  };
}

export const handler = middy(getAuction)
  .use(httpJsonBodyParse())
  .use(httpEventNormalizer())
  .use(httpErrorHandler());
